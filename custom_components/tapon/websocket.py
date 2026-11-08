"""Websocket commands used by the card (all ``tapon/...``)."""

from __future__ import annotations

import base64
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from . import ai, core, labels
from .const import (
    CONF_ALERT_DAYS,
    CONF_AUTO_LABELS,
    DEFAULT_ALERT_DAYS,
    DEFAULT_AUTO_LABELS,
    EVENT_UPDATED,
    REMOVAL_REASONS,
    WINE_TYPES,
)


def async_register(hass: HomeAssistant) -> None:
    for handler in (
        ws_subscribe, ws_get_data, ws_add_bottles, ws_update_bottle, ws_move_bottle,
        ws_remove_bottle, ws_get_history, ws_restore, ws_save_rack, ws_delete_rack,
        ws_get_label, ws_request_label, ws_take_code, ws_update_settings, ws_get_alerts,
        ws_ai_recognize, ws_ai_fill, ws_pair, ws_rate_history,
        ws_reserve_bottle, ws_remove_bottles, ws_wishlist_add, ws_wishlist_update, ws_wishlist_remove,
        ws_inventory_start, ws_inventory_stop, ws_highlight, ws_highlight_clear, ws_check_wine, ws_open_bottle,
    ):
        websocket_api.async_register_command(hass, handler)


def _store(hass: HomeAssistant, connection, msg) -> Any:
    store = core.get_store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_ready", "Tapon non è configurato")
    return store


def _snapshot(hass: HomeAssistant) -> dict[str, Any]:
    store = core.get_store(hass)
    alerts = core.current_alerts(hass)
    flagged = {
        bid: status for status, items in alerts.items() for e in items for bid in e["bottle_ids"]
    }
    from .logic import cellar_value, wine_key, wine_ratings

    ratings = wine_ratings(store.history)

    def past(b: dict[str, Any]) -> dict[str, Any]:
        r = ratings.get(wine_key(b))
        return {"past_rating": r["rating"], "past_count": r["count"], "past_notes": r["notes"]} if r else {}

    def opened(b: dict[str, Any]) -> dict[str, Any]:
        info = core.opened_info(b)
        return {"opened_days": info["days"], "opened_state": info["state"], "opened_limit": info["limit"]} if info else {}

    return {
        "racks": sorted(store.racks, key=lambda r: r.get("order", 0)),
        "bottles": [{**b, "alert": flagged.get(b["id"]), **past(b), **opened(b)} for b in store.bottles],
        "value": cellar_value(store.bottles),
        "wishlist": list(reversed(store.wishlist)),
        "inventory": store.inventory_report(),
        "highlight": store.highlight,
        "settings": {
            "label_format": core.label_format(store),
            CONF_AUTO_LABELS: bool(store.settings.get(CONF_AUTO_LABELS, DEFAULT_AUTO_LABELS)),
            CONF_ALERT_DAYS: int(store.settings.get(CONF_ALERT_DAYS, DEFAULT_ALERT_DAYS)),
        },
        "types": {k: {"label": v[0], "color": v[1]} for k, v in WINE_TYPES.items()},
        "reasons": REMOVAL_REASONS,
        "history_count": len(store.history),
        "ai": bool(_gemini(hass)[0]),
        "climate": core.climate_config(hass),
        "printer": bool(core._options(hass).get("printer_device")),
    }


def _gemini(hass: HomeAssistant) -> tuple[str, str]:
    from .const import CONF_GEMINI_KEY, CONF_GEMINI_MODEL, DOMAIN

    entries = hass.config_entries.async_entries(DOMAIN)
    options = entries[0].options if entries else {}
    return (options.get(CONF_GEMINI_KEY) or "").strip(), (options.get(CONF_GEMINI_MODEL) or ai.DEFAULT_MODEL).strip()


async def _ai_call(hass, connection, msg, prompt: str, images: list[str]) -> None:
    from homeassistant.helpers.aiohttp_client import async_get_clientsession

    key, model = _gemini(hass)
    if not key:
        connection.send_error(msg["id"], "no_ai", "Aggiungi la chiave Gemini nelle opzioni di Tapon "
                              "(Impostazioni → Dispositivi e servizi → Tapon → Configura).")
        return
    try:
        wine = await ai.async_generate(async_get_clientsession(hass), key, model, prompt, images)
    except ai.AIError as err:
        connection.send_error(msg["id"], "ai_error", str(err))
        return
    connection.send_result(msg["id"], {"wine": wine})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/ai_recognize",
    vol.Required("image"): str,
    vol.Optional("back_image"): str,
})
@websocket_api.async_response
async def ws_ai_recognize(hass, connection, msg) -> None:
    """Read a label photo (and optionally the back label)."""
    images = [msg["image"]] + ([msg["back_image"]] if msg.get("back_image") else [])
    await _ai_call(hass, connection, msg, ai.label_prompt(), images)


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/ai_fill",
    vol.Required("wine"): dict,
})
@websocket_api.async_response
async def ws_ai_fill(hass, connection, msg) -> None:
    """Complete a wine from what is already known (name, producer, vintage…)."""
    if not str(msg["wine"].get("name") or "").strip():
        connection.send_error(msg["id"], "no_name", "Scrivi almeno il nome del vino")
        return
    await _ai_call(hass, connection, msg, ai.fill_prompt(msg["wine"]), [])


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/pair",
    vol.Optional("dish"): vol.All(str, vol.Length(max=300)),
    vol.Optional("courses"): vol.All([vol.All(str, vol.Length(max=200))], vol.Length(max=8)),
})
@websocket_api.async_response
async def ws_pair(hass, connection, msg) -> None:
    """Suggest which wines of the cellar go with a dish, or with a whole menu."""
    from datetime import date

    from homeassistant.helpers.aiohttp_client import async_get_clientsession

    from .logic import cellar_wines, local_pairing, wine_ratings

    store = _store(hass, connection, msg)
    if store is None:
        return
    courses = [c.strip() for c in msg.get("courses") or [] if c.strip()]
    dish = (msg.get("dish") or "").strip()
    if not dish and not courses:
        connection.send_error(msg["id"], "no_dish", "Scrivi cosa mangi")
        return
    if len(courses) == 1:
        dish, courses = courses[0], []
    lead = int(store.settings.get(CONF_ALERT_DAYS, DEFAULT_ALERT_DAYS))
    available = [b for b in store.bottles if not b.get("reserved_for")]  # set aside for an occasion
    wines = cellar_wines(available, store.racks, date.today(), lead, wine_ratings(store.history))
    if not wines:
        connection.send_error(msg["id"], "empty", "La cantina è vuota: non ho niente da consigliarti")
        return

    def pick(index: int | None, reason: str) -> dict[str, Any] | None:
        return {**wines[index], "reason": reason} if index is not None else None

    key, model = _gemini(hass)
    note = ""
    if key:
        session = async_get_clientsession(hass)
        try:
            if courses:
                result = await ai.async_generate(
                    session, key, model, ai.menu_prompt(courses, wines),
                    parse=lambda payload: ai.parse_menu(payload, len(courses), len(wines)),
                )
                connection.send_result(msg["id"], {
                    "source": "ai", "advice": result["advice"],
                    "courses": [{"course": c, "wine": pick(r["index"], r["reason"]), "reason": r["reason"]}
                                for c, r in zip(courses, result["courses"])],
                    "one": pick(result["one"]["index"], result["one"]["reason"]) if result["one"] else None,
                })
            else:
                result = await ai.async_generate(
                    session, key, model, ai.pairing_prompt(dish, wines),
                    parse=lambda payload: ai.parse_pairing(payload, len(wines)),
                )
                connection.send_result(msg["id"], {
                    "source": "ai", "advice": result["advice"],
                    "picks": [pick(p["index"], p["reason"]) for p in result["picks"]],
                })
            return
        except ai.AIError as err:
            note = f"Gemini non disponibile ({err}); ecco un consiglio semplificato."
    else:
        note = "Consiglio semplificato: aggiungi la chiave Gemini nelle opzioni per uno più preciso."
    index = {w["key"]: i for i, w in enumerate(wines)}
    if courses:
        out = []
        for course in courses:
            best = local_pairing(course, wines, limit=1)
            wine = pick(index[best[0]["key"]], best[0]["reason"]) if best else None
            out.append({"course": course, "wine": wine, "reason": wine["reason"] if wine else ""})
        connection.send_result(msg["id"], {"source": "local", "advice": note, "courses": out, "one": None})
        return
    picks = [pick(index[p["key"]], p["reason"]) for p in local_pairing(dish, wines)]
    connection.send_result(msg["id"], {"source": "local", "advice": note, "picks": picks})


@websocket_api.websocket_command({vol.Required("type"): "tapon/subscribe"})
@callback
def ws_subscribe(hass, connection, msg) -> None:
    """Push a fresh snapshot to the card whenever the data changes."""
    if core.get_store(hass) is None:
        connection.send_error(msg["id"], "not_ready", "Tapon non è configurato")
        return

    @callback
    def _forward(_event) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], _snapshot(hass)))

    connection.subscriptions[msg["id"]] = hass.bus.async_listen(EVENT_UPDATED, _forward)
    connection.send_result(msg["id"])
    connection.send_message(websocket_api.event_message(msg["id"], _snapshot(hass)))


@websocket_api.websocket_command({vol.Required("type"): "tapon/get_data"})
@callback
def ws_get_data(hass, connection, msg) -> None:
    if _store(hass, connection, msg):
        connection.send_result(msg["id"], _snapshot(hass))


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/add_bottles",
    vol.Required("wine"): dict,
    vol.Optional("quantity", default=1): vol.All(int, vol.Range(min=1, max=100)),
    vol.Optional("rack_id"): vol.Any(str, None),
    vol.Optional("row"): vol.Any(int, None),
    vol.Optional("col"): vol.Any(int, None),
    vol.Optional("wish_id"): vol.Any(str, None),
})
@websocket_api.async_response
async def ws_add_bottles(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    added = store.add_bottles(msg["wine"], msg["quantity"], msg.get("rack_id"), msg.get("row"), msg.get("col"))
    if msg.get("wish_id"):
        store.remove_wish(msg["wish_id"])  # bought: it leaves the wishlist
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"bottles": added})
    hass.async_create_task(core.async_on_added(hass, added))


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/update_bottle",
    vol.Required("bottle_id"): str,
    vol.Required("changes"): dict,
    vol.Optional("same_wine", default=False): bool,
})
@websocket_api.async_response
async def ws_update_bottle(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    updated = store.update_bottle(msg["bottle_id"], msg["changes"], msg["same_wine"])
    if not updated:
        connection.send_error(msg["id"], "not_found", "Bottiglia non trovata")
        return
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"updated": len(updated)})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/move_bottle",
    vol.Required("bottle_id"): str,
    vol.Required("rack_id"): vol.Any(str, None),
    vol.Optional("row"): vol.Any(int, None),
    vol.Optional("col"): vol.Any(int, None),
})
@websocket_api.async_response
async def ws_move_bottle(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    if not store.move_bottle(msg["bottle_id"], msg["rack_id"], msg.get("row"), msg.get("col")):
        connection.send_error(msg["id"], "invalid", "Spostamento non valido")
        return
    await core.async_changed(hass)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/remove_bottle",
    vol.Required("bottle_id"): str,
    vol.Optional("reason", default="drank"): vol.In(list(REMOVAL_REASONS)),
    vol.Optional("rating"): vol.Any(None, vol.All(int, vol.Range(min=1, max=5))),
    vol.Optional("tasting_notes"): vol.Any(None, vol.All(str, vol.Length(max=1000))),
})
@websocket_api.async_response
async def ws_remove_bottle(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    entry = store.remove_bottle(msg["bottle_id"], msg["reason"], msg.get("rating"), msg.get("tasting_notes"))
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Bottiglia non trovata")
        return
    wish = store.maybe_rebuy(entry)
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"history_id": entry["history_id"], "wishlisted": bool(wish)})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/remove_bottles",
    vol.Required("bottle_ids"): [str],
    vol.Optional("reason", default="missing"): vol.In(list(REMOVAL_REASONS)),
})
@websocket_api.async_response
async def ws_remove_bottles(hass, connection, msg) -> None:
    """Take several bottles out at once (e.g. not found during an inventory check)."""
    store = _store(hass, connection, msg)
    if not store:
        return
    removed = [e for e in (store.remove_bottle(bid, msg["reason"]) for bid in msg["bottle_ids"]) if e]
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"removed": len(removed)})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/reserve_bottle",
    vol.Required("bottle_id"): str,
    vol.Optional("reserved_for"): vol.Any(None, vol.All(str, vol.Length(max=200))),
    vol.Optional("reserved_until"): vol.Any(None, str),
})
@websocket_api.async_response
async def ws_reserve_bottle(hass, connection, msg) -> None:
    """Set aside a bottle for an occasion; empty values remove the reservation."""
    store = _store(hass, connection, msg)
    if not store:
        return
    bottle = store.reserve_bottle(msg["bottle_id"], msg.get("reserved_for"), msg.get("reserved_until"))
    if bottle is None:
        connection.send_error(msg["id"], "not_found", "Bottiglia non trovata")
        return
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"bottle": bottle})


_WISH_EXTRA = {
    vol.Optional("where"): vol.Any(None, vol.All(str, vol.Length(max=200))),
    vol.Optional("wish_notes"): vol.Any(None, vol.All(str, vol.Length(max=1000))),
}


@websocket_api.websocket_command({vol.Required("type"): "tapon/wishlist_add", vol.Required("wine"): dict, **_WISH_EXTRA})
@websocket_api.async_response
async def ws_wishlist_add(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    if not str(msg["wine"].get("name") or "").strip():
        connection.send_error(msg["id"], "no_name", "Scrivi almeno il nome del vino")
        return
    wish = store.add_wish(msg["wine"], msg.get("where") or "", msg.get("wish_notes") or "")
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"wish": wish})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/wishlist_update", vol.Required("wish_id"): str, vol.Required("changes"): dict,
})
@websocket_api.async_response
async def ws_wishlist_update(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    wish = store.update_wish(msg["wish_id"], msg["changes"])
    if wish is None:
        connection.send_error(msg["id"], "not_found", "Desiderio non trovato")
        return
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"wish": wish})


@websocket_api.websocket_command({vol.Required("type"): "tapon/wishlist_remove", vol.Required("wish_id"): str})
@websocket_api.async_response
async def ws_wishlist_remove(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    store.remove_wish(msg["wish_id"])
    await core.async_changed(hass)
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/inventory_start", vol.Optional("rack_id"): vol.Any(str, None),
})
@websocket_api.async_response
async def ws_inventory_start(hass, connection, msg) -> None:
    """From now on scans only mark bottles as present, until the check is closed."""
    store = _store(hass, connection, msg)
    if not store:
        return
    store.inventory_start(msg.get("rack_id"))
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"inventory": store.inventory_report()})


@websocket_api.websocket_command({vol.Required("type"): "tapon/inventory_stop"})
@websocket_api.async_response
async def ws_inventory_stop(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    report = store.inventory_report()
    store.inventory_stop()
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"inventory": report})


@websocket_api.websocket_command({vol.Required("type"): "tapon/get_history"})
@callback
def ws_get_history(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if store:
        connection.send_result(msg["id"], {"history": list(reversed(store.history))[:500]})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/rate_history",
    vol.Required("history_id"): str,
    vol.Optional("rating"): vol.Any(None, vol.All(int, vol.Range(min=1, max=5))),
    vol.Optional("tasting_notes"): vol.Any(None, vol.All(str, vol.Length(max=1000))),
})
@websocket_api.async_response
async def ws_rate_history(hass, connection, msg) -> None:
    """Vote / write notes for a bottle already taken out (also after a QR scan)."""
    store = _store(hass, connection, msg)
    if not store:
        return
    entry = store.rate_history(msg["history_id"], msg.get("rating"), msg.get("tasting_notes"))
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Voce non trovata nello storico")
        return
    wish = store.maybe_rebuy(entry)
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"entry": entry, "wishlisted": bool(wish)})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/restore",
    vol.Required("history_id"): str,
})
@websocket_api.async_response
async def ws_restore(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    bottle = store.restore(msg["history_id"])
    if bottle is None:
        connection.send_error(msg["id"], "not_found", "Voce non trovata nello storico")
        return
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"bottle": bottle})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/save_rack",
    vol.Required("rack"): dict,
})
@websocket_api.async_response
async def ws_save_rack(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    rack, displaced = store.save_rack(msg["rack"])
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"rack": rack, "displaced": displaced})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/delete_rack",
    vol.Required("rack_id"): str,
})
@websocket_api.async_response
async def ws_delete_rack(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    moved = store.delete_rack(msg["rack_id"])
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"displaced": moved})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/get_label",
    vol.Required("bottle_id"): str,
})
@websocket_api.async_response
async def ws_get_label(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    bottle = store.get_bottle(msg["bottle_id"])
    if bottle is None:
        connection.send_error(msg["id"], "not_found", "Bottiglia non trovata")
        return
    info = core.label_info(store, bottle)
    png = await hass.async_add_executor_job(labels.render, bottle["code"], info["lines"], info["label_format"])
    connection.send_result(msg["id"], {**info, "png_base64": base64.b64encode(png).decode("ascii")})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/request_label",
    vol.Required("bottle_id"): str,
})
@websocket_api.async_response
async def ws_request_label(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    bottle = store.get_bottle(msg["bottle_id"])
    if bottle is None:
        connection.send_error(msg["id"], "not_found", "Bottiglia non trovata")
        return
    info = await core.async_request_label(hass, bottle, reason="manual")
    connection.send_result(msg["id"], info)


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/take_code",
    vol.Required("code"): str,
})
@websocket_api.async_response
async def ws_take_code(hass, connection, msg) -> None:
    result = await core.async_take_scanned(hass, msg["code"], source="card")
    connection.send_result(msg["id"], {k: v for k, v in result.items() if k != "bottle"})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/update_settings",
    vol.Optional(CONF_AUTO_LABELS): bool,
    vol.Optional(CONF_ALERT_DAYS): vol.All(int, vol.Range(min=0, max=730)),
    vol.Optional("label_format"): vol.In(list(labels.FORMATS)),  # "qr", "qr30", "full"
})
@websocket_api.async_response
async def ws_update_settings(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    for key in (CONF_AUTO_LABELS, CONF_ALERT_DAYS, "label_format"):
        if key in msg:
            store.settings[key] = msg[key]
    await core.async_changed(hass)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "tapon/get_alerts"})
@callback
def ws_get_alerts(hass, connection, msg) -> None:
    if _store(hass, connection, msg):
        connection.send_result(msg["id"], core.current_alerts(hass))


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/highlight",
    vol.Required("groups"): [{
        vol.Optional("label"): str, vol.Optional("color"): str, vol.Required("bottle_ids"): [str],
    }],
    vol.Optional("source", default="search"): vol.In(["search", "pair", "menu"]),
    vol.Optional("query", default=""): str,
})
@websocket_api.async_response
async def ws_highlight(hass, connection, msg) -> None:
    """Light up bottles (in the card now, on the shelf LEDs later)."""
    store = _store(hass, connection, msg)
    if not store:
        return
    hl = store.set_highlight(msg["groups"], msg["source"], msg["query"])
    await core.async_changed(hass)
    connection.send_result(msg["id"], {"highlight": hl})


@websocket_api.websocket_command({vol.Required("type"): "tapon/highlight_clear"})
@websocket_api.async_response
async def ws_highlight_clear(hass, connection, msg) -> None:
    store = _store(hass, connection, msg)
    if not store:
        return
    store.clear_highlight()
    await core.async_changed(hass)
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    vol.Required("type"): "tapon/check_wine",
    vol.Optional("image"): str,
    vol.Optional("back_image"): str,
    vol.Optional("wine"): dict,
})
@websocket_api.async_response
async def ws_check_wine(hass, connection, msg) -> None:
    """In a shop: read a label (or take a typed name) and say what we know about that wine."""
    from homeassistant.helpers.aiohttp_client import async_get_clientsession

    from .logic import check_wine

    store = _store(hass, connection, msg)
    if not store:
        return
    wine = {k: v for k, v in (msg.get("wine") or {}).items() if v not in (None, "")}
    if msg.get("image"):
        key, model = _gemini(hass)
        if not key:
            connection.send_error(msg["id"], "no_ai", "Per leggere l'etichetta serve la chiave Gemini nelle opzioni "
                                  "di Tapon; intanto puoi scrivere il nome.")
            return
        images = [msg["image"]] + ([msg["back_image"]] if msg.get("back_image") else [])
        try:
            wine = await ai.async_generate(async_get_clientsession(hass), key, model, ai.label_prompt(), images)
        except ai.AIError as err:
            connection.send_error(msg["id"], "ai_error", str(err))
            return
    if not str(wine.get("name") or "").strip():
        connection.send_error(msg["id"], "no_name", "Non riesco a capire che vino è: riprova o scrivi il nome")
        return
    if "vintage" in wine:
        try:
            wine["vintage"] = int(wine["vintage"])
        except (TypeError, ValueError):
            wine.pop("vintage")
    result = check_wine(wine, store.bottles, store.history, store.wishlist, store.racks)
    connection.send_result(msg["id"], {"wine": wine, **result})


@websocket_api.websocket_command({vol.Required("type"): "tapon/open_bottle", vol.Required("bottle_id"): str})
@websocket_api.async_response
async def ws_open_bottle(hass, connection, msg) -> None:
    """Opened but not finished (stopper, Coravin): off the shelf, reminder later."""
    store = _store(hass, connection, msg)
    if not store:
        return
    bottle = store.open_bottle(msg["bottle_id"])
    if bottle is None:
        connection.send_error(msg["id"], "not_found", "Bottiglia non trovata")
        return
    await core.async_changed(hass)
    info = core.opened_info(bottle) or {}
    connection.send_result(msg["id"], {"bottle": bottle, "limit": info.get("limit")})

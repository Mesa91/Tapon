"""Behaviour wired to Home Assistant: scans, labels, drinking-window alerts."""

from __future__ import annotations

import logging
import time
from datetime import date, datetime
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change

from . import labels
from .const import (
    ALERT_HOUR,
    CONF_ALERT_DAYS,
    CONF_AUTO_LABELS,
    CONF_LABEL_FORMAT,
    CONF_NOTIFIED,
    DEFAULT_ALERT_DAYS,
    DEFAULT_AUTO_LABELS,
    DOMAIN,
    EVENT_BOTTLE_TAKEN,
    EVENT_DRINK_ALERT,
    EVENT_HIGHLIGHT,
    EVENT_INVENTORY_SCAN,
    EVENT_RESERVED_DUE,
    EVENT_LABEL_REQUESTED,
    EVENT_SCAN_UNMATCHED,
    EVENT_UPDATED,
    SCAN_DEBOUNCE_SECONDS,
    WINE_TYPES,
)
from .logic import (
    STATUS_CLOSING,
    STATUS_PAST,
    drink_alerts,
    label_lines,
    location_text,
    parse_scanned,
    qr_payload_for,
    tag_id_for,
    wine_key,
)
from .store import TaponStore

_LOGGER = logging.getLogger(__name__)


def get_store(hass: HomeAssistant) -> TaponStore | None:
    return hass.data.get(DOMAIN, {}).get("store")


def wine_title(item: dict[str, Any]) -> str:
    vintage = item.get("vintage")
    return f"{item.get('name') or 'Vino'}{f' {vintage}' if vintage else ''}"


def type_label(key: str | None) -> str:
    return WINE_TYPES.get(key or "", ("", ""))[0]


async def async_changed(hass: HomeAssistant) -> None:
    """Persist and tell the card and sensors."""
    store = get_store(hass)
    if store:
        await store.async_save()
        if store.highlight_dirty:
            store.highlight_dirty = False
            hass.bus.async_fire(EVENT_HIGHLIGHT, highlight_payload(store))
    hass.bus.async_fire(EVENT_UPDATED)


def highlight_payload(store: TaponStore) -> dict[str, Any]:
    """What is lit, with shelf positions: what LED automations need."""
    hl = store.highlight or {}
    by_id = {b["id"]: b for b in store.bottles}
    groups = []
    for g in hl.get("groups", []):
        slots = [{"bottle_id": i, "rack_id": by_id[i].get("rack_id"), "row": by_id[i].get("row"),
                  "col": by_id[i].get("col")} for i in g["bottle_ids"] if i in by_id]
        groups.append({"label": g["label"], "color": g["color"], "slots": slots})
    return {"active": bool(groups), "source": hl.get("source"), "query": hl.get("query"), "groups": groups}


def _notify(hass: HomeAssistant, message: str, title: str, notification_id: str) -> None:
    persistent_notification.async_create(hass, message, title=title, notification_id=notification_id)


# ── Scanning ──────────────────────────────────────────────────────────────────

async def async_take_scanned(hass: HomeAssistant, raw: str, source: str) -> dict[str, Any]:
    """Take out the bottle a scanned QR/NFC code refers to."""
    store = get_store(hass)
    scanned = parse_scanned(raw)
    if store is None or scanned is None:
        return {"result": "not_ours"}

    if store.inventory is not None:
        # Inventory check in progress: a scan only says "this bottle is here".
        if scanned.kind != "bottle":
            return {"result": "ignored"}
        result = store.inventory_scan(scanned.code)
        await async_changed(hass)
        hass.bus.async_fire(EVENT_INVENTORY_SCAN, {
            "code": scanned.code, "result": result["result"], "source": source,
            "name": (result.get("bottle") or result.get("entry") or {}).get("name"),
        })
        return {"result": f"inventory_{result['result']}"}

    if scanned.kind == "slot":
        bottle = store.bottle_at(scanned.rack_id, scanned.row, scanned.col)
        if bottle is None:
            return _unmatched(hass, raw, "slot_empty", "Quella posizione dello scaffale risulta già vuota.")
    else:
        bottle = store.get_by_code(scanned.code)
        if bottle is None:
            past = store.history_by_code(scanned.code)
            if past:
                when = _local_date(past.get("removed_at"))
                return _unmatched(
                    hass, raw, "already_taken",
                    f"**{wine_title(past)}** era già stata prelevata{f' il {when}' if when else ''}. "
                    "Non ho tolto nulla.",
                )
            return _unmatched(hass, raw, "not_found", "Questo QR non corrisponde a nessuna bottiglia in cantina.")

    location = location_text(bottle, store.racks)
    entry = store.remove_bottle(bottle["id"], reason="drank")
    key = wine_key(bottle)
    remaining = sum(1 for b in store.bottles if wine_key(b) == key)
    await async_changed(hass)

    hass.bus.async_fire(EVENT_BOTTLE_TAKEN, {
        "bottle_id": bottle["id"], "code": bottle.get("code"), "name": bottle.get("name"),
        "producer": bottle.get("producer"), "vintage": bottle.get("vintage"),
        "type": bottle.get("type"), "type_label": type_label(bottle.get("type")),
        "location": location, "history_id": entry["history_id"] if entry else None,
        "remaining": remaining, "source": source,
    })
    _notify(
        hass,
        f"Prelevata **{wine_title(bottle)}** ({location}). Ne restano {remaining}. "
        + (f"Era riservata: «{bottle['reserved_for']}». " if bottle.get("reserved_for") else "")
        +
        "Dopo averla bevuta puoi darle un voto dallo storico (🕓); se è stato un errore, "
        "da lì puoi anche rimetterla a posto.",
        "Tapon: bottiglia prelevata", f"{DOMAIN}_scan",
    )
    return {"result": "taken", "bottle": bottle, "location": location, "remaining": remaining}


def _unmatched(hass: HomeAssistant, raw: str, reason: str, message: str) -> dict[str, Any]:
    hass.bus.async_fire(EVENT_SCAN_UNMATCHED, {"code": raw, "reason": reason})
    _notify(hass, message, "Tapon: scansione", f"{DOMAIN}_scan")
    return {"result": reason}


def _local_date(iso: str | None) -> str:
    try:
        return datetime.fromisoformat(iso).astimezone().strftime("%d/%m/%Y") if iso else ""
    except ValueError:
        return ""


@callback
def async_setup_tag_listener(hass: HomeAssistant):
    """Turn ``tag_scanned`` with one of our ids into a bottle taken out."""
    recent: dict[str, float] = {}

    async def _on_tag(event: Event) -> None:
        tag_id = event.data.get("tag_id") or ""
        if parse_scanned(tag_id) is None:
            return
        now = time.monotonic()
        if now - recent.get(tag_id, -1e9) < SCAN_DEBOUNCE_SECONDS:
            return  # the app sometimes delivers one scan twice
        recent[tag_id] = now
        await async_take_scanned(hass, tag_id, source="tag")

    return hass.bus.async_listen("tag_scanned", _on_tag)


# ── Labels ────────────────────────────────────────────────────────────────────

def label_format(store: TaponStore | None) -> str:
    fmt = (store.settings.get(CONF_LABEL_FORMAT) if store else None) or labels.DEFAULT_FORMAT
    return fmt if fmt in labels.FORMATS else labels.DEFAULT_FORMAT


def label_info(store: TaponStore, bottle: dict[str, Any]) -> dict[str, Any]:
    location = location_text(bottle, store.racks)
    tlabel = type_label(bottle.get("type"))
    fmt = label_format(store)
    width_mm, height_mm = labels.FORMATS[fmt]
    return {
        "label_format": fmt,
        "width_mm": width_mm,
        "height_mm": height_mm,
        "bottle_id": bottle["id"],
        "code": bottle["code"],
        "tag_id": tag_id_for(bottle["code"]),
        "qr_payload": qr_payload_for(bottle["code"]),
        "name": bottle.get("name") or "",
        "producer": bottle.get("producer") or "",
        "vintage": bottle.get("vintage") or "",
        "type": bottle.get("type") or "",
        "type_label": tlabel,
        "location": location,
        "lines": label_lines(bottle, tlabel, location),
    }


def _options(hass: HomeAssistant) -> dict[str, Any]:
    entries = hass.config_entries.async_entries(DOMAIN)
    return dict(entries[0].options) if entries else {}


async def async_request_label(hass: HomeAssistant, bottle: dict[str, Any], reason: str) -> dict[str, Any]:
    """Print the label on the configured printer, and fire the event for automations."""
    from .const import CONF_PRINTER_DEVICE

    store = get_store(hass)
    info = label_info(store, bottle)
    info["label_path"] = await hass.async_add_executor_job(
        labels.write_png, hass.config.config_dir, bottle["code"], info["lines"], info["label_format"]
    )
    hass.bus.async_fire(EVENT_LABEL_REQUESTED, {**info, "reason": reason})

    device = _options(hass).get(CONF_PRINTER_DEVICE)
    info["printed"] = False
    if device:
        if not hass.services.has_service("niimbot", "print"):
            _notify(hass, "La stampante è impostata ma l'integrazione Niimbot non è attiva.",
                    "Tapon: stampa", f"{DOMAIN}_print")
        else:
            try:
                await hass.services.async_call(
                    "niimbot", "print",
                    labels.niimbot_payload(bottle["code"], info["lines"], info["label_format"]),
                    target={"device_id": device}, blocking=True,
                )
                info["printed"] = True
            except Exception as err:
                _notify(hass, f"Non sono riuscito a stampare l'etichetta di **{wine_title(bottle)}**: {err}. "
                        "Controlla che la stampante sia accesa e raggiungibile.",
                        "Tapon: stampa", f"{DOMAIN}_print")
    return info


async def async_on_added(hass: HomeAssistant, bottles: list[dict[str, Any]]) -> None:
    store = get_store(hass)
    if store is None or not store.settings.get(CONF_AUTO_LABELS, DEFAULT_AUTO_LABELS):
        return
    for bottle in bottles:
        try:
            await async_request_label(hass, bottle, reason="new")
        except Exception as err:  # a label must never break adding a bottle
            _LOGGER.warning("Etichetta non generata per %s: %s", bottle.get("name"), err)


# ── Drinking-window alerts ────────────────────────────────────────────────────

def current_alerts(hass: HomeAssistant, today: date | None = None) -> dict[str, list[dict[str, Any]]]:
    store = get_store(hass)
    if store is None:
        return {STATUS_CLOSING: [], STATUS_PAST: []}
    lead = int(store.settings.get(CONF_ALERT_DAYS, DEFAULT_ALERT_DAYS))
    return drink_alerts(store.bottles, today or date.today(), lead)


async def async_check_alerts(hass: HomeAssistant, force: bool = False) -> dict[str, list[dict[str, Any]]]:
    """Notify wines newly closing or past their window (each once per status)."""
    store = get_store(hass)
    if store is None:
        return {}
    groups = current_alerts(hass)
    notified = set(store.settings.get(CONF_NOTIFIED, []))
    fresh = {s: [e for e in items if force or e["key"] not in notified] for s, items in groups.items()}

    if fresh[STATUS_CLOSING] or fresh[STATUS_PAST]:
        lines: list[str] = []
        if fresh[STATUS_CLOSING]:
            lines.append("**Da bere presto:**")
            lines += [
                f"- {wine_title(e)}: {e['bottles']} bott., finestra fino al {e['drink_until']} "
                f"(ancora {e['days_left']} giorni)"
                for e in fresh[STATUS_CLOSING]
            ]
        if fresh[STATUS_PAST]:
            lines.append("**Oltre la finestra di beva:**")
            lines += [f"- {wine_title(e)}: {e['bottles']} bott., finestra chiusa nel {e['drink_until']}"
                      for e in fresh[STATUS_PAST]]
        message = "\n".join(lines)
        _notify(hass, message, "Tapon: vini da bere", f"{DOMAIN}_alerts")
        hass.bus.async_fire(EVENT_DRINK_ALERT, {
            "closing": fresh[STATUS_CLOSING], "past": fresh[STATUS_PAST], "message": message,
        })

    # Remember what is currently announced; a wine that leaves the list (drunk,
    # restocked with a new window) will be announced again if it comes back.
    store.settings[CONF_NOTIFIED] = sorted(e["key"] for items in groups.values() for e in items)
    await store.async_save()
    return fresh


async def async_check_reserved(hass: HomeAssistant, today: date | None = None) -> list[dict[str, Any]]:
    """Remind once when a reserved bottle's day has come."""
    store = get_store(hass)
    if store is None:
        return []
    today_iso = (today or date.today()).isoformat()
    due = [b for b in store.bottles
           if b.get("reserved_until") and b["reserved_until"] <= today_iso and not b.get("reserved_notified")]
    if not due:
        return []
    lines = [f"- **{wine_title(b)}** ({location_text(b, store.racks)}): {b.get('reserved_for') or 'riservata'}"
             for b in due]
    _notify(hass, "È arrivato il giorno per:\n" + "\n".join(lines)
            + "\n\nSe non la apri più, togli la riserva dalla scheda della bottiglia.",
            "Tapon: bottiglie riservate", f"{DOMAIN}_reserved")
    for b in due:
        b["reserved_notified"] = True
        hass.bus.async_fire(EVENT_RESERVED_DUE, {
            "bottle_id": b["id"], "name": b.get("name"), "vintage": b.get("vintage"),
            "reserved_for": b.get("reserved_for"), "reserved_until": b.get("reserved_until"),
            "location": location_text(b, store.racks),
        })
    await async_changed(hass)
    return due


def opened_info(bottle: dict[str, Any]) -> dict[str, Any] | None:
    from homeassistant.util import dt as dt_util

    from .const import OPEN_DAYS
    from .logic import opened_status

    return opened_status(bottle, dt_util.now(), OPEN_DAYS)


async def async_check_opened(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Evening reminder for open bottles that should be finished (once per bottle)."""
    from .const import EVENT_OPENED_REMINDER

    store = get_store(hass)
    if store is None:
        return []
    due = []
    for b in store.bottles:
        info = opened_info(b)
        if info and info["state"] != "ok" and not b.get("opened_notified"):
            due.append((b, info))
    if not due:
        return []
    lines = [f"- **{wine_title(b)}**: aperta da {i['days']} {'giorno' if i['days'] == 1 else 'giorni'}"
             + (" — meglio finirla stasera" if i["state"] == "today" else " — probabilmente non è più al meglio")
             for b, i in due]
    _notify(hass, "\n".join(lines), "Tapon: bottiglie aperte", f"{DOMAIN}_opened")
    for b, i in due:
        b["opened_notified"] = True
        hass.bus.async_fire(EVENT_OPENED_REMINDER, {
            "bottle_id": b["id"], "name": b.get("name"), "vintage": b.get("vintage"), "type": b.get("type"),
            "days": i["days"], "state": i["state"],
        })
    await async_changed(hass)
    return [b for b, _ in due]


@callback
def async_setup_opened_reminder(hass: HomeAssistant):
    from .const import OPENED_ALERT_HOUR

    async def _evening(_now: Any) -> None:
        try:
            await async_check_opened(hass)
        except Exception as err:
            _LOGGER.warning("Controllo bottiglie aperte non riuscito: %s", err)

    return async_track_time_change(hass, _evening, hour=OPENED_ALERT_HOUR, minute=0, second=0)


@callback
def async_setup_daily_alerts(hass: HomeAssistant):
    async def _daily(_now: Any) -> None:
        try:
            await async_check_alerts(hass)
        except Exception as err:
            _LOGGER.warning("Controllo finestre di beva non riuscito: %s", err)
        try:
            await async_check_reserved(hass)
        except Exception as err:
            _LOGGER.warning("Controllo bottiglie riservate non riuscito: %s", err)

    return async_track_time_change(hass, _daily, hour=ALERT_HOUR, minute=0, second=0)


# ── Cellar climate ────────────────────────────────────────────────────────────

def climate_config(hass: HomeAssistant) -> dict[str, Any]:
    from .const import (
        CONF_HUM_ENTITY, CONF_HUM_MAX, CONF_HUM_MIN, CONF_TEMP_ENTITY, CONF_TEMP_MAX, CONF_TEMP_MIN,
        DEFAULT_HUM_MAX, DEFAULT_HUM_MIN, DEFAULT_TEMP_MAX, DEFAULT_TEMP_MIN,
    )

    o = _options(hass)
    return {
        "temperature_entity": o.get(CONF_TEMP_ENTITY) or None,
        "humidity_entity": o.get(CONF_HUM_ENTITY) or None,
        "temperature_min": float(o.get(CONF_TEMP_MIN, DEFAULT_TEMP_MIN)),
        "temperature_max": float(o.get(CONF_TEMP_MAX, DEFAULT_TEMP_MAX)),
        "humidity_min": float(o.get(CONF_HUM_MIN, DEFAULT_HUM_MIN)),
        "humidity_max": float(o.get(CONF_HUM_MAX, DEFAULT_HUM_MAX)),
    }


@callback
def async_setup_climate_monitor(hass: HomeAssistant):
    """Alert when temperature or humidity stays out of range for a while."""
    from datetime import timedelta

    from homeassistant.helpers.event import async_call_later, async_track_state_change_event

    from .const import CLIMATE_GRACE_MINUTES, EVENT_CLIMATE_ALERT
    from .logic import climate_status

    cfg = climate_config(hass)
    watched = {
        "temperatura": (cfg["temperature_entity"], cfg["temperature_min"], cfg["temperature_max"], "°C"),
        "umidità": (cfg["humidity_entity"], cfg["humidity_min"], cfg["humidity_max"], "%"),
    }
    watched = {k: v for k, v in watched.items() if v[0]}
    if not watched:
        return lambda: None
    pending: dict[str, Any] = {}
    alerted: set[str] = set()

    def _evaluate(name: str) -> None:
        entity, low, high, unit = watched[name]
        state = hass.states.get(entity)
        status = climate_status(state.state if state else None, low, high)
        if status in ("low", "high"):
            if name in alerted or name in pending:
                return

            @callback
            def _fire(_now: Any, name: str = name) -> None:
                pending.pop(name, None)
                current = hass.states.get(watched[name][0])
                now_status = climate_status(current.state if current else None, low, high)
                if now_status not in ("low", "high"):
                    return
                alerted.add(name)
                word = "bassa" if now_status == "low" else "alta"
                message = (f"In cantina la {name} è troppo {word}: {current.state} {unit} "
                           f"(ideale {low:g}–{high:g} {unit}).")
                _notify(hass, message, "Tapon: clima della cantina", f"{DOMAIN}_climate_{name}")
                hass.bus.async_fire(EVENT_CLIMATE_ALERT, {
                    "measure": name, "status": now_status, "value": current.state, "unit": unit,
                    "min": low, "max": high, "message": message,
                })

            pending[name] = async_call_later(hass, timedelta(minutes=CLIMATE_GRACE_MINUTES), _fire)
        else:
            cancel = pending.pop(name, None)
            if cancel:
                cancel()
            if name in alerted and status == "ok":
                alerted.discard(name)
                persistent_notification.async_dismiss(hass, f"{DOMAIN}_climate_{name}")
                hass.bus.async_fire(EVENT_CLIMATE_ALERT, {"measure": name, "status": "ok", "unit": unit,
                                                          "min": low, "max": high, "message": f"La {name} è tornata normale."})

    @callback
    def _changed(event: Event) -> None:
        for name, (entity, *_rest) in watched.items():
            if entity == event.data.get("entity_id"):
                _evaluate(name)

    unsub = async_track_state_change_event(hass, [v[0] for v in watched.values()], _changed)
    for name in watched:
        _evaluate(name)

    def _stop() -> None:
        unsub()
        for cancel in pending.values():
            cancel()

    return _stop

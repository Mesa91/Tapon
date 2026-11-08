"""Tapon: la cantina dei vini in Home Assistant."""

from __future__ import annotations

import logging
from pathlib import Path

import voluptuous as vol

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import CoreState, Event, HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv

from . import core, migrate, websocket
from .const import CARD_URL, CARD_VERSION, DOMAIN
from .store import TaponStore

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor"]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Serve the card and load it on every dashboard (once per HA start)."""
    card = Path(__file__).parent / "frontend" / "tapon-card.js"
    await hass.http.async_register_static_paths([StaticPathConfig(CARD_URL, str(card), False)])
    websocket.async_register(hass)

    # The card must be loaded before dashboards are built: a card that is
    # defined late is not redrawn inside some containers (e.g. Bubble Card
    # pop-ups on a slower phone). Dashboard resources are loaded first, so
    # register it as one; fall back to an extra module for YAML dashboards.
    async def _register(_event: Event | None = None) -> None:
        if not await _async_register_resource(hass):
            add_extra_js_url(hass, f"{CARD_URL}?v={CARD_VERSION}")

    if hass.state is CoreState.running:
        await _register()
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _register)
    return True


async def _async_register_resource(hass: HomeAssistant) -> bool:
    """Add or update the card in the dashboard resources. False if not possible."""
    url = f"{CARD_URL}?v={CARD_VERSION}"
    try:
        try:
            from homeassistant.components.lovelace.const import LOVELACE_DATA

            lovelace = hass.data.get(LOVELACE_DATA)
        except ImportError:
            lovelace = None
        if lovelace is None:
            lovelace = hass.data.get("lovelace")
        resources = getattr(lovelace, "resources", None)
        if resources is None and isinstance(lovelace, dict):
            resources = lovelace.get("resources")
        if resources is None or not hasattr(resources, "async_create_item"):
            return False  # YAML-mode resources: cannot be written
        ensure = getattr(resources, "_async_ensure_loaded", None)
        if ensure is not None:
            await ensure()
        elif not getattr(resources, "loaded", True):
            await resources.async_load()
            resources.loaded = True
        mine = [item for item in resources.async_items() if str(item.get("url", "")).split("?")[0] == CARD_URL]
        if not mine:
            await resources.async_create_item({"res_type": "module", "url": url})
        elif mine[0].get("url") != url:
            await resources.async_update_item(mine[0]["id"], {"res_type": "module", "url": url})
        for extra in mine[1:]:
            await resources.async_delete_item(extra["id"])
        return True
    except Exception as err:  # never block the integration on this
        _LOGGER.warning("Impossibile registrare la card tra le risorse della dashboard: %s", err)
        return False


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = TaponStore(hass)
    await store.async_load()
    hass.data.setdefault(DOMAIN, {})["store"] = store
    if store.imported:
        await store.async_save()

    async def _migrate(_event: Event | None = None) -> None:
        await migrate.async_migrate(hass, store.imported)

    if hass.state is CoreState.running:
        hass.async_create_task(_migrate())
    else:
        entry.async_on_unload(hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _migrate))

    _register_services(hass)
    entry.async_on_unload(core.async_setup_tag_listener(hass))
    entry.async_on_unload(core.async_setup_daily_alerts(hass))
    entry.async_on_unload(core.async_setup_opened_reminder(hass))
    entry.async_on_unload(core.async_setup_climate_monitor(hass))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_options_updated))
    return True


async def _options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Options changed: reload, so sensors to watch and printer are picked up."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if ok:
        hass.data.get(DOMAIN, {}).pop("store", None)
        for service in ("take_bottle", "print_label", "check_drink_alerts"):
            hass.services.async_remove(DOMAIN, service)
    return ok


def _register_services(hass: HomeAssistant) -> None:
    def _require_store():
        store = core.get_store(hass)
        if store is None:
            raise HomeAssistantError("Tapon non è configurato")
        return store

    async def take_bottle(call: ServiceCall) -> ServiceResponse:
        result = await core.async_take_scanned(hass, call.data["code"], source="service")
        if result["result"] == "not_ours":
            raise HomeAssistantError(f"Non è un codice Tapon: {call.data['code']}")
        if not call.return_response:
            return None
        bottle = result.get("bottle") or {}
        return {"result": result["result"], "name": bottle.get("name"), "vintage": bottle.get("vintage"),
                "location": result.get("location"), "remaining": result.get("remaining")}

    async def print_label(call: ServiceCall) -> ServiceResponse:
        store = _require_store()
        bottle = None
        if call.data.get("bottle_id"):
            bottle = store.get_bottle(call.data["bottle_id"])
        elif call.data.get("code"):
            bottle = store.get_by_code(call.data["code"].strip().lower())
        if bottle is None:
            raise HomeAssistantError("Bottiglia non trovata")
        info = await core.async_request_label(hass, bottle, reason="manual")
        return info if call.return_response else None

    async def check_drink_alerts(call: ServiceCall) -> ServiceResponse:
        _require_store()
        fresh = await core.async_check_alerts(hass, force=call.data.get("force", False))
        return fresh if call.return_response else None

    hass.services.async_register(
        DOMAIN, "take_bottle", take_bottle,
        schema=vol.Schema({vol.Required("code"): cv.string}),
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN, "print_label", print_label,
        schema=vol.Schema({vol.Optional("bottle_id"): cv.string, vol.Optional("code"): cv.string}),
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN, "check_drink_alerts", check_drink_alerts,
        schema=vol.Schema({vol.Optional("force", default=False): cv.boolean}),
        supports_response=SupportsResponse.OPTIONAL,
    )

"""One-time move from the integration's earlier names (Suro, TaponBon).

The integration was called TaponBon (domain ``taponbon``), then Suro
(``suro``). Changing a domain makes Home Assistant see a brand-new
integration, so on first setup Tapon brings over what the old one left behind:

* the cellar data (``.storage/suro`` or ``.storage/taponbon``), copied, the
  old file kept;
* the options (Gemini key, climate sensors, printer), done by the config flow;
* storage-mode dashboards: the card type and the old sensor ids;
* old config entries are disabled, so two integrations never react to the
  same scan, and their card resources are dropped.

Printed QR labels keep working: ``logic.parse_scanned`` still accepts the
old tag prefixes.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.config_entries import ConfigEntry, ConfigEntryDisabler
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

# Most recent first: its data and options are the ones to bring over.
OLD_DOMAINS = ("suro", "taponbon")
OLD_NAMES = {"suro": "Suro", "taponbon": "TaponBon"}
OLD_CARD_URLS = {f"/{d}/{d}-card.js" for d in OLD_DOMAINS}
DASHBOARD_REPLACEMENTS = tuple(
    pair for d in OLD_DOMAINS
    for pair in ((f"custom:{d}-card", f"custom:{DOMAIN}-card"), (f"sensor.{d}_", f"sensor.{DOMAIN}_"))
)


def old_entries(hass: HomeAssistant) -> list[ConfigEntry]:
    return [e for d in OLD_DOMAINS for e in hass.config_entries.async_entries(d)]


def old_entry(hass: HomeAssistant) -> ConfigEntry | None:
    entries = old_entries(hass)
    return entries[0] if entries else None


async def async_load_old_data(hass: HomeAssistant) -> dict[str, Any] | None:
    """The most recent old cellar data, if any (read-only: old files are kept)."""
    for domain in OLD_DOMAINS:
        try:
            data = await Store(hass, STORAGE_VERSION, domain).async_load()
        except Exception as err:  # never block setup on this
            _LOGGER.warning("Impossibile leggere i dati di %s: %s", OLD_NAMES[domain], err)
            continue
        if data is not None:
            return data
    return None


def rewrite_dashboard(config: Any) -> tuple[Any, bool]:
    """Dashboard config with the old card types and sensor ids renamed."""
    text = json.dumps(config, ensure_ascii=False)
    new = text
    for old, repl in DASHBOARD_REPLACEMENTS:
        new = new.replace(old, repl)
    if new == text:
        return config, False
    return json.loads(new), True


async def async_migrate(hass: HomeAssistant, imported_data: bool) -> None:
    """Dashboards, old resources, old entries. Safe to run more than once."""
    dashboards = await _async_fix_dashboards(hass)
    await _async_drop_old_resource(hass)
    leftover: list[str] = []
    disabled = False
    for entry in old_entries(hass):
        leftover.append(OLD_NAMES[entry.domain])
        if entry.disabled_by is not None:
            continue
        try:
            await hass.config_entries.async_set_disabled_by(entry.entry_id, ConfigEntryDisabler.USER)
            disabled = True
        except Exception as err:
            _LOGGER.warning("Impossibile disattivare %s: %s", OLD_NAMES[entry.domain], err)
    if not (imported_data or dashboards or disabled):
        return
    lines = ["Tapon ha preso il posto della vecchia integrazione della cantina."]
    if imported_data:
        lines.append("- Cantina, storico, desideri e impostazioni sono stati copiati.")
    if dashboards:
        lines.append(f"- Dashboard aggiornate: {', '.join(dashboards)}.")
    if leftover:
        names = " e ".join(dict.fromkeys(leftover))
        lines.append(f"- {names} è stata disattivata: eliminala da Impostazioni → Dispositivi e servizi, "
                     "poi rimuovila da HACS se c'è ancora e riavvia.")
    lines.append("- Le automazioni che usano eventi o servizi `suro` o `taponbon` vanno aggiornate a `tapon`.")
    persistent_notification.async_create(
        hass, "\n".join(lines), title="Tapon", notification_id=f"{DOMAIN}_migrated"
    )


def _lovelace(hass: HomeAssistant) -> Any:
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA

        data = hass.data.get(LOVELACE_DATA)
    except ImportError:
        data = None
    return data if data is not None else hass.data.get("lovelace")


async def _async_fix_dashboards(hass: HomeAssistant) -> list[str]:
    changed: list[str] = []
    lovelace = _lovelace(hass)
    dashboards = getattr(lovelace, "dashboards", None)
    if dashboards is None and isinstance(lovelace, dict):
        dashboards = lovelace.get("dashboards")
    for url_path, dashboard in (dashboards or {}).items():
        if not hasattr(dashboard, "async_save"):
            continue  # YAML dashboard: cannot be written
        try:
            config = await dashboard.async_load(False)
        except Exception:
            continue  # empty / auto-generated dashboard
        new, did = rewrite_dashboard(config)
        if not did:
            continue
        try:
            await dashboard.async_save(new)
            changed.append(url_path or "Panoramica")
        except Exception as err:
            _LOGGER.warning("Impossibile aggiornare la dashboard %s: %s", url_path, err)
    return changed


async def _async_drop_old_resource(hass: HomeAssistant) -> None:
    lovelace = _lovelace(hass)
    resources = getattr(lovelace, "resources", None)
    if resources is None and isinstance(lovelace, dict):
        resources = lovelace.get("resources")
    if resources is None or not hasattr(resources, "async_delete_item"):
        return
    try:
        ensure = getattr(resources, "_async_ensure_loaded", None)
        if ensure is not None:
            await ensure()
        for item in list(resources.async_items()):
            if str(item.get("url", "")).split("?")[0] in OLD_CARD_URLS:
                await resources.async_delete_item(item["id"])
    except Exception as err:
        _LOGGER.warning("Impossibile rimuovere la vecchia risorsa della card: %s", err)

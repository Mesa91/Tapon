"""Sensors: bottles in the cellar, free slots, bottles to drink soon."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import core
from .const import DOMAIN, EVENT_UPDATED, NAME, WINE_TYPES


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    entities = [BottlesSensor(hass, entry), FreeSlotsSensor(hass, entry), DrinkSoonSensor(hass, entry), ValueSensor(hass, entry)]
    async_add_entities(entities)

    @callback
    def _refresh(_event: Any) -> None:
        for entity in entities:
            entity.async_write_ha_state()

    entry.async_on_unload(hass.bus.async_listen(EVENT_UPDATED, _refresh))


class _Base(SensorEntity):
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, key: str) -> None:
        self.hass = hass
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)}, name=NAME,
            manufacturer=NAME, entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def _store(self):
        return core.get_store(self.hass)


class BottlesSensor(_Base):
    _attr_icon = "mdi:bottle-wine"
    _attr_native_unit_of_measurement = "bottiglie"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, hass, entry) -> None:
        super().__init__(hass, entry, "bottles")

    @property
    def native_value(self) -> int:
        return len(self._store.bottles) if self._store else 0

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        if not self._store:
            return {}
        counts = {label.lower(): 0 for label, _ in WINE_TYPES.values()}
        for b in self._store.bottles:
            label = WINE_TYPES.get(b.get("type") or "", ("Altro", ""))[0].lower()
            counts[label] = counts.get(label, 0) + 1
        return {**counts, "da_sistemare": sum(1 for b in self._store.bottles if not b.get("rack_id"))}


class FreeSlotsSensor(_Base):
    _attr_icon = "mdi:grid"
    _attr_native_unit_of_measurement = "posti"

    def __init__(self, hass, entry) -> None:
        super().__init__(hass, entry, "free_slots")

    @property
    def native_value(self) -> int:
        return self._store.free_count() if self._store else 0

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"capienza": self._store.capacity()} if self._store else {}


class DrinkSoonSensor(_Base):
    _attr_icon = "mdi:glass-wine"
    _attr_native_unit_of_measurement = "bottiglie"

    def __init__(self, hass, entry) -> None:
        super().__init__(hass, entry, "drink_soon")

    @property
    def native_value(self) -> int:
        groups = core.current_alerts(self.hass)
        return sum(e["bottles"] for items in groups.values() for e in items)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        groups = core.current_alerts(self.hass)

        def brief(items):
            return [
                {k: e[k] for k in ("name", "producer", "vintage", "type", "drink_until", "days_left", "bottles")}
                for e in items
            ]

        return {"presto": brief(groups.get("closing", [])), "oltre": brief(groups.get("past", []))}


class ValueSensor(_Base):
    """What the bottles in the cellar cost (only those with a price)."""

    _attr_icon = "mdi:cash"
    _attr_device_class = SensorDeviceClass.MONETARY
    _attr_state_class = SensorStateClass.TOTAL

    def __init__(self, hass, entry) -> None:
        super().__init__(hass, entry, "value")

    @property
    def native_unit_of_measurement(self) -> str:
        return self.hass.config.currency or "EUR"

    @property
    def native_value(self) -> float:
        from .logic import cellar_value

        return cellar_value(self._store.bottles)["total"] if self._store else 0

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        from .logic import cellar_value

        if not self._store:
            return {}
        v = cellar_value(self._store.bottles)
        return {"bottiglie_con_prezzo": v["priced"], "bottiglie_senza_prezzo": v["bottles"] - v["priced"]}

"""Config flow: one Tapon per Home Assistant; options hold the Gemini key."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from . import migrate
from .ai import DEFAULT_MODEL, async_check_key
from .const import (
    CONF_GEMINI_KEY,
    CONF_GEMINI_MODEL,
    CONF_HUM_ENTITY,
    CONF_HUM_MAX,
    CONF_HUM_MIN,
    CONF_PRINTER_DEVICE,
    CONF_TEMP_ENTITY,
    CONF_TEMP_MAX,
    CONF_TEMP_MIN,
    DEFAULT_HUM_MAX,
    DEFAULT_HUM_MIN,
    DEFAULT_TEMP_MAX,
    DEFAULT_TEMP_MIN,
    DOMAIN,
    NAME,
)


class TaponConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            old = migrate.old_entry(self.hass)
            # Bring over the Gemini key, climate sensors and printer.
            return self.async_create_entry(title=NAME, data={}, options=dict(old.options) if old else {})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return TaponOptionsFlow()


class TaponOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        current = dict(self.config_entry.options)
        if user_input is not None:
            data = {k: v for k, v in user_input.items() if v not in (None, "")}
            data[CONF_GEMINI_KEY] = (user_input.get(CONF_GEMINI_KEY) or "").strip()
            data[CONF_GEMINI_MODEL] = (user_input.get(CONF_GEMINI_MODEL) or DEFAULT_MODEL).strip()
            if data[CONF_GEMINI_KEY]:
                problem = await async_check_key(
                    async_get_clientsession(self.hass), data[CONF_GEMINI_KEY], data[CONF_GEMINI_MODEL]
                )
                if problem:
                    errors["base"] = problem
            if data.get(CONF_TEMP_MIN, DEFAULT_TEMP_MIN) >= data.get(CONF_TEMP_MAX, DEFAULT_TEMP_MAX) or \
                    data.get(CONF_HUM_MIN, DEFAULT_HUM_MIN) >= data.get(CONF_HUM_MAX, DEFAULT_HUM_MAX):
                errors["base"] = "bad_range"
            if not errors:
                return self.async_create_entry(data=data)
            current.update(user_input)

        def opt(key, default=None):
            value = current.get(key, default)
            return {"suggested_value": value} if value not in (None, "") else {}

        number = lambda lo, hi, step, unit: selector.NumberSelector(  # noqa: E731
            selector.NumberSelectorConfig(min=lo, max=hi, step=step, unit_of_measurement=unit,
                                          mode=selector.NumberSelectorMode.BOX)
        )
        schema = vol.Schema({
            vol.Optional(CONF_GEMINI_KEY, description=opt(CONF_GEMINI_KEY)): selector.TextSelector(
                selector.TextSelectorConfig(type=selector.TextSelectorType.PASSWORD)),
            vol.Optional(CONF_GEMINI_MODEL, description=opt(CONF_GEMINI_MODEL, DEFAULT_MODEL)): str,
            vol.Optional(CONF_TEMP_ENTITY, description=opt(CONF_TEMP_ENTITY)): selector.EntitySelector(
                selector.EntitySelectorConfig(domain="sensor", device_class="temperature")),
            vol.Optional(CONF_HUM_ENTITY, description=opt(CONF_HUM_ENTITY)): selector.EntitySelector(
                selector.EntitySelectorConfig(domain="sensor", device_class="humidity")),
            vol.Optional(CONF_TEMP_MIN, default=current.get(CONF_TEMP_MIN, DEFAULT_TEMP_MIN)): number(-10, 40, 0.5, "°C"),
            vol.Optional(CONF_TEMP_MAX, default=current.get(CONF_TEMP_MAX, DEFAULT_TEMP_MAX)): number(-10, 40, 0.5, "°C"),
            vol.Optional(CONF_HUM_MIN, default=current.get(CONF_HUM_MIN, DEFAULT_HUM_MIN)): number(0, 100, 1, "%"),
            vol.Optional(CONF_HUM_MAX, default=current.get(CONF_HUM_MAX, DEFAULT_HUM_MAX)): number(0, 100, 1, "%"),
            vol.Optional(CONF_PRINTER_DEVICE, description=opt(CONF_PRINTER_DEVICE)): selector.DeviceSelector(
                selector.DeviceSelectorConfig(integration="niimbot")),
        })
        return self.async_show_form(step_id="init", data_schema=schema, errors=errors)

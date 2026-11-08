"""Load the integration's modules without Home Assistant installed."""

import copy
import importlib.util
import pathlib
import sys
import types

ROOT = pathlib.Path(__file__).resolve().parents[1] / "custom_components" / "tapon"


class FakeStore:
    disk = None
    old = None  # what the integration saved under its old name
    saves = 0

    def __init__(self, hass=None, version=1, key="tapon", **kwargs):
        self.key = key

    async def async_load(self):
        return copy.deepcopy(FakeStore.disk if self.key == "tapon" else FakeStore.old)

    async def async_save(self, data):
        FakeStore.disk = copy.deepcopy(data)
        FakeStore.saves += 1


def _stub(name, **attrs):
    mod = types.ModuleType(name)
    mod.__dict__.update(attrs)
    sys.modules.setdefault(name, mod)
    return mod


_stub("homeassistant")
_stub("homeassistant.core", HomeAssistant=object)
_stub("homeassistant.helpers")
_stub("homeassistant.helpers.storage", Store=FakeStore)
_stub("homeassistant.components", persistent_notification=types.SimpleNamespace())
_stub("homeassistant.config_entries", ConfigEntry=object, ConfigEntryDisabler=types.SimpleNamespace(USER="user"))

pkg = types.ModuleType("tb")
pkg.__path__ = [str(ROOT)]
sys.modules["tb"] = pkg
for name in ("const", "logic", "labels", "migrate", "store", "ai"):
    spec = importlib.util.spec_from_file_location(f"tb.{name}", ROOT / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[f"tb.{name}"] = mod
    spec.loader.exec_module(mod)

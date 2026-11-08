"""Constants for Tapon."""

DOMAIN = "tapon"
NAME = "Tapon"

STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

# Card: served from the integration folder and loaded on every dashboard.
CARD_URL = "/tapon/tapon-card.js"
CARD_VERSION = "20261108a"  # bump with every frontend build to bust the cache

# Wine types: key -> (Italian label, colour used on the rack).
WINE_TYPES: dict[str, tuple[str, str]] = {
    "red": ("Rosso", "#7b1e2b"),
    "white": ("Bianco", "#e9dca4"),
    "rose": ("Rosato", "#e79bb3"),
    "sparkling": ("Bollicine", "#c9d97a"),
    "dessert": ("Dolce", "#d9a03a"),
}

REMOVAL_REASONS: dict[str, str] = {
    "drank": "Bevuta",
    "gifted": "Regalata",
    "broken": "Rotta",
    "spoiled": "Andata a male",
    "deleted": "Eliminata",
    "missing": "Non trovata",
    "other": "Altro",
}

DEFAULT_RACK = {"name": "Scaffale", "rows": 7, "cols": 10}
MAX_RACK_SIDE = 30

# Settings (stored with the data, editable from the card).
CONF_AUTO_LABELS = "auto_labels"
DEFAULT_AUTO_LABELS = True
CONF_ALERT_DAYS = "alert_days"
DEFAULT_ALERT_DAYS = 180
CONF_NOTIFIED = "notified_alerts"  # bookkeeping, not user-editable
CONF_LABEL_FORMAT = "label_format"  # "qr" (23 × 23 mm, QR only) or "full" (50 × 30 mm)

# Events.
EVENT_UPDATED = f"{DOMAIN}_updated"
EVENT_BOTTLE_TAKEN = f"{DOMAIN}_bottle_taken"
EVENT_SCAN_UNMATCHED = f"{DOMAIN}_scan_unmatched"
EVENT_LABEL_REQUESTED = f"{DOMAIN}_label_requested"
EVENT_DRINK_ALERT = f"{DOMAIN}_drink_alert"

ALERT_HOUR = 10
SCAN_DEBOUNCE_SECONDS = 15

# Options (config entry): Gemini.
CONF_GEMINI_KEY = "gemini_api_key"
CONF_GEMINI_MODEL = "gemini_model"

# Options: cellar climate.
CONF_TEMP_ENTITY = "temperature_entity"
CONF_HUM_ENTITY = "humidity_entity"
CONF_TEMP_MIN = "temperature_min"
CONF_TEMP_MAX = "temperature_max"
CONF_HUM_MIN = "humidity_min"
CONF_HUM_MAX = "humidity_max"
# A good cellar: 10-16 °C, 60-80 % (outside these for a while -> alert).
DEFAULT_TEMP_MIN, DEFAULT_TEMP_MAX = 10.0, 16.0
DEFAULT_HUM_MIN, DEFAULT_HUM_MAX = 60.0, 80.0
CLIMATE_GRACE_MINUTES = 30  # out of range this long before alerting
EVENT_CLIMATE_ALERT = f"{DOMAIN}_climate_alert"

# Options: label printer (Niimbot via the hass-niimbot integration).
CONF_PRINTER_DEVICE = "printer_device"

EVENT_RESERVED_DUE = "tapon_reserved_due"
EVENT_INVENTORY_SCAN = "tapon_inventory_scan"
REBUY_MIN_RATING = 4
EVENT_HIGHLIGHT = "tapon_highlight"
# Days an opened bottle keeps well (with a stopper, in the fridge or cool).
OPEN_DAYS = {"sparkling": 2, "white": 3, "rose": 3, "red": 5, "dessert": 14}
OPENED_ALERT_HOUR = 17
EVENT_OPENED_REMINDER = "tapon_opened_reminder"

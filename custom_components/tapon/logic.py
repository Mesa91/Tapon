"""Pure logic: bottle codes, scanned tags, rack placement, drinking windows.

Nothing here imports Home Assistant, so it is tested on its own.

Bottle codes
------------
Every bottle has a short, stable ``code``. Its QR encodes the Home Assistant
tag URL ``https://www.home-assistant.io/tag/tapon-<code>``: the companion
app turns a scan into the ``tag_scanned`` event with ``tag_id ==
"tapon-<code>"``. A fixed reader may send the bare id or the whole URL.

A tag can also name a rack slot, ``tapon-slot-<rack_id>/<row>/<col>``
(an NFC sticker on the shelf): scanning it takes out the bottle in that slot.
Tags written under the old names (``taponbon-…``, ``suro-…``) are still accepted.

Drinking window
---------------
Bottles carry ``drink_from`` / ``drink_until`` years. The window is taken to
close on 31 December of ``drink_until``.
"""

from __future__ import annotations

import re
import secrets
from dataclasses import dataclass
from datetime import date, datetime
from typing import Any, Iterable

TAG_URL_PREFIX = "https://www.home-assistant.io/tag/"
TAG_PREFIX = "tapon-"
SLOT_PREFIX = "tapon-slot-"
# Labels printed under the integration's earlier names (TaponBon, Suro).
LEGACY_NAMES = ("taponbon", "suro")

# No 0/O, 1/l/I: the code is printed under the QR and may be typed by hand.
CODE_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz"
CODE_LENGTH = 8


def new_code(existing: Iterable[str] = ()) -> str:
    """A fresh bottle code not in ``existing``."""
    taken = set(existing)
    while True:
        code = "".join(secrets.choice(CODE_ALPHABET) for _ in range(CODE_LENGTH))
        if code not in taken:
            return code


def new_id(prefix: str) -> str:
    return f"{prefix}{secrets.token_hex(5)}"


def tag_id_for(code: str) -> str:
    return f"{TAG_PREFIX}{code}"


def qr_payload_for(code: str) -> str:
    return f"{TAG_URL_PREFIX}{tag_id_for(code)}"


def slot_tag_id(rack_id: str, row: int, col: int) -> str:
    return f"{SLOT_PREFIX}{rack_id}/{row}/{col}"


@dataclass(frozen=True)
class Scanned:
    kind: str  # "bottle" | "slot"
    code: str = ""
    rack_id: str = ""
    row: int = -1
    col: int = -1


_SLOT_RE = re.compile(r"^(?P<rack>[A-Za-z0-9_-]+)/(?P<row>\d+)/(?P<col>\d+)$")


def parse_scanned(raw: str | None) -> Scanned | None:
    """Interpret a scanned tag id or URL; None if it is not ours."""
    if not raw:
        return None
    text = str(raw).strip()
    if "/tag/" in text:
        text = text.split("/tag/", 1)[1]
    text = text.split("?", 1)[0].split("#", 1)[0].strip().strip("/")
    lowered = text.lower()
    legacy_prefixes = [(f"{n}-slot-", SLOT_PREFIX) for n in LEGACY_NAMES] + [(f"{n}-", TAG_PREFIX) for n in LEGACY_NAMES]
    for legacy, current in legacy_prefixes:
        if lowered.startswith(legacy):
            text = current + text[len(legacy):]
            lowered = text.lower()
            break
    if lowered.startswith(SLOT_PREFIX):
        match = _SLOT_RE.match(text[len(SLOT_PREFIX):])
        if not match:
            return None
        return Scanned("slot", rack_id=match["rack"], row=int(match["row"]), col=int(match["col"]))
    if lowered.startswith(TAG_PREFIX):
        code = lowered[len(TAG_PREFIX):]
        if code and all(c in CODE_ALPHABET for c in code):
            return Scanned("bottle", code=code)
    return None


# ── Racks and placement ───────────────────────────────────────────────────────

def occupied(bottles: Iterable[dict[str, Any]], rack_id: str) -> set[tuple[int, int]]:
    return {
        (b["row"], b["col"]) for b in bottles
        if b.get("rack_id") == rack_id and b.get("row") is not None and b.get("col") is not None
    }


def shelves_of(rack: dict[str, Any]) -> list[int]:
    """Bottles per shelf, top to bottom (older racks: a plain rows × cols grid)."""
    shelves = rack.get("shelves")
    if isinstance(shelves, list) and shelves:
        return [max(1, int(n)) for n in shelves]
    return [int(rack.get("cols") or 1)] * int(rack.get("rows") or 1)


def slot_exists(rack: dict[str, Any], row: int | None, col: int | None) -> bool:
    shelves = shelves_of(rack)
    return row is not None and col is not None and 0 <= row < len(shelves) and 0 <= col < shelves[row]


def rack_capacity(rack: dict[str, Any]) -> int:
    return sum(shelves_of(rack))


def free_slots(rack: dict[str, Any], bottles: Iterable[dict[str, Any]]) -> list[tuple[int, int]]:
    """Free slots of a rack, shelf by shelf from the top left."""
    taken = occupied(bottles, rack["id"])
    return [
        (r, c) for r, n in enumerate(shelves_of(rack)) for c in range(n) if (r, c) not in taken
    ]


def plan_positions(
    racks: list[dict[str, Any]],
    bottles: list[dict[str, Any]],
    quantity: int,
    rack_id: str | None = None,
    start: tuple[int, int] | None = None,
) -> list[tuple[str | None, int | None, int | None]]:
    """Where ``quantity`` new bottles go.

    From ``start`` in ``rack_id`` onwards if given, then any free slot in that
    rack, then the other racks in order. Bottles that do not fit stay
    unplaced (rack None) rather than being refused.
    """
    ordered = sorted(racks, key=lambda r: r.get("order", 0))
    if rack_id:
        ordered = [r for r in ordered if r["id"] == rack_id] + [r for r in ordered if r["id"] != rack_id]
    plan: list[tuple[str | None, int | None, int | None]] = []
    taken_extra: dict[str, set[tuple[int, int]]] = {}
    for rack in ordered:
        slots = free_slots(rack, bottles)
        if start and rack["id"] == rack_id:
            slots = [s for s in slots if s >= start] + [s for s in slots if s < start]
        for slot in slots:
            if len(plan) == quantity:
                break
            if slot in taken_extra.get(rack["id"], set()):
                continue
            taken_extra.setdefault(rack["id"], set()).add(slot)
            plan.append((rack["id"], slot[0], slot[1]))
    while len(plan) < quantity:
        plan.append((None, None, None))
    return plan


def location_text(bottle: dict[str, Any], racks: list[dict[str, Any]]) -> str:
    rack = next((r for r in racks if r["id"] == bottle.get("rack_id")), None)
    if not rack or bottle.get("row") is None or bottle.get("col") is None:
        return "Da sistemare"
    return f"{rack['name']} · mensola {bottle['row'] + 1}, posto {bottle['col'] + 1}"


# ── Drinking window ───────────────────────────────────────────────────────────

STATUS_UNKNOWN = "unknown"
STATUS_WAIT = "wait"        # not open yet
STATUS_READY = "ready"      # inside the window
STATUS_CLOSING = "closing"  # inside, near the end
STATUS_PAST = "past"        # closed


def _year(value: Any) -> int | None:
    try:
        year = int(value)
    except (TypeError, ValueError):
        return None
    return year if 1800 <= year <= 2200 else None


def window_status(bottle: dict[str, Any], today: date, lead_days: int) -> tuple[str, int | None]:
    """(status, days until the window closes)."""
    start, end = _year(bottle.get("drink_from")), _year(bottle.get("drink_until"))
    if end is None:
        return STATUS_UNKNOWN, None
    days_left = (date(end, 12, 31) - today).days
    if days_left < 0:
        return STATUS_PAST, days_left
    if start is not None and today < date(start, 1, 1):
        return STATUS_WAIT, days_left
    if days_left <= lead_days:
        return STATUS_CLOSING, days_left
    return STATUS_READY, days_left


def wine_key(bottle: dict[str, Any]) -> str:
    """Bottles of the same wine share this key (case/space-insensitive)."""
    name = re.sub(r"\s+", " ", str(bottle.get("name") or "")).strip().lower()
    producer = re.sub(r"\s+", " ", str(bottle.get("producer") or "")).strip().lower()
    return f"{name}|{producer}|{bottle.get('vintage') or ''}"


def drink_alerts(bottles: Iterable[dict[str, Any]], today: date, lead_days: int) -> dict[str, list[dict[str, Any]]]:
    """Wines that need attention, one entry per wine: {"closing": [...], "past": [...]}."""
    groups: dict[str, dict[str, dict[str, Any]]] = {STATUS_CLOSING: {}, STATUS_PAST: {}}
    for b in bottles:
        status, days_left = window_status(b, today, lead_days)
        if status not in groups:
            continue
        key = f"{status}|{wine_key(b)}"
        entry = groups[status].setdefault(key, {
            "key": key,
            "name": b.get("name") or "",
            "producer": b.get("producer") or "",
            "vintage": b.get("vintage"),
            "type": b.get("type") or "",
            "drink_from": b.get("drink_from"),
            "drink_until": b.get("drink_until"),
            "days_left": days_left,
            "bottles": 0,
            "bottle_ids": [],
        })
        entry["bottles"] += 1
        entry["bottle_ids"].append(b.get("id"))
    return {
        status: sorted(items.values(), key=lambda e: (e["days_left"], e["name"]))
        for status, items in groups.items()
    }


def label_lines(bottle: dict[str, Any], type_label: str, location: str) -> list[str]:
    """Text printed next to the QR, most important first."""
    lines = [str(bottle.get("name") or "Vino").strip()]
    second = " · ".join(str(p) for p in (bottle.get("vintage"), type_label) if p)
    if second:
        lines.append(second)
    if bottle.get("producer"):
        lines.append(str(bottle["producer"]).strip())
    if location:
        lines.append(location)
    return lines


# ── Cellar climate ────────────────────────────────────────────────────────────

def climate_status(value: Any, low: float, high: float) -> str | None:
    """"ok", "low", "high", or None when the reading is unavailable."""
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number < low:
        return "low"
    if number > high:
        return "high"
    return "ok"


# ── Food pairing ──────────────────────────────────────────────────────────────

def cellar_wines(bottles: Iterable[dict[str, Any]], racks: list[dict[str, Any]],
                 today: date, lead_days: int,
                 ratings: dict[str, dict[str, Any]] | None = None) -> list[dict[str, Any]]:
    """One entry per distinct wine in the cellar, with how many bottles and where."""
    ratings = ratings or {}
    wines: dict[str, dict[str, Any]] = {}
    for b in bottles:
        key = wine_key(b)
        entry = wines.get(key)
        if entry is None:
            status, days_left = window_status(b, today, lead_days)
            entry = wines[key] = {
                "key": key,
                "name": b.get("name") or "",
                "producer": b.get("producer") or "",
                "vintage": b.get("vintage"),
                "type": b.get("type") or "",
                "grape": b.get("grape") or "",
                "region": b.get("region") or "",
                "food_pairings": b.get("food_pairings") or "",
                "drink_peak": b.get("drink_peak"),
                "serve_temp": b.get("serve_temp") or "",
                "decant": b.get("decant") or "",
                "glass": b.get("glass") or "",
                "opened": 0,
                "status": status,
                "days_left": days_left,
                "bottles": 0,
                "bottle_ids": [],
                "locations": [],
                "rating": (ratings.get(key) or {}).get("rating"),
                "tasting_notes": (ratings.get(key) or {}).get("notes", ""),
            }
        entry["bottles"] += 1
        if b.get("opened_at"):
            entry["opened"] += 1
            entry["bottle_ids"].insert(0, b.get("id"))  # the open one first: finish it
            entry["locations"].insert(0, "Già aperta")
        else:
            entry["bottle_ids"].append(b.get("id"))
            entry["locations"].append(location_text(b, racks))
    return sorted(wines.values(), key=lambda w: (w["type"], w["name"].lower()))


_STOP = {"il", "lo", "la", "i", "gli", "le", "un", "una", "uno", "di", "da", "del", "della", "dei", "delle",
         "al", "alla", "ai", "alle", "con", "in", "e", "ed", "o", "a", "per", "su", "allo", "agli", "nel", "nella"}

# Very small sommelier fallback for when Gemini is not configured or fails.
_DISH_TYPES: list[tuple[tuple[str, ...], tuple[str, ...]]] = [
    (("pesce", "crud", "sushi", "ostric", "cozz", "vongol", "gamber", "scamp", "frutti di mare", "salmone",
      "tonno", "branzino", "orata", "baccal", "polpo", "calamar", "seppi", "risotto alla pescatora"),
     ("white", "sparkling", "rose")),
    (("aperitivo", "antipast", "fritt", "tempura", "pizza"), ("sparkling", "white", "rose")),
    (("formaggi stagionat", "parmigian", "pecorin", "gorgonzol", "erborinat"), ("red", "dessert")),
    (("formagg", "mozzarell", "burrat", "ricott"), ("white", "sparkling", "rose")),
    (("dolce", "torta", "dessert", "pasticc", "biscott", "crostat", "tiramis", "cioccolat", "panettone",
      "pandoro", "frutta secca"), ("dessert", "sparkling")),
    (("brasat", "stracott", "selvaggin", "cinghial", "cervo", "lepre", "agnell", "bistecc", "fiorentin",
      "tagliat", "grigliat", "arrost", "manzo", "carne rossa", "ragù", "ragu", "spezzatin", "bollit",
      "salsicc", "maiale", "costin", "tartufo", "fungh", "porcin"), ("red",)),
    (("pollo", "tacchino", "coniglio", "vitello", "carne bianca", "verdur", "ortagg", "salum", "prosciutt",
      "pasta", "lasagn", "pomodoro", "risotto"), ("red", "rose", "white")),
]


def _words(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-zàèéìòù]+", text.lower()) if len(w) > 2 and w not in _STOP}


def local_pairing(dish: str, wines: list[dict[str, Any]], limit: int = 3) -> list[dict[str, Any]]:
    """Rank cellar wines for a dish without AI: stored pairings first, then wine type."""
    dish_l = dish.lower()
    dish_words = _words(dish)
    preferred: tuple[str, ...] = ()
    for needles, types in _DISH_TYPES:
        if any(n in dish_l for n in needles):
            preferred = types
            break
    scored = []
    for w in wines:
        pair_words = _words(w.get("food_pairings") or "")
        common = {d for d in dish_words for p in pair_words if d[:5] == p[:5]}
        score = 3 * len(common)
        if w["type"] in preferred:
            score += 2 - preferred.index(w["type"]) * 0.5
        if w["status"] == STATUS_CLOSING:
            score += 0.5
        if w["status"] in (STATUS_WAIT,):
            score -= 1
        if w.get("rating"):
            score += (w["rating"] - 3) * 0.4
        if w.get("opened"):
            score += 1
        if score <= 0:
            continue
        if common:
            reason = f"Tra gli abbinamenti consigliati c'è {', '.join(sorted(common))}."
        else:
            reason = "Lo stile del vino va d'accordo con questo tipo di piatto."
        scored.append((score, w["key"], reason))
    scored.sort(key=lambda s: -s[0])
    return [{"key": k, "reason": r} for _, k, r in scored[:limit]]



# ── Ratings and value ─────────────────────────────────────────────────────────

def wine_ratings(history: Iterable[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """Average vote per wine from the bottles already drunk, with the latest note."""
    out: dict[str, dict[str, Any]] = {}
    for h in history:
        rating = h.get("rating")
        notes = str(h.get("tasting_notes") or "").strip()
        if not rating and not notes:
            continue
        entry = out.setdefault(wine_key(h), {"sum": 0, "count": 0, "notes": "", "at": ""})
        if rating:
            entry["sum"] += int(rating)
            entry["count"] += 1
        if notes and str(h.get("removed_at") or "") >= entry["at"]:
            entry["notes"], entry["at"] = notes, str(h.get("removed_at") or "")
    return {
        key: {"rating": round(e["sum"] / e["count"], 1) if e["count"] else None,
              "count": e["count"], "notes": e["notes"]}
        for key, e in out.items()
    }


def cellar_value(bottles: Iterable[dict[str, Any]]) -> dict[str, Any]:
    """Total price of the bottles in the cellar (only those with a price)."""
    total, priced, count = 0.0, 0, 0
    for b in bottles:
        count += 1
        try:
            price = float(b.get("price"))
        except (TypeError, ValueError):
            continue
        if price > 0:
            total += price
            priced += 1
    return {"total": round(total, 2), "priced": priced, "bottles": count}



# ── "Do I already have it?" ───────────────────────────────────────────────────

_NOISE = {"docg", "doc", "igt", "igp", "dop", "aoc", "riserva", "classico", "superiore", "vino", "vini",
          "cantina", "cantine", "azienda", "agricola", "tenuta", "tenute", "societa", "srl", "spa", "the"}


def _norm(text: Any) -> str:
    import unicodedata

    text = unicodedata.normalize("NFKD", str(text or "")).encode("ascii", "ignore").decode().lower()
    words = re.findall(r"[a-z0-9]+", text)
    return " ".join(w for w in words if w not in _NOISE and not re.fullmatch(r"(19|20)\d\d", w))


def _similar(a: str, b: str) -> float:
    from difflib import SequenceMatcher

    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    ta, tb = set(a.split()), set(b.split())
    overlap = len(ta & tb) / max(1, min(len(ta), len(tb)))
    return max(SequenceMatcher(None, a, b).ratio(), overlap * 0.95)


def wine_match(target: dict[str, Any], item: dict[str, Any]) -> str | None:
    """"same" (same wine and vintage), "vintage" (other vintage), "similar", or None."""
    name = _similar(_norm(target.get("name")), _norm(item.get("name")))
    tp, ip = _norm(target.get("producer")), _norm(item.get("producer"))
    producer = _similar(tp, ip) if tp and ip else None
    if name < 0.72 or (producer is not None and producer < 0.6):
        # A label often names the producer as the wine ("Gaja Barbaresco"):
        # accept when one side's producer+name equals the other's name.
        joined = _similar(_norm(f"{target.get('producer') or ''} {target.get('name') or ''}"),
                          _norm(f"{item.get('producer') or ''} {item.get('name') or ''}"))
        if joined < 0.85:
            return None
    strong = name >= 0.9 and (producer is None or producer >= 0.8)
    tv, iv = target.get("vintage"), item.get("vintage")
    if strong and (tv == iv or not tv):
        return "same"
    if strong:
        return "vintage"
    return "similar"


def check_wine(target: dict[str, Any], bottles: list[dict[str, Any]], history: list[dict[str, Any]],
               wishlist: list[dict[str, Any]], racks: list[dict[str, Any]]) -> dict[str, Any]:
    """Everything known about a wine seen in a shop: in the cellar, drunk, wished."""
    order = {"same": 0, "vintage": 1, "similar": 2}

    def group(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
        out: dict[str, dict[str, Any]] = {}
        for it in items:
            level = wine_match(target, it)
            if level is None:
                continue
            entry = out.setdefault(wine_key(it), {
                "match": level, "name": it.get("name") or "", "producer": it.get("producer") or "",
                "vintage": it.get("vintage"), "type": it.get("type") or "", "items": [],
            })
            entry["items"].append(it)
        return sorted(out.values(), key=lambda e: (order[e["match"]], -(e["vintage"] or 0)))

    cellar = []
    for e in group(bottles):
        items = e.pop("items")
        cellar.append({**e, "bottles": len(items), "bottle_ids": [b["id"] for b in items],
                       "locations": [location_text(b, racks) for b in items],
                       "reserved": sum(1 for b in items if b.get("reserved_for"))})
    drunk = []
    for e in group([h for h in history if h.get("reason") == "drank"]):
        items = e.pop("items")
        rated = [h["rating"] for h in items if h.get("rating")]
        last = max(items, key=lambda h: str(h.get("removed_at") or ""))
        notes = next((h.get("tasting_notes") for h in sorted(items, key=lambda h: str(h.get("removed_at") or ""),
                                                            reverse=True) if h.get("tasting_notes")), "")
        drunk.append({**e, "times": len(items), "rating": round(sum(rated) / len(rated), 1) if rated else None,
                      "notes": notes or "", "last": last.get("removed_at")})
    wished = []
    for e in group(wishlist):
        items = e.pop("items")
        wished.append({**e, "wish_id": items[0]["id"], "source": items[0].get("source")})
    return {"cellar": cellar, "drunk": drunk, "wished": wished}



# ── Opened bottles ────────────────────────────────────────────────────────────

def opened_status(bottle: dict[str, Any], now: datetime, open_days: dict[str, int]) -> dict[str, Any] | None:
    """How long a bottle has been open and whether it should be finished."""
    if not bottle.get("opened_at"):
        return None
    try:
        opened = datetime.fromisoformat(bottle["opened_at"])
    except ValueError:
        return None
    if opened.tzinfo is None:
        opened = opened.replace(tzinfo=now.tzinfo)
    days = max(0, (now - opened).days)
    limit = open_days.get(bottle.get("type") or "", 4)
    state = "ok" if days < limit - 1 else "today" if days <= limit else "late"
    return {"days": days, "limit": limit, "state": state}

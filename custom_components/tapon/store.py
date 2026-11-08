"""Persisted data: racks, bottles, history, settings (``.storage/tapon``).

One record per physical bottle. Wine details are copied onto each bottle,
so a bottle stays self-contained when it moves to the history.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DEFAULT_RACK, MAX_RACK_SIDE, REBUY_MIN_RATING, STORAGE_KEY, STORAGE_VERSION, WINE_TYPES
from .logic import new_code, new_id, occupied, plan_positions, rack_capacity, shelves_of, slot_exists, wine_key

# Wine fields a bottle carries; anything else sent by a client is ignored.
WINE_FIELDS = {
    "name": str, "producer": str, "vintage": int, "type": str, "region": str,
    "country": str, "grape": str, "drink_from": int, "drink_until": int, "drink_peak": int,
    "price": float, "notes": str, "description": str, "food_pairings": str,
    "alcohol": str, "image": str, "serve_temp": str, "decant": str, "glass": str,
}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def clean_wine(data: dict[str, Any]) -> dict[str, Any]:
    """Keep known fields, coerce types, turn empty values into None/""."""
    out: dict[str, Any] = {}
    for key, kind in WINE_FIELDS.items():
        if key not in data:
            continue
        value = data[key]
        if value in (None, ""):
            out[key] = None if kind in (int, float) else ""
            continue
        try:
            out[key] = kind(value) if kind is not str else str(value).strip()
        except (TypeError, ValueError):
            out[key] = None
    if "type" in out and out["type"] not in WINE_TYPES:
        out["type"] = "red"
    return out


class TaponStore:
    """All cellar data, with the operations the card and services need."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = {}
        self.imported = False  # data copied from the Suro or TaponBon storage

    # ── persistence ──────────────────────────────────────────────────────────

    async def async_load(self) -> None:
        data = await self._store.async_load()
        if data is None:
            from .migrate import async_load_old_data  # noqa: PLC0415

            data = await async_load_old_data(self.hass)
            self.imported = data is not None
        if data is None:
            data = {
                "racks": [{"id": "rack-a", "order": 0, **DEFAULT_RACK,
                           "shelves": [DEFAULT_RACK["cols"]] * DEFAULT_RACK["rows"]}],
                "bottles": [],
                "history": [],
                "settings": {},
                "wishlist": [],
            }
            self.data = data
            await self.async_save()
            return
        self.data = data
        for key, default in (("racks", []), ("bottles", []), ("history", []), ("settings", {}), ("wishlist", [])):
            self.data.setdefault(key, default)
        for rack in self.racks:
            if not rack.get("shelves"):
                rack["shelves"] = shelves_of(rack)
        if self._ensure_codes():
            # A code that only lived in memory would change at the next
            # restart, and its printed label would stop working.
            await self.async_save()

    async def async_save(self) -> None:
        await self._store.async_save(self.data)

    def _ensure_codes(self) -> bool:
        changed = False
        seen: set[str] = set()
        for b in self.bottles:
            if not b.get("code") or b["code"] in seen:
                b["code"] = new_code(seen | self._all_codes())
                changed = True
            seen.add(b["code"])
        return changed

    # ── accessors ────────────────────────────────────────────────────────────

    @property
    def racks(self) -> list[dict[str, Any]]:
        return self.data["racks"]

    @property
    def bottles(self) -> list[dict[str, Any]]:
        return self.data["bottles"]

    @property
    def history(self) -> list[dict[str, Any]]:
        return self.data["history"]

    @property
    def settings(self) -> dict[str, Any]:
        return self.data["settings"]

    @property
    def wishlist(self) -> list[dict[str, Any]]:
        return self.data["wishlist"]

    @property
    def highlight(self) -> dict[str, Any] | None:
        return self.data.get("highlight")

    @property
    def inventory(self) -> dict[str, Any] | None:
        return self.data.get("inventory")

    def _all_codes(self) -> set[str]:
        codes = {b.get("code") for b in self.bottles}
        codes |= {h.get("code") for h in self.history}
        return {c for c in codes if c}

    def get_bottle(self, bottle_id: str) -> dict[str, Any] | None:
        return next((b for b in self.bottles if b["id"] == bottle_id), None)

    def get_by_code(self, code: str) -> dict[str, Any] | None:
        return next((b for b in self.bottles if b.get("code") == code), None)

    def history_by_code(self, code: str) -> dict[str, Any] | None:
        return next((h for h in reversed(self.history) if h.get("code") == code), None)

    def bottle_at(self, rack_id: str, row: int, col: int) -> dict[str, Any] | None:
        return next(
            (b for b in self.bottles
             if b.get("rack_id") == rack_id and b.get("row") == row and b.get("col") == col),
            None,
        )

    def get_rack(self, rack_id: str | None) -> dict[str, Any] | None:
        return next((r for r in self.racks if r["id"] == rack_id), None)

    # ── bottles ──────────────────────────────────────────────────────────────

    def add_bottles(
        self,
        wine: dict[str, Any],
        quantity: int = 1,
        rack_id: str | None = None,
        row: int | None = None,
        col: int | None = None,
    ) -> list[dict[str, Any]]:
        """Add ``quantity`` bottles of one wine, filling free slots from (row, col)."""
        quantity = max(1, min(100, int(quantity)))
        start = (row, col) if row is not None and col is not None else None
        plan = plan_positions(self.racks, self.bottles, quantity, rack_id, start)
        details = clean_wine(wine)
        details.setdefault("name", "Vino")
        details.setdefault("type", "red")
        added = []
        codes = self._all_codes()
        for rack, r, c in plan:
            code = new_code(codes)
            codes.add(code)
            bottle = {
                "id": new_id("b"),
                "code": code,
                **details,
                "rack_id": rack,
                "row": r,
                "col": c,
                "added_at": _now(),
            }
            self.bottles.append(bottle)
            added.append(bottle)
        return added

    def update_bottle(self, bottle_id: str, changes: dict[str, Any], same_wine: bool = False) -> list[dict[str, Any]]:
        """Edit a bottle's wine details; with ``same_wine`` every bottle of that wine."""
        from .logic import wine_key

        bottle = self.get_bottle(bottle_id)
        if bottle is None:
            return []
        targets = [bottle]
        if same_wine:
            key = wine_key(bottle)
            targets = [b for b in self.bottles if wine_key(b) == key]
        details = clean_wine(changes)
        for b in targets:
            b.update(details)
        return targets

    def move_bottle(self, bottle_id: str, rack_id: str | None, row: int | None, col: int | None) -> bool:
        """Move to a slot; whoever was there swaps into the old slot."""
        bottle = self.get_bottle(bottle_id)
        if bottle is None:
            return False
        if rack_id is None:
            bottle.update(rack_id=None, row=None, col=None)
            return True
        rack = self.get_rack(rack_id)
        # Put back on a shelf: it is no longer an open bottle in the fridge.
        for key in ("opened_at", "opened_notified"):
            bottle.pop(key, None)
        if rack is None or not slot_exists(rack, row, col):
            return False
        other = self.bottle_at(rack_id, row, col)
        if other is not None and other is not bottle:
            other.update(rack_id=bottle.get("rack_id"), row=bottle.get("row"), col=bottle.get("col"))
        bottle.update(rack_id=rack_id, row=row, col=col)
        return True

    def remove_bottle(self, bottle_id: str, reason: str = "drank", rating: int | None = None,
                      tasting_notes: str | None = None) -> dict[str, Any] | None:
        """Take a bottle out of the cellar; it goes to the history."""
        bottle = self.get_bottle(bottle_id)
        if bottle is None:
            return None
        self.bottles.remove(bottle)
        self._unlight(bottle_id)
        entry = {**bottle, "history_id": new_id("h"), "removed_at": _now(), "reason": reason}
        _apply_rating(entry, rating, tasting_notes)
        self.history.append(entry)
        return entry

    def rate_history(self, history_id: str, rating: int | None, tasting_notes: str | None) -> dict[str, Any] | None:
        """Set (or clear) the vote and tasting notes of a bottle already drunk."""
        entry = next((h for h in self.history if h.get("history_id") == history_id), None)
        if entry is None:
            return None
        _apply_rating(entry, rating, tasting_notes, clear=True)
        return entry

    def restore(self, history_id: str) -> dict[str, Any] | None:
        """Put a bottle back: its old slot if free, otherwise unplaced. Keeps its QR."""
        entry = next((h for h in self.history if h.get("history_id") == history_id), None)
        if entry is None:
            return None
        self.history.remove(entry)
        bottle = {k: v for k, v in entry.items() if k not in HISTORY_ONLY}
        rack = self.get_rack(bottle.get("rack_id"))
        slot_ok = (
            rack is not None and slot_exists(rack, bottle.get("row"), bottle.get("col"))
            and self.bottle_at(rack["id"], bottle["row"], bottle["col"]) is None
        )
        if not slot_ok:
            bottle.update(rack_id=None, row=None, col=None)
        if self.get_by_code(bottle.get("code", "")):
            bottle["code"] = new_code(self._all_codes())
        self.bottles.append(bottle)
        return bottle

    # ── opened bottles ───────────────────────────────────────────────────────

    def open_bottle(self, bottle_id: str) -> dict[str, Any] | None:
        """Opened but not finished: it leaves its slot and the clock starts."""
        bottle = self.get_bottle(bottle_id)
        if bottle is None:
            return None
        bottle.update(rack_id=None, row=None, col=None, opened_at=_now())
        bottle.pop("opened_notified", None)
        self._unlight(bottle_id)
        return bottle

    # ── reservations ─────────────────────────────────────────────────────────

    def reserve_bottle(self, bottle_id: str, reserved_for: str | None, until: str | None) -> dict[str, Any] | None:
        """Set aside a bottle for an occasion (empty text and date = no longer reserved)."""
        bottle = self.get_bottle(bottle_id)
        if bottle is None:
            return None
        text = str(reserved_for or "").strip()[:200]
        day = _iso_day(until)
        for key in ("reserved_for", "reserved_until", "reserved_notified"):
            bottle.pop(key, None)
        if text or day:
            bottle["reserved_for"] = text or "Riservata"
            if day:
                bottle["reserved_until"] = day
        return bottle

    # ── highlighted bottles (search / pairing; later also the shelf LEDs) ──────

    highlight_dirty = False

    def set_highlight(self, groups: list[dict[str, Any]], source: str = "search", query: str = "") -> dict[str, Any] | None:
        """Light up bottles until one of them is taken or the user switches off."""
        known = {b["id"] for b in self.bottles}
        clean = []
        for g in groups[:12]:
            ids = [i for i in dict.fromkeys(g.get("bottle_ids") or []) if i in known]
            if ids:
                clean.append({"label": str(g.get("label") or "").strip()[:80],
                              "color": _hex_color(g.get("color")), "bottle_ids": ids})
        self.data["highlight"] = (
            {"source": source, "query": str(query or "")[:200], "started_at": _now(), "groups": clean} if clean else None
        )
        self.highlight_dirty = True
        return self.highlight

    def clear_highlight(self) -> None:
        if self.data.get("highlight"):
            self.data["highlight"] = None
            self.highlight_dirty = True

    def _unlight(self, bottle_id: str) -> None:
        """A highlighted bottle was taken: its group has done its job and goes dark."""
        hl = self.highlight
        if not hl:
            return
        groups = [g for g in hl["groups"] if bottle_id not in g["bottle_ids"]]
        if len(groups) != len(hl["groups"]):
            hl["groups"] = groups
            if not groups:
                self.data["highlight"] = None
            self.highlight_dirty = True

    # ── wishlist ─────────────────────────────────────────────────────────────

    def add_wish(self, wine: dict[str, Any], where: str = "", note: str = "", source: str = "manual",
                 rating: int | None = None) -> dict[str, Any]:
        wish = {
            **clean_wine(wine), "id": new_id("w"), "added_at": _now(), "source": source,
            "where": str(where or "").strip()[:200], "wish_notes": str(note or "").strip()[:1000],
        }
        if rating:
            wish["rating"] = int(rating)
        wish.setdefault("type", "red")
        self.wishlist.append(wish)
        return wish

    def update_wish(self, wish_id: str, changes: dict[str, Any]) -> dict[str, Any] | None:
        wish = next((w for w in self.wishlist if w["id"] == wish_id), None)
        if wish is None:
            return None
        wish.update(clean_wine(changes))
        for key in ("where", "wish_notes"):
            if key in changes:
                wish[key] = str(changes[key] or "").strip()[:1000]
        return wish

    def maybe_rebuy(self, entry: dict[str, Any]) -> dict[str, Any] | None:
        """Last bottle of a wine you loved: put it on the wishlist to buy again."""
        if entry.get("reason") != "drank" or (entry.get("rating") or 0) < REBUY_MIN_RATING:
            return None
        key = wine_key(entry)
        if any(wine_key(b) == key for b in self.bottles) or any(wine_key(w) == key for w in self.wishlist):
            return None
        note = "Da ricomprare" + (f": «{entry['tasting_notes']}»" if entry.get("tasting_notes") else "")
        return self.add_wish(entry, note=note, source="rebuy", rating=entry.get("rating"))

    def remove_wish(self, wish_id: str) -> bool:
        before = len(self.wishlist)
        self.data["wishlist"] = [w for w in self.wishlist if w["id"] != wish_id]
        return len(self.wishlist) != before

    # ── inventory check ──────────────────────────────────────────────────────

    def inventory_start(self, rack_id: str | None) -> dict[str, Any]:
        if rack_id is not None and self.get_rack(rack_id) is None:
            rack_id = None
        self.data["inventory"] = {"started_at": _now(), "rack_id": rack_id, "seen": [], "found_taken": [],
                                  "unknown": 0, "last": None}
        return self.data["inventory"]

    def inventory_stop(self) -> None:
        self.data.pop("inventory", None)

    def inventory_scan(self, code: str) -> dict[str, Any]:
        """Mark a bottle as physically present; never takes anything out."""
        inv = self.inventory
        if inv is None:
            return {"result": "inactive"}
        bottle = self.get_by_code(code)
        if bottle is not None:
            already = code in inv["seen"]
            if not already:
                inv["seen"].append(code)
            misplaced = bool(inv.get("rack_id")) and bottle.get("rack_id") != inv["rack_id"]
            inv["last"] = {"code": code, "name": bottle.get("name"), "vintage": bottle.get("vintage"),
                           "result": "misplaced" if misplaced else ("again" if already else "ok")}
            return {"result": inv["last"]["result"], "bottle": bottle}
        past = self.history_by_code(code)
        if past is not None:
            if past["history_id"] not in inv["found_taken"]:
                inv["found_taken"].append(past["history_id"])
            inv["last"] = {"code": code, "name": past.get("name"), "vintage": past.get("vintage"),
                           "result": "found_taken"}
            return {"result": "found_taken", "entry": past}
        inv["unknown"] += 1
        inv["last"] = {"code": code, "name": None, "vintage": None, "result": "unknown"}
        return {"result": "unknown"}

    def inventory_report(self) -> dict[str, Any] | None:
        inv = self.inventory
        if inv is None:
            return None
        rack_id = inv.get("rack_id")
        scope = [b for b in self.bottles
                 if not b.get("opened_at") and (rack_id is None or b.get("rack_id") == rack_id)]
        seen = set(inv["seen"])
        missing = [b for b in scope if b.get("code") not in seen]
        misplaced = [b for b in self.bottles if b.get("code") in seen and rack_id and b.get("rack_id") != rack_id]
        found = [h for h in self.history if h.get("history_id") in set(inv["found_taken"])]
        return {
            "started_at": inv["started_at"], "rack_id": rack_id, "total": len(scope),
            "seen": sum(1 for b in scope if b.get("code") in seen), "unknown": inv["unknown"],
            "last": inv.get("last"),
            "missing": [b["id"] for b in missing],
            "misplaced": [b["id"] for b in misplaced],
            "found_taken": [h["history_id"] for h in found],
        }

    # ── racks ────────────────────────────────────────────────────────────────

    def save_rack(self, rack: dict[str, Any]) -> tuple[dict[str, Any], int]:
        """Create or update a rack. Returns (rack, bottles moved to unplaced)."""
        if isinstance(rack.get("shelves"), list) and rack["shelves"]:
            shelves = [max(1, min(MAX_RACK_SIDE, int(n or 1))) for n in rack["shelves"][:MAX_RACK_SIDE]]
        else:
            shelves = [max(1, min(MAX_RACK_SIDE, int(rack.get("cols") or 1)))] * max(
                1, min(MAX_RACK_SIDE, int(rack.get("rows") or 1))
            )
        name = str(rack.get("name") or "Scaffale").strip()[:40] or "Scaffale"
        existing = self.get_rack(rack.get("id"))
        if existing is None:
            existing = {"id": new_id("rack-"), "order": len(self.racks)}
            self.racks.append(existing)
        existing.update(name=name, shelves=shelves, rows=len(shelves), cols=max(shelves))
        displaced = 0
        for b in self.bottles:
            if b.get("rack_id") == existing["id"] and not slot_exists(existing, b.get("row"), b.get("col")):
                b.update(rack_id=None, row=None, col=None)
                displaced += 1
        return existing, displaced

    def delete_rack(self, rack_id: str) -> int:
        """Remove a rack; its bottles become unplaced (never deleted)."""
        rack = self.get_rack(rack_id)
        if rack is None:
            return 0
        self.racks.remove(rack)
        moved = 0
        for b in self.bottles:
            if b.get("rack_id") == rack_id:
                b.update(rack_id=None, row=None, col=None)
                moved += 1
        for i, r in enumerate(sorted(self.racks, key=lambda r: r.get("order", 0))):
            r["order"] = i
        return moved

    def capacity(self) -> int:
        return sum(rack_capacity(r) for r in self.racks)

    def free_count(self) -> int:
        return sum(rack_capacity(r) - len(occupied(self.bottles, r["id"])) for r in self.racks)


HISTORY_ONLY = ("history_id", "removed_at", "reason", "rating", "tasting_notes", "opened_at", "opened_notified")


def _hex_color(value: Any) -> str:
    import re

    text = str(value or "").strip()
    return text.lower() if re.fullmatch(r"#[0-9a-fA-F]{6}", text) else "#ffe2b0"


def _iso_day(value: Any) -> str | None:
    from datetime import date

    try:
        return date.fromisoformat(str(value)[:10]).isoformat() if value else None
    except ValueError:
        return None


def _apply_rating(entry: dict[str, Any], rating: Any, notes: Any, clear: bool = False) -> None:
    try:
        value = int(rating) if rating not in (None, "") else None
    except (TypeError, ValueError):
        value = None
    if value is not None and 1 <= value <= 5:
        entry["rating"] = value
    elif clear:
        entry.pop("rating", None)
    text = str(notes or "").strip()[:1000]
    if text:
        entry["tasting_notes"] = text
    elif clear:
        entry.pop("tasting_notes", None)

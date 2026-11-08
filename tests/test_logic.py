import io
from datetime import date

from tb import labels, logic as lg


def test_codes_unique_and_scans_round_trip():
    codes = set()
    for _ in range(300):
        codes.add(lg.new_code(codes))
    assert len(codes) == 300
    code = next(iter(codes))
    for raw in (lg.tag_id_for(code), lg.qr_payload_for(code), lg.qr_payload_for(code) + "/"):
        assert lg.parse_scanned(raw) == lg.Scanned("bottle", code=code)
    for raw in (None, "", "front-door", "tapon-", "tapon-OOO0", "corkdork-abc"):
        assert lg.parse_scanned(raw) is None


def test_labels_printed_as_taponbon_still_scan():
    assert lg.parse_scanned("https://www.home-assistant.io/tag/taponbon-k7m2xq9p") == lg.Scanned("bottle", code="k7m2xq9p")
    assert lg.parse_scanned("taponbon-slot-rack-a/1/2") == lg.Scanned("slot", rack_id="rack-a", row=1, col=2)
    assert lg.parse_scanned("suro-k7m2xq9p") == lg.Scanned("bottle", code="k7m2xq9p")
    assert lg.parse_scanned("suro-slot-rack-a/1/2") == lg.Scanned("slot", rack_id="rack-a", row=1, col=2)
    assert lg.tag_id_for("k7m2xq9p") == "tapon-k7m2xq9p"


def test_dashboards_are_rewritten_for_the_new_name():
    from tb.migrate import rewrite_dashboard

    cfg = {"views": [{"cards": [{"type": "custom:suro-card"}, {"type": "entity", "entity": "sensor.taponbon_bottiglie"},
                                {"type": "markdown", "content": "Èccomi"}]}]}
    new, changed = rewrite_dashboard(cfg)
    assert changed and new["views"][0]["cards"][0]["type"] == "custom:tapon-card"
    assert new["views"][0]["cards"][1]["entity"] == "sensor.tapon_bottiglie"
    assert new["views"][0]["cards"][2]["content"] == "Èccomi"
    assert rewrite_dashboard(new) == (new, False)


def test_slot_tag():
    tag = lg.slot_tag_id("rack-a", 2, 5)
    assert lg.parse_scanned(tag) == lg.Scanned("slot", rack_id="rack-a", row=2, col=5)


def test_plan_positions_fills_from_start_then_spills_over():
    racks = [{"id": "a", "rows": 2, "cols": 2, "order": 0}, {"id": "b", "rows": 1, "cols": 2, "order": 1}]
    bottles = [{"rack_id": "a", "row": 0, "col": 0}]
    plan = lg.plan_positions(racks, bottles, 6, "a", (1, 0))
    assert plan == [("a", 1, 0), ("a", 1, 1), ("a", 0, 1), ("b", 0, 0), ("b", 0, 1), (None, None, None)]


def test_window_status_and_alerts():
    today = date(2026, 11, 2)
    s = lambda b: lg.window_status(b, today, 180)[0]  # noqa: E731
    assert s({"drink_from": 2028, "drink_until": 2035}) == lg.STATUS_WAIT
    assert s({"drink_from": 2024, "drink_until": 2030}) == lg.STATUS_READY
    assert s({"drink_until": 2026}) == lg.STATUS_CLOSING
    assert s({"drink_until": 2025}) == lg.STATUS_PAST
    assert s({}) == lg.STATUS_UNKNOWN
    bottles = [
        {"id": "1", "name": "Barolo", "vintage": 2012, "drink_until": 2026},
        {"id": "2", "name": "barolo ", "vintage": 2012, "drink_until": 2026},
        {"id": "3", "name": "Soave", "vintage": 2019, "drink_until": 2023},
    ]
    groups = lg.drink_alerts(bottles, today, 180)
    assert [(e["name"], e["bottles"]) for e in groups["closing"]] == [("Barolo", 2)]
    assert [e["name"] for e in groups["past"]] == ["Soave"]


def test_label_renders_and_decodes_size():
    from PIL import Image

    lines = lg.label_lines({"name": "Brunello di Montalcino", "vintage": 2016, "producer": "Mastrojanni"},
                           "Rosso", "Scaffale · fila 2, posto 5")
    assert lines[:2] == ["Brunello di Montalcino", "2016 · Rosso"]
    png = labels.render_png("k7m2xq9p", lines)
    assert Image.open(io.BytesIO(png)).size == (labels.WIDTH, labels.HEIGHT)
    assert labels.qr_svg("k7m2xq9p").startswith("<svg")


def test_qr_only_label_is_square_and_decodable_size():
    from PIL import Image

    png = labels.render("k7m2xq9p", [], "qr")
    assert Image.open(io.BytesIO(png)).size == (labels.QR_PX, labels.QR_PX)
    assert labels.render("k7m2xq9p", ["A"], "full") != png


def test_climate_status():
    assert lg.climate_status("12.5", 10, 16) == "ok"
    assert lg.climate_status(8, 10, 16) == "low"
    assert lg.climate_status("17", 10, 16) == "high"
    assert lg.climate_status("unavailable", 10, 16) is None
    assert lg.climate_status(None, 10, 16) is None


def test_niimbot_payload_sizes():
    p = labels.niimbot_payload("k7m2xq9p", ["Barolo"], "qr30")
    assert (p["width"], p["height"]) == (240, 240)
    qr = p["payload"][0]
    assert qr["type"] == "qrcode" and qr["data"].endswith("tapon-k7m2xq9p")
    assert qr["x"] + qr["width"] <= 240 and qr["y"] + qr["height"] <= 240
    full = labels.niimbot_payload("k7m2xq9p", ["Barolo", "2016 · Rosso", "Brezza", "Scaffale"], "full")
    assert (full["width"], full["height"]) == (400, 240) and len(full["payload"]) == 6


def test_cellar_wines_and_local_pairing():
    from datetime import date
    from tb.logic import cellar_wines, local_pairing
    racks = [{"id": "r", "name": "Scaffale", "shelves": [5, 5]}]
    bottles = [
        {"id": "1", "name": "Barolo", "producer": "Brezza", "vintage": 2016, "type": "red",
         "food_pairings": "brasato, tartufo, formaggi stagionati", "rack_id": "r", "row": 0, "col": 0},
        {"id": "2", "name": "barolo ", "producer": "Brezza", "vintage": 2016, "type": "red", "rack_id": "r", "row": 0, "col": 1},
        {"id": "3", "name": "Vermentino", "type": "white", "food_pairings": "pesce, crudi", "rack_id": None},
    ]
    wines = cellar_wines(bottles, racks, date(2026, 11, 3), 180)
    assert len(wines) == 2
    barolo = next(w for w in wines if w["type"] == "red")
    assert barolo["bottles"] == 2 and barolo["locations"][0] == "Scaffale · mensola 1, posto 1"
    picks = local_pairing("Brasato al Barolo", wines)
    assert picks[0]["key"] == barolo["key"]
    assert local_pairing("spaghetti alle vongole", wines)[0]["key"] != barolo["key"]


def test_check_wine_matches():
    from tb.logic import check_wine, wine_match
    seen = {"name": "Barolo Cannubi DOCG", "producer": "Brezza", "vintage": 2016}
    assert wine_match(seen, {"name": "Barolo Cannubi", "producer": "Giacomo Brezza", "vintage": 2016}) == "same"
    assert wine_match(seen, {"name": "barolo cannubi", "producer": "Brezza", "vintage": 2019}) == "vintage"
    assert wine_match(seen, {"name": "Barolo Cannubi", "producer": "Marchesi di Barolo"}) is None
    assert wine_match(seen, {"name": "Soave", "producer": "Brezza"}) is None
    assert wine_match({"name": "Sassicaia"}, {"name": "Sassicaia Bolgheri", "producer": "Tenuta San Guido"}) in ("same", "similar")
    racks = [{"id": "r", "name": "Scaffale", "shelves": [5]}]
    bottles = [{"id": "1", "name": "Barolo Cannubi", "producer": "Brezza", "vintage": 2016, "rack_id": "r", "row": 0, "col": 2},
               {"id": "2", "name": "Barolo Cannubi", "producer": "Brezza", "vintage": 2019, "rack_id": None,
                "reserved_for": "x"}]
    history = [{"name": "Barolo Cannubi", "producer": "Brezza", "vintage": 2016, "reason": "drank", "rating": 5,
                "tasting_notes": "wow", "removed_at": "2026-01-01"},
               {"name": "Barolo Cannubi", "producer": "Brezza", "vintage": 2016, "reason": "gifted"}]
    wish = [{"id": "w", "name": "Barolo Cannubi", "producer": "Brezza", "vintage": 2021, "source": "manual"}]
    out = check_wine(seen, bottles, history, wish, racks)
    assert [c["vintage"] for c in out["cellar"]] == [2016, 2019]
    assert out["cellar"][0]["match"] == "same" and out["cellar"][0]["locations"] == ["Scaffale · mensola 1, posto 3"]
    assert out["cellar"][1]["reserved"] == 1
    assert out["drunk"] == [{"match": "same", "name": "Barolo Cannubi", "producer": "Brezza", "vintage": 2016,
                             "type": "", "times": 1, "rating": 5.0, "notes": "wow", "last": "2026-01-01"}]
    assert out["wished"][0]["match"] == "vintage" and out["wished"][0]["wish_id"] == "w"


def test_peak_is_clamped():
    from tb import ai
    assert ai.normalize({"drink_from": 2020, "drink_until": 2030, "drink_peak": 2040})["drink_peak"] == 2030


def test_opened_status():
    from datetime import datetime, timedelta, timezone
    from tb.logic import opened_status
    now = datetime(2026, 11, 4, 18, tzinfo=timezone.utc)
    days = {"white": 3, "red": 5}
    def b(t, d):
        return {"type": t, "opened_at": (now - timedelta(days=d, hours=1)).isoformat()}
    assert opened_status({"type": "red"}, now, days) is None
    assert opened_status(b("red", 1), now, days) == {"days": 1, "limit": 5, "state": "ok"}
    assert opened_status(b("white", 2), now, days)["state"] == "today"
    assert opened_status(b("white", 4), now, days)["state"] == "late"
    assert opened_status(b("dessert", 10), now, days)["limit"] == 4


def test_opened_bottle_first_in_pairing():
    from datetime import date
    from tb.logic import cellar_wines
    racks = [{"id": "r", "name": "S", "shelves": [5]}]
    bottles = [{"id": "1", "name": "Soave", "type": "white", "rack_id": "r", "row": 0, "col": 0},
               {"id": "2", "name": "Soave", "type": "white", "rack_id": None, "opened_at": "2026-11-03T20:00:00+00:00"}]
    (w,) = cellar_wines(bottles, racks, date(2026, 11, 4), 180)
    assert w["opened"] == 1 and w["bottle_ids"][0] == "2" and w["locations"][0] == "Già aperta"

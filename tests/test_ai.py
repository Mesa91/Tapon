import json

import pytest

from tb import ai


def _payload(obj):
    return {"candidates": [{"content": {"parts": [{"text": json.dumps(obj) if not isinstance(obj, str) else obj}]}}]}


def test_parse_and_normalize():
    wine = ai.parse_response(_payload({
        "name": "Barolo Cannubi", "producer": "Brezza", "vintage": "2016", "type": "Rosso",
        "region": "Barolo DOCG", "country": "Italia", "grape": "Nebbiolo", "alcohol": "14,5",
        "drink_from": 2034, "drink_until": "2022", "description": "Elegante.",
        "food_pairings": ["brasato", "tartufo"], "extra": "ignored", "producer_note": None,
    }))
    assert wine["vintage"] == 2016 and wine["type"] == "red"
    assert (wine["drink_from"], wine["drink_until"]) == (2022, 2034)
    assert wine["alcohol"] == "14,5%" and wine["food_pairings"] == "brasato, tartufo"
    assert "extra" not in wine


def test_parse_fenced_json_and_types():
    text = '```json\n{"name": "Franciacorta", "type": "spumante", "vintage": null}\n```'
    wine = ai.parse_response(_payload(text))
    assert wine == {"name": "Franciacorta", "type": "sparkling"}


def test_empty_answer_is_a_readable_error():
    with pytest.raises(ai.AIError):
        ai.parse_response({"promptFeedback": {"blockReason": "SAFETY"}})


def test_prompts_mention_fields():
    assert '"drink_until"' in ai.label_prompt()
    assert "Barolo" in ai.fill_prompt({"name": "Barolo", "notes": "x"})


def test_choose_model_prefers_newest_stable_flash():
    gen = ["generateContent"]
    models = [
        {"name": "models/gemini-2.5-flash", "supportedGenerationMethods": gen},
        {"name": "models/gemini-3.6-flash", "supportedGenerationMethods": gen},
        {"name": "models/gemini-3.8-flash-preview", "supportedGenerationMethods": gen},
        {"name": "models/gemini-3.5-flash-lite", "supportedGenerationMethods": gen},
        {"name": "models/gemini-3.8-flash-tts", "supportedGenerationMethods": gen},
        {"name": "models/gemini-3.1-flash-image", "supportedGenerationMethods": gen},
        {"name": "models/gemini-embedding-2", "supportedGenerationMethods": ["embedContent"]},
        {"name": "models/gemini-flash-latest", "supportedGenerationMethods": gen},
    ]
    assert ai.choose_model(models) == "gemini-3.6-flash"
    assert ai.choose_model(models, lite=True) == "gemini-3.5-flash-lite"
    assert ai.choose_model([]) is None


def test_parse_pairing_checks_ids():
    out = ai.parse_pairing(_payload({"picks": [{"id": 1, "reason": "Tannino e grasso"}, {"id": 9}, {"id": "1"},
                                               {"id": "0", "reason": "ok"}], "advice": "Decanta 1 ora"}), 2)
    assert out == {"picks": [{"index": 1, "reason": "Tannino e grasso"}, {"index": 0, "reason": "ok"}],
                   "advice": "Decanta 1 ora"}


def test_pairing_prompt_lists_wines():
    prompt = ai.pairing_prompt("brasato", [{"name": "Barolo", "vintage": 2016, "producer": "X", "type": "red",
                                            "grape": "", "region": "", "food_pairings": "brasato",
                                            "status": "closing", "bottles": 2}])
    assert "brasato" in prompt and "da bere presto" in prompt and '"id": 0' in prompt


def test_parse_menu():
    out = ai.parse_menu(_payload({"courses": [{"n": 1, "id": 0, "reason": "ok"}, {"n": 0, "id": None},
                                              {"n": 7, "id": 1}], "one": {"id": "1", "reason": "tutto"},
                                  "advice": "Apri prima il bianco"}), 2, 2)
    assert out["courses"] == [{"index": None, "reason": ""}, {"index": 0, "reason": "ok"}]
    assert out["one"] == {"index": 1, "reason": "tutto"} and out["advice"] == "Apri prima il bianco"
    assert ai.parse_menu(_payload({"courses": []}), 1, 1)["one"] is None
    prompt = ai.menu_prompt(["Crudi", "Brasato"], [{"name": "Barolo", "vintage": 2016, "producer": "", "type": "red",
                            "grape": "", "region": "", "food_pairings": "", "status": "ready", "bottles": 1,
                            "rating": 4.5}])
    assert "Brasato" in prompt and "4.5/5" in prompt


def test_model_retired_messages():
    assert ai.model_retired("This model models/gemini-2.5-flash is no longer available to new users. "
                            "Please update your code to use models/gemini-3.8-flash")
    assert ai.model_retired("models/gemini-1.5-flash is not found for API version v1beta")
    assert not ai.model_retired("API key not valid. Please pass a valid API key.")
    assert not ai.model_retired("Resource has been exhausted (e.g. check quota).")

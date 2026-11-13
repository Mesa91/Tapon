"""Gemini: read a wine label photo, or complete a wine from its name.

No Home Assistant imports here: the HTTP session is passed in, and the
prompt/parsing helpers are pure, so they are tested on their own.
"""

from __future__ import annotations

import json
import re
from datetime import date
from typing import Any

API = "https://generativelanguage.googleapis.com/v1beta/models"
# An alias Google keeps pointing at its newest Flash model, so a model being
# retired never breaks label reading.
DEFAULT_MODEL = "gemini-flash-latest"
TIMEOUT = 30  # per attempt; a busy model then falls back to Flash-Lite
# Ragionamento ridotto sul Flash completo: circa metà del tempo, qualità quasi identica
# per leggere un'etichetta e compilare la scheda. La Lite resta sul suo «minimal».
THINKING_LEVEL = "low"


def thinking_config(model: str) -> dict[str, Any] | None:
    """thinkingConfig da mandare, o None se il modello non lo usa (Lite, serie 1.x/2.x)."""
    name = (model or "").removeprefix("models/")
    if "lite" in name or re.match(r"gemini-[12](\.|-)", name):
        return None
    return {"thinkingLevel": THINKING_LEVEL}

TYPES = ("red", "white", "rose", "sparkling", "dessert")

FIELDS_DOC = """\
- "name": nome del vino come in etichetta, senza produttore né annata (es. "Barolo Cannubi")
- "producer": cantina / produttore
- "vintage": annata (numero intero) oppure null se non millesimato
- "type": uno tra "red", "white", "rose", "sparkling", "dessert"
- "region": denominazione o zona (es. "Barolo DOCG, Piemonte")
- "country": paese, in italiano
- "grape": vitigno o uvaggio
- "alcohol": gradazione, es. "14%"
- "drink_from": primo anno consigliato per berlo (intero)
- "drink_until": ultimo anno consigliato per berlo (intero)
- "drink_peak": anno in cui sarà al suo meglio (intero, tra drink_from e drink_until)
- "description": 2-3 frasi in italiano su stile, profumi e gusto
- "food_pairings": 3-5 abbinamenti in italiano separati da virgola
- "serve_temp": temperatura di servizio, es. "16–18 °C"
- "decant": se e quanto decantare, es. "1 ora" oppure "no"
- "glass": bicchiere consigliato, es. "calice Borgogna", "flûte", "tulipano"
"""


def label_prompt(today: date | None = None) -> str:
    year = (today or date.today()).year
    return f"""Sei un sommelier esperto. Guarda la foto dell'etichetta di questo vino (se
le foto sono due, la prima è il fronte e la seconda il retro: usale entrambe) e
restituisci SOLO un oggetto JSON con questi campi:
{FIELDS_DOC}
Regole: quello che leggi in etichetta ha la precedenza; quello che non si legge
(finestra di beva e anno di picco, descrizione, abbinamenti, vitigno se assente) stimalo dalle
tue conoscenze sul vino e sull'annata. L'anno corrente è {year}. Se un campo è
davvero impossibile da stabilire usa null. Niente testo fuori dal JSON."""


def fill_prompt(wine: dict[str, Any], today: date | None = None) -> str:
    year = (today or date.today()).year
    known = {k: v for k, v in wine.items() if v not in (None, "") and k in (
        "name", "producer", "vintage", "type", "region", "country", "grape")}
    return f"""Sei un sommelier esperto. Di questo vino conosco:
{json.dumps(known, ensure_ascii=False)}
Restituisci SOLO un oggetto JSON con questi campi, completando quelli mancanti
con le tue conoscenze (non cambiare quelli noti se non sono chiaramente errati):
{FIELDS_DOC}
L'anno corrente è {year}. Se un campo è impossibile da stabilire usa null."""


def _int_year(value: Any) -> int | None:
    match = re.search(r"\b(1[89]\d\d|20\d\d|21\d\d)\b", str(value or ""))
    return int(match.group(1)) if match else None


def normalize(raw: dict[str, Any]) -> dict[str, Any]:
    """Turn Gemini's answer into clean wine fields (unknown keys dropped)."""
    out: dict[str, Any] = {}
    for key in ("name", "producer", "region", "country", "grape", "alcohol", "description", "food_pairings",
                "serve_temp", "decant", "glass"):
        value = raw.get(key)
        if isinstance(value, list):
            value = ", ".join(str(v) for v in value if v)
        if value not in (None, "") and str(value).strip().lower() not in ("null", "none", "n/a"):
            out[key] = str(value).strip()
    for key in ("vintage", "drink_from", "drink_until", "drink_peak"):
        year = _int_year(raw.get(key))
        if year:
            out[key] = year
    kind = str(raw.get("type") or "").strip().lower()
    aliases = {"rosé": "rose", "rosato": "rose", "rosso": "red", "bianco": "white",
               "spumante": "sparkling", "bollicine": "sparkling", "champagne": "sparkling",
               "dolce": "dessert", "passito": "dessert", "fortified": "dessert"}
    kind = aliases.get(kind, kind)
    if kind in TYPES:
        out["type"] = kind
    if out.get("drink_from") and out.get("drink_until") and out["drink_from"] > out["drink_until"]:
        out["drink_from"], out["drink_until"] = out["drink_until"], out["drink_from"]
    if out.get("drink_peak") and out.get("drink_from") and out.get("drink_until"):
        out["drink_peak"] = min(max(out["drink_peak"], out["drink_from"]), out["drink_until"])
    if isinstance(out.get("alcohol"), str) and re.fullmatch(r"\d+([.,]\d+)?", out["alcohol"]):
        out["alcohol"] += "%"
    return out


def parse_response(payload: dict[str, Any]) -> dict[str, Any]:
    """Extract and normalise the JSON object from a generateContent response."""
    data = _json_from(payload)
    if isinstance(data, list):
        data = data[0] if data else {}
    return normalize(data)


def _json_from(payload: dict[str, Any]) -> Any:
    try:
        text = "".join(p.get("text", "") for p in payload["candidates"][0]["content"]["parts"])
    except (KeyError, IndexError, TypeError) as err:
        reason = (payload.get("promptFeedback") or {}).get("blockReason") if isinstance(payload, dict) else None
        raise AIError(f"Risposta vuota da Gemini{f' ({reason})' if reason else ''}") from err
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.M).strip()
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.S)
        if not match:
            raise AIError("Gemini non ha risposto con dei dati leggibili") from None
        data = json.loads(match.group(0))
    return data


def _wine_listing(wines: list[dict[str, Any]]) -> list[dict[str, Any]]:
    status = {"wait": "ancora giovane", "ready": "pronto", "closing": "da bere presto", "past": "oltre la finestra"}
    listing = []
    for i, w in enumerate(wines):
        item = {"id": i, "vino": " ".join(str(p) for p in (w["name"], w["vintage"]) if p), "produttore": w["producer"],
                "tipo": w["type"], "vitigno": w["grape"], "zona": w["region"], "abbinamenti": w["food_pairings"],
                "stato": status.get(w["status"], ""), "bottiglie": w["bottles"]}
        if w.get("drink_peak"):
            item["picco"] = w["drink_peak"]
        if w.get("opened"):
            item["aperta"] = "sì, una bottiglia è già aperta: da finire"
        if w.get("rating"):
            item["voto_mio"] = f"{w['rating']}/5"
        if w.get("tasting_notes"):
            item["mie_note"] = w["tasting_notes"][:200]
        listing.append(item)
    return listing


_PREFS = """A parità, preferisci le bottiglie già "aperta", poi i vini "da bere presto" e quelli con "voto_mio" alto
(sono i voti che ho dato a bottiglie dello stesso vino già bevute); evita quelli
"ancora giovane" se ce ne sono di pronti."""


def pairing_prompt(dish: str, wines: list[dict[str, Any]], today: date | None = None) -> str:
    year = (today or date.today()).year
    return f"""Sei un sommelier. Stasera si mangia: "{dish}".
Questi sono TUTTI i vini disponibili in cantina (l'anno corrente è {year}):
{json.dumps(_wine_listing(wines), ensure_ascii=False)}
Scegli SOLO tra questi vini i migliori abbinamenti per il piatto (da 1 a 3, il
migliore per primo; meglio meno vini che un abbinamento forzato). {_PREFS}
Restituisci SOLO un oggetto JSON:
{{"picks": [{{"id": <id del vino>, "reason": "1-2 frasi in italiano sul perché"}}],
  "advice": "una frase in italiano: se nessun vino è davvero adatto, che stile
             comprare; altrimenti un consiglio di servizio (temperatura, decanter)"}}"""


def menu_prompt(courses: list[str], wines: list[dict[str, Any]], today: date | None = None) -> str:
    year = (today or date.today()).year
    menu = [{"n": i, "portata": c} for i, c in enumerate(courses)]
    return f"""Sei un sommelier. Stasera c'è questo menu, nell'ordine:
{json.dumps(menu, ensure_ascii=False)}
Questi sono TUTTI i vini disponibili in cantina (l'anno corrente è {year}):
{json.dumps(_wine_listing(wines), ensure_ascii=False)}
Proponi SOLO vini di questa lista:
1. un percorso: per ogni portata il vino migliore, seguendo una progressione
   sensata (dal più leggero al più strutturato, il dolce per ultimo). Lo stesso
   vino può accompagnare più portate se ha senso; se per una portata nessun vino
   è adatto usa "id": null.
2. in alternativa, l'unico vino che regge meglio l'intera cena.
{_PREFS}
Restituisci SOLO un oggetto JSON:
{{"courses": [{{"n": <numero portata>, "id": <id del vino o null>, "reason": "1 frase in italiano"}}],
  "one": {{"id": <id del vino o null>, "reason": "1-2 frasi in italiano"}},
  "advice": "una frase in italiano su servizio e ordine di apertura delle bottiglie"}}"""


def _index(value: Any, count: int) -> int | None:
    try:
        index = int(value)
    except (TypeError, ValueError):
        return None
    return index if 0 <= index < count else None


def parse_menu(payload: dict[str, Any], courses: int, count: int) -> dict[str, Any]:
    """{"courses": [{"index"|None, "reason"} per course], "one": {...}|None, "advice"}."""
    data = _json_from(payload)
    data = data if isinstance(data, dict) else {}
    out = [{"index": None, "reason": ""} for _ in range(courses)]
    for item in data.get("courses") or []:
        if not isinstance(item, dict):
            continue
        n = _index(item.get("n"), courses)
        if n is not None:
            out[n] = {"index": _index(item.get("id"), count), "reason": str(item.get("reason") or "").strip()}
    one = data.get("one") if isinstance(data.get("one"), dict) else {}
    one_index = _index(one.get("id"), count)
    return {
        "courses": out,
        "one": {"index": one_index, "reason": str(one.get("reason") or "").strip()} if one_index is not None else None,
        "advice": str(data.get("advice") or "").strip(),
    }


def parse_pairing(payload: dict[str, Any], count: int) -> dict[str, Any]:
    """{"picks": [{"index", "reason"}], "advice"} with ids checked against the list."""
    data = _json_from(payload)
    picks, seen = [], set()
    for item in (data.get("picks") or []) if isinstance(data, dict) else []:
        try:
            index = int(item.get("id"))
        except (TypeError, ValueError, AttributeError):
            continue
        if 0 <= index < count and index not in seen:
            seen.add(index)
            picks.append({"index": index, "reason": str(item.get("reason") or "").strip()})
    advice = str(data.get("advice") or "").strip() if isinstance(data, dict) else ""
    return {"picks": picks[:3], "advice": advice}


class AIError(Exception):
    """Something the user should read (in Italian)."""


class ModelNotFound(AIError):
    """The configured model does not exist (any more) for this key."""


class ModelBusy(AIError):
    """Google is overloaded or too slow right now (503/500/timeout)."""


_RETIRED = ("no longer available", "is not found", "not found for api version", "has been deprecated",
            "is deprecated", "not supported for generatecontent", "please update your code to use")


def model_retired(message: str) -> bool:
    """True when Google says the model was retired or is unknown (whatever the HTTP status)."""
    m = (message or "").lower()
    return any(token in m for token in _RETIRED)


_SKIP = ("image", "tts", "live", "audio", "embed", "robotics", "computer", "exp", "learnlm", "gemma", "nano")


def choose_model(models: list[dict[str, Any]], lite: bool = False) -> str | None:
    """Best general-purpose Flash model from a models.list answer.

    Stable before preview, then full Flash before Flash-Lite (or the other way
    round with ``lite``), newest version first.
    """
    best: tuple | None = None
    choice = None
    for m in models:
        name = str(m.get("name", "")).removeprefix("models/")
        if not name.startswith("gemini-") or "flash" not in name:
            continue
        if "generateContent" not in (m.get("supportedGenerationMethods") or []):
            continue
        if any(token in name for token in _SKIP):
            continue
        version = re.search(r"gemini-(\d+(?:\.\d+)?)", name)
        rank = (
            "preview" not in name and "latest" not in name,
            ("lite" in name) == lite,
            float(version.group(1)) if version else 0.0,
            -len(name),
        )
        if best is None or rank > best:
            best, choice = rank, name
    return choice


async def async_pick_model(session, api_key: str, lite: bool = False) -> str | None:
    """Ask Google which models this key can use and pick the best Flash."""
    import aiohttp

    try:
        async with session.get(
            f"{API}?pageSize=200", headers={"x-goog-api-key": api_key},
            timeout=aiohttp.ClientTimeout(total=15),
        ) as resp:
            if resp.status != 200:
                return None
            payload = await resp.json(content_type=None)
    except (TimeoutError, aiohttp.ClientError):
        return None
    return choose_model(payload.get("models") or [], lite)


def _strip_data_url(image: str) -> tuple[str, str]:
    if image.startswith("data:"):
        head, _, data = image.partition(",")
        mime = head[5:].split(";")[0] or "image/jpeg"
        return mime, data
    return "image/jpeg", image


_resolved: dict[str, str] = {}


async def async_generate(session, api_key: str, model: str, prompt: str, images: list[str] | None = None,
                         parse=None) -> dict[str, Any]:
    """Call Gemini; if the model is gone, switch to the best available Flash."""
    model = _resolved.get(model or DEFAULT_MODEL, model or DEFAULT_MODEL)
    try:
        return await _async_call(session, api_key, model, prompt, images, parse)
    except ModelNotFound:
        replacement = await async_pick_model(session, api_key)
        if not replacement or replacement == model:
            raise
        _resolved[model] = replacement
        return await _async_call(session, api_key, replacement, prompt, images, parse)
    except ModelBusy:
        # The free tier is often the first to be throttled on the big model;
        # Flash-Lite is lighter, quicker and reads labels just as well.
        lite = await async_pick_model(session, api_key, lite=True) or "gemini-flash-lite-latest"
        if lite == model:
            raise
        return await _async_call(session, api_key, lite, prompt, images, parse)


async def _async_call(session, api_key: str, model: str, prompt: str, images: list[str] | None,
                      parse=None, thinking: bool = True) -> dict[str, Any]:
    import aiohttp

    parts: list[dict[str, Any]] = []
    for image in images or []:
        mime, data = _strip_data_url(image)
        parts.append({"inline_data": {"mime_type": mime, "data": data}})
    parts.append({"text": prompt})
    config: dict[str, Any] = {"temperature": 0.2, "responseMimeType": "application/json"}
    if thinking and (tc := thinking_config(model)):
        config["thinkingConfig"] = tc
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": config}
    url = f"{API}/{model}:generateContent"
    try:
        async with session.post(
            url, json=body, headers={"x-goog-api-key": api_key},
            timeout=aiohttp.ClientTimeout(total=TIMEOUT),
        ) as resp:
            payload = await resp.json(content_type=None)
            if resp.status != 200:
                message = ((payload or {}).get("error") or {}).get("message", "")
                if resp.status == 400 and "thinking" in message.lower() and "thinkingConfig" in config:
                    # questo modello non accetta il livello di ragionamento: si riprova senza
                    return await _async_call(session, api_key, model, prompt, images, parse, thinking=False)
                if resp.status == 404 or model_retired(message):
                    raise ModelNotFound(f"Il modello \"{model}\" non è più disponibile e non ne ho trovato un altro: "
                                        "controlla il modello nelle opzioni di Tapon.")
                if resp.status in (401, 403) or "API key" in message:
                    raise AIError("La chiave Gemini non è valida. Controllala nelle opzioni di Tapon.")
                if resp.status in (500, 502, 503, 504):
                    raise ModelBusy("Gemini è sovraccarico in questo momento: riprova tra qualche minuto.")
                if resp.status == 429:
                    raise AIError("Limite gratuito di Gemini raggiunto per ora: riprova più tardi.")
                raise AIError(f"Gemini ha risposto con un errore ({resp.status}): {message[:200]}")
    except TimeoutError as err:
        raise ModelBusy("Gemini non ha risposto in tempo: riprova tra qualche minuto.") from err
    except aiohttp.ClientError as err:
        raise AIError(f"Impossibile contattare Gemini: {err}") from err
    return (parse or parse_response)(payload)


async def async_check_key(session, api_key: str, model: str) -> str | None:
    """None if the key works, otherwise an error code for the options form."""
    import aiohttp

    try:
        async with session.get(
            f"{API}?pageSize=200", headers={"x-goog-api-key": api_key},
            timeout=aiohttp.ClientTimeout(total=15),
        ) as resp:
            if resp.status != 200:
                return "invalid_key"
            payload = await resp.json(content_type=None)
    except (TimeoutError, aiohttp.ClientError):
        return "cannot_connect"
    names = {str(m.get("name", "")).removeprefix("models/") for m in payload.get("models") or []}
    wanted = (model or DEFAULT_MODEL).strip()
    if wanted.endswith("-latest") or wanted in names:
        return None
    return "bad_model"

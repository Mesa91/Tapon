"""Bottle labels: QR as SVG (for the card) and a printable 50 × 30 mm PNG.

The PNG is 400 × 240 px (50 × 30 mm at 203 dpi, the usual small thermal
label). It is written to ``<config>/tapon_labels/<code>.png`` so printer
integrations that take an image path can use it.

Blocking: call these from an executor.
"""

from __future__ import annotations

import io
from pathlib import Path

from .logic import qr_payload_for

LABEL_DIR = "tapon_labels"
WIDTH, HEIGHT = 400, 240

# Label formats: (width mm, height mm). "qr" is a small square with only the
# QR (and the short code under it, in case the QR gets scuffed); "full" adds
# name, vintage, type, producer and position.
FORMATS = {"qr": (23, 23), "qr30": (30, 30), "full": (50, 30)}
DEFAULT_FORMAT = "qr"
QR_PX = 272  # 23 mm at 300 dpi


def qr_svg(code: str) -> str:
    import segno

    buf = io.BytesIO()
    segno.make(qr_payload_for(code), error="m").save(
        buf, kind="svg", scale=4, border=2, xmldecl=False, svgns=True, dark="#000", light="#fff"
    )
    return buf.getvalue().decode("utf-8")


def _font(size: int):
    from PIL import ImageFont

    for name in ("DejaVuSans-Bold.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:  # Pillow < 10.1
        return ImageFont.load_default()


def _wrap(draw, text: str, font, width: int, max_lines: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for word in text.split():
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=font) <= width:
            current = trial
            continue
        if current:
            lines.append(current)
        current = word
        if len(lines) == max_lines:
            break
    if current and len(lines) < max_lines:
        lines.append(current)
    if lines and " ".join(lines) != " ".join(text.split()):
        last = lines[-1]
        while last and draw.textlength(last + "…", font=font) > width:
            last = last[:-1]
        lines[-1] = last.rstrip() + "…"
    return lines


def render_png(code: str, lines: list[str]) -> bytes:
    """QR on the left, text on the right, black and white."""
    import segno
    from PIL import Image, ImageDraw

    label = Image.new("1", (WIDTH, HEIGHT), 1)
    buf = io.BytesIO()
    segno.make(qr_payload_for(code), error="m").save(buf, kind="png", scale=1, border=0)
    qr = Image.open(io.BytesIO(buf.getvalue())).convert("1")
    scale = max(1, 168 // qr.width)  # ~21 mm: comfortable for a phone camera
    qr = qr.resize((qr.width * scale, qr.height * scale), Image.NEAREST)
    label.paste(qr, (12, (HEIGHT - qr.height) // 2))

    draw = ImageDraw.Draw(label)
    x = 12 + qr.width + 14
    width = WIDTH - x - 8
    y = 18
    title = _font(26)
    for line in _wrap(draw, lines[0] if lines else "", title, width, 3):
        draw.text((x, y), line, font=title, fill=0)
        y += 29
    y += 6
    small = _font(19)
    for text in lines[1:]:
        for part in _wrap(draw, text, small, width, 2):
            if y > HEIGHT - 24:
                break
            draw.text((x, y), part, font=small, fill=0)
            y += 22
    draw.text((x, HEIGHT - 22), code, font=_font(16), fill=0)

    out = io.BytesIO()
    label.save(out, format="PNG")
    return out.getvalue()


def render_qr_only(code: str) -> bytes:
    """Square label: the QR with the short code underneath."""
    import segno
    from PIL import Image, ImageDraw

    label = Image.new("1", (QR_PX, QR_PX), 1)
    buf = io.BytesIO()
    segno.make(qr_payload_for(code), error="m").save(buf, kind="png", scale=1, border=0)
    qr = Image.open(io.BytesIO(buf.getvalue())).convert("1")
    scale = max(1, (QR_PX - 52) // qr.width)
    qr = qr.resize((qr.width * scale, qr.height * scale), Image.NEAREST)
    label.paste(qr, ((QR_PX - qr.width) // 2, 10))
    draw = ImageDraw.Draw(label)
    font = _font(22)
    width = draw.textlength(code, font=font)
    draw.text(((QR_PX - width) / 2, QR_PX - 34), code, font=font, fill=0)
    out = io.BytesIO()
    label.save(out, format="PNG")
    return out.getvalue()


def render(code: str, lines: list[str], fmt: str = DEFAULT_FORMAT) -> bytes:
    return render_png(code, lines) if fmt == "full" else render_qr_only(code)


def niimbot_payload(code: str, lines: list[str], fmt: str) -> dict:
    """Data for the ``niimbot.print`` service (B1: 203 dpi, 8 dots per mm)."""
    width_mm, height_mm = FORMATS.get(fmt, FORMATS["qr30"])
    width, height = width_mm * 8, height_mm * 8
    payload: list[dict] = []
    if fmt == "full":
        side = height - 40
        payload.append({"type": "qrcode", "data": qr_payload_for(code), "x": 10, "y": 20, "width": side, "height": side})
        x = side + 24
        sizes = [26, 20, 20, 18]
        y = 22
        for i, text in enumerate(lines[:4]):
            payload.append({"type": "text", "value": text[:24], "x": x, "y": y, "size": sizes[i]})
            y += sizes[i] + 10
        payload.append({"type": "text", "value": code, "x": x, "y": height - 30, "size": 16})
    else:
        side = height - 46
        payload.append({"type": "qrcode", "data": qr_payload_for(code), "x": (width - side) // 2, "y": 8,
                        "width": side, "height": side})
        payload.append({"type": "text", "value": code, "x": width // 2 - len(code) * 5, "y": height - 34, "size": 18})
    return {"payload": payload, "width": width, "height": height}


def write_png(config_dir: str, code: str, lines: list[str], fmt: str = DEFAULT_FORMAT) -> str:
    folder = Path(config_dir) / LABEL_DIR
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{code}.png"
    path.write_bytes(render(code, lines, fmt))
    return str(path)

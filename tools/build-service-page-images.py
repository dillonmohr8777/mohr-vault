from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance
import json

ROOT = Path(r"C:/Users/DillonMohr/OneDrive - Align HCM/Desktop/Codex/handoffs/mohr-vault-zen-spa-c8nk6a")
DOWNLOADS = Path(r"C:/Users/DillonMohr/Downloads")
OUT = ROOT / "assets" / "service-pages"
OUT.mkdir(parents=True, exist_ok=True)

SIZE = (1600, 900)

ITEMS = [
    ("massages", "/massages", "Massage", "CDnXQ.jpg"),
    ("facials", "/facials", "Medical Grade Facials", "uLZF9.jpg"),
    ("head-spa", "/head-spa", "Head Spa", "ed50i.jpg"),
    ("waxing", "/waxing", "Waxing", "mM05O.jpg"),
    ("foot-soaks", "/foot-soaks", "Foot Soaks", "N9Spm.jpg"),
    ("makeup", "/makeup", "Makeup", "tiGG0.jpg"),
    ("lashes-brows", "/lashes-brows", "Lashes and Brows", "RRKwD.jpg"),
    ("tea-lounge", "/day-pass", "Tea Lounge Experience", "evcj8.jpg"),
    ("couples-treatments", "/couples-treatments", "Couples Treatments", "PlSl0 (1).jpg"),
    ("body-treatments", "/body-treatments", "Body Wraps and Scrubs", "dmdNf.jpg"),
]


def cover_resize(img, size):
    w, h = img.size
    tw, th = size
    scale = max(tw / w, th / h)
    nw, nh = int(w * scale), int(h * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def contain_resize(img, max_size):
    w, h = img.size
    mw, mh = max_size
    scale = min(mw / w, mh / h)
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def make_hero(src, dest):
    img = Image.open(src).convert("RGB")
    bg = cover_resize(img, SIZE)
    bg = bg.filter(ImageFilter.GaussianBlur(18))
    bg = ImageEnhance.Color(bg).enhance(0.95)
    bg = ImageEnhance.Contrast(bg).enhance(0.92)
    bg = ImageEnhance.Brightness(bg).enhance(0.82)

    fg = contain_resize(img, (1180, 900))
    canvas = bg.copy()
    x = (SIZE[0] - fg.size[0]) // 2
    y = (SIZE[1] - fg.size[1]) // 2
    canvas.paste(fg, (x, y))

    # ponytail: fixed navy vignette, replace with art-directed crops only if the editor wants text overlay on every image.
    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    px = overlay.load()
    for ix in range(SIZE[0]):
        strength = max(0, 95 - int(ix / SIZE[0] * 150))
        for iy in range(SIZE[1]):
            edge = max(0, int((abs(iy - SIZE[1] / 2) / (SIZE[1] / 2)) * 30) - 15)
            px[ix, iy] = (13, 31, 59, min(105, strength + edge))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    canvas.save(dest, "JPEG", quality=88, optimize=True, progressive=True)


manifest = []
for slug, route, title, filename in ITEMS:
    src = DOWNLOADS / filename
    if not src.exists():
        raise FileNotFoundError(src)
    out = OUT / f"{slug}-hero.jpg"
    make_hero(src, out)
    manifest.append({
        "route": route,
        "title": title,
        "source": str(src),
        "file": f"assets/service-pages/{out.name}",
        "recommended_use": "service page hero image",
        "notes": "Generated from Dillon-approved source photo; no text/logos/CBD added.",
    })

(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

md = ["# Zen Spa Service Page Image Pack", "", "Generated from Dillon-approved source photos for service page hero slots.", ""]
for item in manifest:
    md.append(f"- `{item['route']}` — {item['title']}: `{item['file']}`")
md.append("")
md.append("Use these as native Squarespace image/media assets. Do not use them for CBD-related services.")
(ROOT / "CODEX_SERVICE_PAGE_IMAGES.md").write_text("\n".join(md), encoding="utf-8")

print(json.dumps(manifest, indent=2))

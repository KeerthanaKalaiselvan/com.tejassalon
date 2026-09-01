#!/usr/bin/env python3
"""
Prepare the real Tejas Salon photos for the site.

Drop the originals into frontend/scripts/photo-src/ named src-1 ... src-7
(any of .jpg/.jpeg/.png/.webp), matching the order they were shared:

  src-1  warm/orange-lit styling room with the round mirror
  src-2  team group photo, casual clothes
  src-3  bright grey-and-black salon corridor with the sofa
  src-4  team group photo, black scrubs  (has a "Google Maps" strip to remove)
  src-5  guest lounge with the wall art
  src-6  "TEJAS HAIR & MAKEUP STUDIO" storefront
  src-7  "TEJAS SKIN & BEAUTY SALON" lit storefront ("Photo - Jul 2026" tag to remove)

Then:  python3 scripts/process-photos.py
Outputs land in frontend/public/images/ as .webp (+ .jpg fallback).
"""

import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "scripts" / "photo-src"
OUT_DIR = ROOT / "public" / "images"
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP")

# ---------------------------------------------------------------- adjustments


def trim(im, top=0.0, bottom=0.0, left=0.0, right=0.0):
    """Crop away a fraction of each edge — used to cut watermarks off."""
    w, h = im.size
    return im.crop(
        (int(w * left), int(h * top), int(w * (1 - right)), int(h * (1 - bottom)))
    )


def white_balance(im, strength=1.0):
    """Gray-world balance: neutralise a colour cast (the tungsten orange)."""
    if strength <= 0:
        return im
    im = im.convert("RGB")
    means = [max(m, 1.0) for m in ImageStat.Stat(im).mean]
    target = sum(means) / 3.0
    out = []
    for ch, mean in zip(im.split(), means):
        gain = 1.0 + (target / mean - 1.0) * strength
        out.append(ch.point(lambda v, g=gain: min(255, int(v * g))))
    return Image.merge("RGB", out)


def stretch(im, low=0.5, high=99.6, strength=1.0):
    """Mild percentile contrast stretch — lifts flat phone-camera exposure."""
    if strength <= 0:
        return im
    out = []
    for ch in im.convert("RGB").split():
        hist = ch.histogram()
        total = sum(hist)
        lo_target, hi_target = total * low / 100.0, total * high / 100.0
        acc, lo, hi = 0, 0, 255
        for v, count in enumerate(hist):
            acc += count
            if acc <= lo_target:
                lo = v
            if acc <= hi_target:
                hi = v
        if hi <= lo:
            out.append(ch)
            continue
        scale = 255.0 / (hi - lo)

        def remap(v, lo=lo, scale=scale, s=strength):
            adj = (v - lo) * scale
            return max(0, min(255, int(v + (adj - v) * s)))

        out.append(ch.point(remap))
    return Image.merge("RGB", out)


def fit(im, w, h, focus=0.5, max_upscale=1.0, ybias=0.42):
    """Cover-crop to an aspect ratio, never enlarging past `max_upscale`.

    Sources here are screenshots, so upscaling to a nominal target just makes
    a soft, heavier file. If the source cannot fill the target, the target is
    scaled down proportionally instead — same shape, honest sharpness.
    """
    sw, sh = im.size
    scale = max(w / sw, h / sh)
    if scale > max_upscale:
        shrink = max_upscale / scale
        w, h = max(1, round(w * shrink)), max(1, round(h * shrink))
        scale = max_upscale
    im = im.resize((max(1, round(sw * scale)), max(1, round(sh * scale))), Image.LANCZOS)
    sw, sh = im.size
    x = max(0, int((sw - w) * focus))
    y = max(0, int((sh - h) * ybias))  # bias above centre — keeps heads/signage in
    return im.crop((x, y, x + w, y + h))


def save(im, name):
    im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=58, threshold=3))
    im = ImageEnhance.Color(im).enhance(1.04)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im.save(OUT_DIR / f"{name}.webp", "WEBP", quality=86, method=6)
    im.save(OUT_DIR / f"{name}.jpg", "JPEG", quality=88, optimize=True, progressive=True)
    kb = (OUT_DIR / f"{name}.webp").stat().st_size / 1024
    print(f"  {name}.webp  {im.size[0]}x{im.size[1]}  {kb:.0f} KB")


# ------------------------------------------------------------------- recipes
# Per-photo fixes, decided from the originals. crop= strips watermarks,
# wb= how hard to pull the colour cast out, ex= contrast lift.
RECIPES = {
    1: dict(crop={}, wb=0.35, ex=0.45),            # tungsten cast; >0.5 turns the greys pink
    2: dict(crop={}, wb=0.30, ex=0.35),
    3: dict(crop={}, wb=0.25, ex=0.30),
    4: dict(crop=dict(bottom=0.045), wb=0.30, ex=0.35),  # cut "Google Maps"
    5: dict(crop={}, wb=0.25, ex=0.30),
    6: dict(crop={}, wb=0.20, ex=0.40),
    7: dict(crop=dict(top=0.055), wb=0.20, ex=0.35),     # cut "Photo - Jul 2026"
}

# Where each photo ends up. (source, output name, width, height, focus)
TARGETS = [
    # (source, output name, width, height, horizontal focus 0=left 1=right)
    (3, "hero-banner",  2400, 1350, 0.55),   # brightest, widest room -> hero
    (2, "about-story",  1400, 1120, 0.50),   # the team, casual -> story panel
    (4, "team-group",   1500, 1000, 0.50),   # the team, scrubs -> team banner
    (3, "gallery-1",     900,  900, 0.60),   # styling corridor
    (5, "gallery-2",     900,  900, 0.45),   # guest lounge
    (1, "gallery-3",     900,  900, 0.42),   # warm styling room
    (7, "gallery-4",     900,  900, 0.05),   # lit storefront — keep "TEJAS" whole
    (6, "gallery-5",     900,  900, 0.50),   # hair & makeup storefront
    (3, "login-gate",   1400, 1750, 0.55),
]

# Every photo is used once, except the corridor shot (3) — the only frame wide
# and bright enough for the hero, and its gallery/login crops differ enough not
# to read as a repeat.
#
# No individual stylist portraits: in the group photo the back row is occluded
# by the front row, so single-person crops always catch a second face. The
# group runs as one banner instead.


def load(n):
    for ext in EXTS:
        p = SRC_DIR / f"src-{n}{ext}"
        if p.exists():
            return Image.open(p)
    return None


def main():
    prepped, missing = {}, []
    for n, r in RECIPES.items():
        im = load(n)
        if im is None:
            missing.append(n)
            continue
        im = im.convert("RGB")
        if r["crop"]:
            im = trim(im, **r["crop"])
        prepped[n] = stretch(white_balance(im, r["wb"]), strength=r["ex"])

    if missing:
        print(f"Missing from {SRC_DIR}: " + ", ".join(f"src-{n}" for n in missing))
    if not prepped:
        print("Nothing to process — drop the originals in and re-run.")
        return 1

    print("Writing to public/images/ ...")
    for src, name, w, h, focus in TARGETS:
        if src in prepped:
            save(fit(prepped[src], w, h, focus), name)

    print("\nDone. Photos are .webp with a .jpg fallback.")
    print("Sizes may be under the nominal target — sources are screenshots and")
    print("are never upscaled. Full-resolution originals would render sharper.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

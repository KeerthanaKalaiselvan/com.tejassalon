# Drop the original salon photos here

Name them `src-1` … `src-7` (`.jpg`, `.jpeg`, `.png` or `.webp`), in this order:

| file    | photo                                                        |
|---------|--------------------------------------------------------------|
| `src-1` | warm/orange-lit styling room with the round mirror            |
| `src-2` | team group photo, casual clothes                              |
| `src-3` | bright grey-and-black salon corridor with the sofa            |
| `src-4` | team group photo, black scrubs (has a "Google Maps" strip)     |
| `src-5` | guest lounge with the wall art                                 |
| `src-6` | "TEJAS HAIR & MAKEUP STUDIO" storefront                        |
| `src-7` | lit "TEJAS SKIN & BEAUTY SALON" storefront ("Photo - Jul 2026") |

Then from `frontend/`:

    python3 scripts/process-photos.py

Originals stay untouched — this folder is inputs only.

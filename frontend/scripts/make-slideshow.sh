#!/usr/bin/env bash
# Builds a Ken Burns-style slideshow video from every image in
# frontend/public/images/uploads, in filename order.
# Usage: scripts/make-slideshow.sh [output-name]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/../public/images/uploads"
OUT_DIR="$SCRIPT_DIR/../public/videos"
OUT_NAME="${1:-hero-reel}"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg is not installed. Run: brew install ffmpeg"; exit 1; }

mkdir -p "$OUT_DIR"

mapfile -t RAW_IMAGES < <(find "$SRC_DIR" -maxdepth 1 -type f \
  \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" -o -iname "*.heic" \) \
  | sort)

if [ "${#RAW_IMAGES[@]}" -eq 0 ]; then
  echo "No images found in $SRC_DIR — drop your photos there first."
  exit 1
fi

# Convert any HEIC (common on iPhone) to JPEG so ffmpeg can read them.
IMAGES=()
for src in "${RAW_IMAGES[@]}"; do
  case "$src" in
    *.heic|*.HEIC)
      base="$(basename "${src%.*}")"
      converted="$WORK_DIR/$base.jpg"
      sips -s format jpeg "$src" --out "$converted" >/dev/null
      IMAGES+=("$converted")
      ;;
    *)
      IMAGES+=("$src")
      ;;
  esac
done

N=${#IMAGES[@]}
WIDTH=1920
HEIGHT=1080
FPS=25
SLIDE_SECONDS=3
XFADE_SECONDS=1
FRAMES=$((SLIDE_SECONDS * FPS))

echo "Building a ${N}-photo slideshow (~$((N * SLIDE_SECONDS - (N - 1) * XFADE_SECONDS))s)..."

INPUT_ARGS=()
FILTER=""
for i in "${!IMAGES[@]}"; do
  INPUT_ARGS+=(-loop 1 -i "${IMAGES[$i]}")
  # Alternate zoom-in / zoom-out per slide for a bit of visual variety.
  if [ $((i % 2)) -eq 0 ]; then
    ZOOM_EXPR="min(zoom+0.0015,1.15)"
  else
    ZOOM_EXPR="if(eq(on,1),1.15,max(zoom-0.0015,1.0))"
  fi
  FILTER+="[$i:v]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT},zoompan=z='${ZOOM_EXPR}':d=${FRAMES}:s=${WIDTH}x${HEIGHT}:fps=${FPS},trim=duration=${SLIDE_SECONDS},settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p[v$i];"
done

PREV="v0"
OFFSET=$((SLIDE_SECONDS - XFADE_SECONDS))
CHAIN=""
for ((i = 1; i < N; i++)); do
  NEXT="vx$i"
  CHAIN+="[$PREV][v$i]xfade=transition=fade:duration=${XFADE_SECONDS}:offset=${OFFSET}[$NEXT];"
  PREV="$NEXT"
  OFFSET=$((OFFSET + SLIDE_SECONDS - XFADE_SECONDS))
done

# Single image: no xfade chain needed.
if [ "$N" -eq 1 ]; then
  MAP="[v0]"
else
  FILTER+="$CHAIN"
  MAP="[$PREV]"
fi

ffmpeg -y "${INPUT_ARGS[@]}" \
  -filter_complex "$FILTER" \
  -map "$MAP" \
  -movflags +faststart -pix_fmt yuv420p -c:v libx264 -crf 23 -preset medium -r "$FPS" \
  "$OUT_DIR/$OUT_NAME.mp4"

# Poster frame for the <video poster> fallback.
ffmpeg -y -i "$OUT_DIR/$OUT_NAME.mp4" -frames:v 1 "$OUT_DIR/$OUT_NAME-poster.jpg" >/dev/null 2>&1

echo "Done: $OUT_DIR/$OUT_NAME.mp4"
ls -lh "$OUT_DIR/$OUT_NAME.mp4"

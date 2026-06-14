#!/bin/bash
set -e

echo "=========================================="
echo "  REMOTION + AUDIO VIDEO RENDERER"
echo "=========================================="
echo ""

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$PROJECT_DIR/output"
DEPLOY_DIR="/var/www/play.star7gaurav.in"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "▶ Step 1: Generate scene-specific Hindi audio"
echo ""
cd "$PROJECT_DIR"
node scripts/generate-audio.js

echo ""
echo "▶ Step 2: Render Remotion video composition"
echo ""

# Use npx to run remotion locally (no global install needed)
npx remotion render src/SolarEnergyVideo.tsx SolarEnergy "$OUTPUT_DIR/video.mp4" \
  --width=1920 \
  --height=1080 \
  --props='{"quality":"high"}' \
  2>&1 | tail -20

VIDEO_FILE="$OUTPUT_DIR/video.mp4"
if [ ! -f "$VIDEO_FILE" ]; then
  echo "✗ Video rendering failed"
  exit 1
fi

AUDIO_CONFIG="$OUTPUT_DIR/audio-config.json"
if [ ! -f "$AUDIO_CONFIG" ]; then
  echo "✗ Audio config not found"
  exit 1
fi

echo ""
echo "✓ Video rendered: $VIDEO_FILE"
echo ""
echo "▶ Step 3: Merge video with multi-scene audio"
echo ""

# Create audio concat file for ffmpeg
CONCAT_AUDIO="$OUTPUT_DIR/concat_audio.txt"
> "$CONCAT_AUDIO"

# Read audio config and concatenate audio files
python3 << 'PYTHON'
import json

with open(''"$AUDIO_CONFIG"'') as f:
    config = json.load(f)

audio_files = []
for scene in config['scenes']:
    audio_file = f'"$OUTPUT_DIR"/{scene["audioFile"]}'
    audio_files.append(audio_file)

# Create single merged audio from all scene audios
concat_list = "'"$OUTPUT_DIR"'/audio_list.txt"
with open(concat_list, 'w') as f:
    for audio_file in audio_files:
        f.write(f"file '{audio_file}'\n")

print(f"Audio files: {len(audio_files)}")
print(f"Concat list: {concat_list}")
PYTHON

# Merge all audio segments into one
ffmpeg -y -f concat -safe 0 -i "$OUTPUT_DIR/audio_list.txt" -acodec aac -q:a 5 "$OUTPUT_DIR/full_audio.aac" 2>&1 | tail -3

echo ""
echo "▶ Step 4: Merge video + full audio track"
echo ""

ffmpeg -y \
  -i "$VIDEO_FILE" \
  -i "$OUTPUT_DIR/full_audio.aac" \
  -c:v copy \
  -c:a aac \
  -map 0:v:0 \
  -map 1:a:0 \
  -shortest \
  "$OUTPUT_DIR/solar-final.mp4" 2>&1 | tail -3

echo ""
echo "✓ Final video ready: $OUTPUT_DIR/solar-final.mp4"
ls -lh "$OUTPUT_DIR/solar-final.mp4"

echo ""
echo "▶ Step 5: Deploy to web"
echo ""

if [ -d "$DEPLOY_DIR" ]; then
  sudo cp "$OUTPUT_DIR/solar-final.mp4" "$DEPLOY_DIR/solar-pro.mp4"
  sudo chmod 644 "$DEPLOY_DIR/solar-pro.mp4"
  echo "✓ Deployed to: $DEPLOY_DIR/solar-pro.mp4"
  ls -lh "$DEPLOY_DIR/"
else
  echo "⚠ Deploy directory not found: $DEPLOY_DIR"
fi

echo ""
echo "=========================================="
echo "  ✓ COMPLETE!"
echo "=========================================="
echo ""
echo "View at: https://play.star7gaurav.in"
echo ""

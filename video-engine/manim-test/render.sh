#!/bin/bash
set -e
cd /home/ubuntu/manim-test

VENV="./venv/bin/manim"
TOTAL_START=$(date +%s%N)
MEDIA_DIR="media/videos/scenes/1080p60"

echo "======================================"
echo " MANIM RENDER TEST — $(date)"
echo "======================================"
echo ""

scenes=("TitleScene" "ComparisonScene" "FormulaScene" "CounterScene" "OutroScene")

for scene in "${scenes[@]}"; do
    echo "▶ Rendering $scene ..."
    t_start=$(date +%s%N)
    $VENV scenes.py "$scene" -qh --output_file "${scene}.mp4" 2>&1 | grep -E "(Animation|Rendered|error|Error)" | head -5
    t_end=$(date +%s%N)
    elapsed=$(( (t_end - t_start) / 1000000 ))
    echo "   ✓ Done in ${elapsed}ms"
    echo ""
done

echo "▶ Concatenating scenes ..."
cat > /tmp/concat.txt << EOF
file '${MEDIA_DIR}/TitleScene.mp4'
file '${MEDIA_DIR}/ComparisonScene.mp4'
file '${MEDIA_DIR}/FormulaScene.mp4'
file '${MEDIA_DIR}/CounterScene.mp4'
file '${MEDIA_DIR}/OutroScene.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i /tmp/concat.txt -c copy output/final.mp4 2>&1 | tail -3

TOTAL_END=$(date +%s%N)
TOTAL_MS=$(( (TOTAL_END - TOTAL_START) / 1000000 ))

echo ""
echo "======================================"
echo " RENDER COMPLETE"
echo "======================================"
VIDEO_DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 output/final.mp4 2>/dev/null || echo "unknown")
FILE_SIZE=$(du -sh output/final.mp4 | cut -f1)
echo " Total render time : ${TOTAL_MS}ms  ($(( TOTAL_MS / 1000 ))s)"
echo " Video duration    : ${VIDEO_DURATION}s"
echo " File size         : ${FILE_SIZE}"
echo "======================================"

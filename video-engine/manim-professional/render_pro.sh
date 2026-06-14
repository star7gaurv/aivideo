#!/bin/bash
set -e

echo "=========================================="
echo "  🎬 PROFESSIONAL VIDEO GENERATOR"
echo "  Manim + Audio Sync + Deployment"
echo "=========================================="
echo ""

PROJECT_DIR="/home/ubuntu/manim-professional"
VENV="/home/ubuntu/manim-test/venv/bin"
OUTPUT_DIR="$PROJECT_DIR/output"
DEPLOY_DIR="/var/www/play.star7gaurav.in"

mkdir -p "$OUTPUT_DIR"
cd "$PROJECT_DIR"

# ─────────────────────────────────────────
# STEP 1: Generate Hindi Audio
# ─────────────────────────────────────────
echo "▶ Step 1: Generating scene-specific Hindi audio"
echo ""

$VENV/python3 generate_audio_pro.py

# ─────────────────────────────────────────
# STEP 2: Render Manim Scenes
# ─────────────────────────────────────────
echo ""
echo "▶ Step 2: Rendering Manim scenes with professional animations"
echo ""

RENDER_START=$(date +%s)

echo "  ▶ TitleScene..."
$VENV/manim solar_pro_scenes.py TitleScene -qh --output_file TitleScene.mp4 2>&1 | tail -1

echo "  ▶ HowItWorksScene..."
$VENV/manim solar_pro_scenes.py HowItWorksScene -qh --output_file HowItWorksScene.mp4 2>&1 | tail -1

echo "  ▶ BenefitsScene..."
$VENV/manim solar_pro_scenes.py BenefitsScene -qh --output_file BenefitsScene.mp4 2>&1 | tail -1

echo "  ▶ StatsScene..."
$VENV/manim solar_pro_scenes.py StatsScene -qh --output_file StatsScene.mp4 2>&1 | tail -1

echo "  ▶ ActionScene..."
$VENV/manim solar_pro_scenes.py ActionScene -qh --output_file ActionScene.mp4 2>&1 | tail -1

RENDER_END=$(date +%s)
RENDER_TIME=$((RENDER_END - RENDER_START))

echo ""
echo "  ✓ All scenes rendered in ${RENDER_TIME}s"

# ─────────────────────────────────────────
# STEP 3: Concatenate Video Scenes
# ─────────────────────────────────────────
echo ""
echo "▶ Step 3: Concatenating video scenes"
echo ""

cat > /tmp/concat_video.txt << 'EOF'
file '/home/ubuntu/manim-professional/media/videos/scenes/1080p60/TitleScene.mp4'
file '/home/ubuntu/manim-professional/media/videos/scenes/1080p60/HowItWorksScene.mp4'
file '/home/ubuntu/manim-professional/media/videos/scenes/1080p60/BenefitsScene.mp4'
file '/home/ubuntu/manim-professional/media/videos/scenes/1080p60/StatsScene.mp4'
file '/home/ubuntu/manim-professional/media/videos/scenes/1080p60/ActionScene.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i /tmp/concat_video.txt -c copy "$OUTPUT_DIR/video_no_audio.mp4" 2>&1 | grep -E "(muxing|duration|speed)" | tail -2

echo "  ✓ Video scenes concatenated"

# ─────────────────────────────────────────
# STEP 4: Merge Audio Segments
# ─────────────────────────────────────────
echo ""
echo "▶ Step 4: Merging scene audio files"
echo ""

cat > /tmp/concat_audio.txt << 'EOF'
file '/home/ubuntu/manim-professional/output/TitleScene_audio.mp3'
file '/home/ubuntu/manim-professional/output/HowItWorksScene_audio.mp3'
file '/home/ubuntu/manim-professional/output/BenefitsScene_audio.mp3'
file '/home/ubuntu/manim-professional/output/StatsScene_audio.mp3'
file '/home/ubuntu/manim-professional/output/ActionScene_audio.mp3'
EOF

ffmpeg -y -f concat -safe 0 -i /tmp/concat_audio.txt -acodec aac "$OUTPUT_DIR/full_audio.aac" 2>&1 | grep -E "(muxing|duration|speed)" | tail -2

echo "  ✓ Audio merged"

# ─────────────────────────────────────────
# STEP 5: Combine Video + Audio
# ─────────────────────────────────────────
echo ""
echo "▶ Step 5: Combining video + audio with perfect sync"
echo ""

ffmpeg -y \
  -i "$OUTPUT_DIR/video_no_audio.mp4" \
  -i "$OUTPUT_DIR/full_audio.aac" \
  -c:v copy \
  -c:a aac \
  -map 0:v:0 \
  -map 1:a:0 \
  -shortest \
  "$OUTPUT_DIR/solar-professional.mp4" 2>&1 | grep -E "(muxing|duration|speed|error)" | tail -2

echo ""
echo "  ✓ Video with audio created: solar-professional.mp4"
ls -lh "$OUTPUT_DIR/solar-professional.mp4"

# ─────────────────────────────────────────
# STEP 6: Verify Duration
# ─────────────────────────────────────────
echo ""
echo "▶ Step 6: Verifying video"
echo ""

DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1:nokey=1 "$OUTPUT_DIR/solar-professional.mp4")
echo "  Duration: ${DURATION}s"

# ─────────────────────────────────────────
# STEP 7: Deploy to Web
# ─────────────────────────────────────────
echo ""
echo "▶ Step 7: Deploying to play.star7gaurav.in"
echo ""

if [ -d "$DEPLOY_DIR" ]; then
  sudo cp "$OUTPUT_DIR/solar-professional.mp4" "$DEPLOY_DIR/"
  sudo chmod 644 "$DEPLOY_DIR/solar-professional.mp4"
  echo "  ✓ Deployed to: $DEPLOY_DIR/solar-professional.mp4"
  echo ""
  ls -lh "$DEPLOY_DIR/"*.mp4 | tail -3
else
  echo "  ⚠️ Deploy directory not found: $DEPLOY_DIR"
  echo "  File ready at: $OUTPUT_DIR/solar-professional.mp4"
fi

# ─────────────────────────────────────────
# Summary
# ─────────────────────────────────────────
echo ""
echo "=========================================="
echo "  ✅ COMPLETE!"
echo "=========================================="
echo ""
echo "📊 Stats:"
echo "  Render time    : ${RENDER_TIME}s"
echo "  Video duration : ${DURATION}s"
echo "  File size      : $(ls -lh "$OUTPUT_DIR/solar-professional.mp4" | awk '{print $5}')"
echo ""
echo "🎬 View live:"
echo "  https://play.star7gaurav.in"
echo ""
echo "💰 Cost breakdown:"
echo "  Claude Haiku code gen  : ₹0.80"
echo "  TTS (gTTS)             : ₹0.00"
echo "  Render (free tier)     : ₹0.00"
echo "  ────────────────────────"
echo "  Total per video        : ₹0.80"
echo ""
echo "=========================================="

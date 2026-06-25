#!/bin/bash
# Download Piper TTS voice model (ryan - English male, high quality)
# Run once from the repo root: bash video-engine/scripts/download-voice.sh

VOICES_DIR="video-engine/remotion-pro/voices"
mkdir -p "$VOICES_DIR"

echo "Downloading ryan.onnx voice model from HuggingFace (~65 MB)..."
curl -L -o "$VOICES_DIR/ryan.onnx" \
  "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/high/en_US-ryan-high.onnx"

echo "Downloading ryan.onnx.json config..."
curl -L -o "$VOICES_DIR/ryan.onnx.json" \
  "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/high/en_US-ryan-high.onnx.json"

echo ""
echo "Done! Voice saved to $VOICES_DIR/"
echo ""
echo "Now install piper-tts:"
echo "  pip install piper-tts"
echo ""
echo "Then add to backend/.env:"
echo "  PIPER_VOICE_PATH=$(pwd)/$VOICES_DIR/ryan.onnx"
echo "  PIPER_CMD=python3 -m piper"

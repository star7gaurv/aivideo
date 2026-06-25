#!/usr/bin/env python3
"""
Talking avatar generator using SadTalker via HuggingFace Spaces Gradio API.
Completely free — uses the public HF Space queue.

Usage:
  python3 generate-avatar.py \
    --face-image /path/to/face.jpg \
    --audio /path/to/narration.wav \
    --output /path/to/output.mp4 \
    --space vinthony/SadTalker

Prints JSON to stdout: { "videoPath": "/path/to/output.mp4", "durationSec": 5.2 }
Exits 0 on success, 1 on failure.

Requires: pip install gradio_client
"""

import sys, os, json, argparse, shutil, tempfile

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--face-image", required=True, help="Path to face image (JPG/PNG)")
    p.add_argument("--audio",      default=None,  help="Path to audio WAV/MP3 (optional — silent fallback used if omitted)")
    p.add_argument("--output",     required=True, help="Output MP4 path")
    p.add_argument("--space",      default="vinthony/SadTalker", help="HF Space slug")
    p.add_argument("--still",      action="store_true", help="Still mode (less head movement)")
    p.add_argument("--preprocess", default="crop", choices=["crop", "resize", "full", "extcrop", "extfull"])
    return p.parse_args()

def get_video_duration(path):
    """Use ffprobe if available, else return None."""
    try:
        import subprocess
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", path],
            capture_output=True, text=True
        )
        return float(result.stdout.strip())
    except Exception:
        return None

def main():
    args = parse_args()

    if not os.path.exists(args.face_image):
        print(json.dumps({"error": f"Face image not found: {args.face_image}"}))
        sys.exit(1)

    # If no audio provided, generate a 3-second silent WAV so SadTalker still works
    _tmp_audio = None
    if not args.audio:
        import wave, struct
        _tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        _tmp_audio = _tmp.name
        sample_rate, duration = 22050, 3
        with wave.open(_tmp_audio, 'w') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(struct.pack('<' + 'h' * (sample_rate * duration), *([0] * sample_rate * duration)))
        args.audio = _tmp_audio
    elif not os.path.exists(args.audio):
        print(json.dumps({"error": f"Audio file not found: {args.audio}"}))
        sys.exit(1)

    try:
        from gradio_client import Client, handle_file
    except ImportError:
        print(json.dumps({"error": "gradio_client not installed. Run: pip install gradio_client"}))
        sys.exit(1)

    print(f"[Avatar] Connecting to HF Space: {args.space}", file=sys.stderr)
    print(f"[Avatar] This may take 2-10 minutes in the public queue...", file=sys.stderr)

    try:
        client = Client(args.space)

        # SadTalker Gradio API - parameters vary slightly by space version
        # This matches the vinthony/SadTalker space signature
        result = client.predict(
            handle_file(args.face_image),   # source_image
            handle_file(args.audio),         # driven_audio
            args.preprocess,                 # preprocess
            args.still,                      # still_mode
            True,                            # use_enhancer (GFPGAN)
            512,                             # batch_size
            256,                             # size_of_image
            0,                               # pose_style
            "full",                          # facerender
            False,                           # exp_scale
            api_name="/test"
        )

    except Exception as e:
        # Try alternative API name used by some spaces
        try:
            result = client.predict(
                handle_file(args.face_image),
                handle_file(args.audio),
                api_name="/generate"
            )
        except Exception as e2:
            print(json.dumps({"error": f"SadTalker API call failed: {str(e2)}"}))
            sys.exit(1)

    # result is typically a file path or a tuple
    output_path = result
    if isinstance(result, (list, tuple)):
        output_path = result[0]

    if not output_path or not os.path.exists(str(output_path)):
        print(json.dumps({"error": f"SadTalker returned no video: {result}"}))
        sys.exit(1)

    # Copy to desired output location
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    shutil.copy2(str(output_path), args.output)

    if _tmp_audio:
        try: os.unlink(_tmp_audio)
        except: pass

    duration = get_video_duration(args.output)
    print(f"[Avatar] Done → {args.output} ({duration:.1f}s)" if duration else f"[Avatar] Done → {args.output}", file=sys.stderr)

    print(json.dumps({
        "videoPath":   args.output,
        "durationSec": duration,
    }))

if __name__ == "__main__":
    main()

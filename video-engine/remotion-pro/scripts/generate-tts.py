#!/usr/bin/env python3
"""
Generic Piper TTS generator for dashboard projects.

Usage:
  python3 generate-tts.py \
    --scenes-json '[{"id":"scene1","narration":"Hello world"}]' \
    --output-dir /path/to/output \
    --voice /path/to/ryan.onnx \
    --piper python3 -m piper

Writes WAV files to output-dir/{scene_id}.wav
Prints JSON to stdout: { "scenes": [{ "id", "wavPath", "durationSec", "durationInFrames" }], "totalFrames": N }
"""

import os, sys, json, wave, subprocess, argparse, shlex

FPS = 30
PAD = 14  # extra frames of breathing room after each scene

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--scenes-json", required=True, help="JSON string: [{id, narration}]")
    p.add_argument("--output-dir",  required=True)
    p.add_argument("--voice",       required=True, help="Path to .onnx voice model")
    p.add_argument("--piper",       default="python3 -m piper", help="Piper command")
    p.add_argument("--fps",         type=int, default=FPS)
    p.add_argument("--pad",         type=int, default=PAD)
    return p.parse_args()

def wav_duration(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() / w.getframerate()

def main():
    args = parse_args()
    os.makedirs(args.output_dir, exist_ok=True)

    try:
        scenes = json.loads(args.scenes_json)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid scenes JSON: {e}"}), file=sys.stdout)
        sys.exit(1)

    piper_cmd = shlex.split(args.piper) + ["-m", args.voice]
    results   = []
    total     = 0

    for scene in scenes:
        sid       = scene.get("id", "scene")
        narration = scene.get("narration", "").strip()
        wav_path  = os.path.join(args.output_dir, f"{sid}.wav")

        if not narration:
            # Silent placeholder: 2 seconds
            frames = args.fps * 2
            results.append({
                "id":               sid,
                "wavPath":          None,
                "durationSec":      2.0,
                "durationInFrames": frames,
            })
            total += frames
            continue

        result = subprocess.run(
            piper_cmd + ["-f", wav_path],
            input=narration,
            capture_output=True,
            text=True,
        )

        if not os.path.exists(wav_path):
            print(f"[TTS] WARNING: failed for scene '{sid}': {result.stderr[-200:]}", file=sys.stderr)
            frames = args.fps * 3
            results.append({
                "id":               sid,
                "wavPath":          None,
                "durationSec":      3.0,
                "durationInFrames": frames,
                "error":            result.stderr[-100:],
            })
            total += frames
            continue

        dur    = wav_duration(wav_path)
        frames = round(dur * args.fps) + args.pad

        results.append({
            "id":               sid,
            "wavPath":          wav_path,
            "durationSec":      round(dur, 3),
            "durationInFrames": frames,
        })
        total += frames
        print(f"[TTS] {sid}: {dur:.2f}s → {frames} frames", file=sys.stderr)

    output = {"scenes": results, "totalFrames": total, "fps": args.fps}
    print(json.dumps(output))

if __name__ == "__main__":
    main()

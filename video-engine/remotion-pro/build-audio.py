#!/usr/bin/env python3
"""Generate per-scene Hindi narration, measure real durations, write timing.json."""
import os, json, subprocess
from gtts import gTTS

FPS = 30
TRANSITION_PAD = 18  # frames of breathing room per scene for fades/holds

scenes = [
    {
        "id": "hero",
        "narration": "सौर ऊर्जा। सूरज, जो हर सुबह उगता है, उसमें इतनी शक्ति है कि वह पूरी दुनिया को रोशन कर सकता है।",
    },
    {
        "id": "problem",
        "narration": "आज हम कोयला और तेल जलाते हैं। इससे प्रदूषण बढ़ता है, और हमारी धरती दिन-ब-दिन गर्म होती जा रही है।",
    },
    {
        "id": "how",
        "narration": "लेकिन समाधान आसमान में है। सोलर पैनल सूरज की किरणों को पकड़ते हैं। फोटॉन कण सिलिकॉन सेल से टकराते हैं, और साफ़ बिजली पैदा होती है।",
    },
    {
        "id": "benefits",
        "narration": "यह ऊर्जा साफ़ है, कभी ख़त्म नहीं होती, और आपका बिजली बिल भी कम कर देती है।",
    },
    {
        "id": "india",
        "narration": "भारत तेज़ी से आगे बढ़ रहा है। आज 160 गीगावाट, और 2030 तक 500 गीगावाट का बड़ा लक्ष्य।",
    },
    {
        "id": "cta",
        "narration": "भविष्य सूरज से चलेगा। आज ही इस बदलाव का हिस्सा बनो।",
    },
]

os.makedirs("audio", exist_ok=True)

def duration_of(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True
    )
    return float(out.stdout.strip())

timing = {"fps": FPS, "scenes": []}
total_frames = 0

print("🎙️  Generating narration + measuring durations...\n")
for s in scenes:
    mp3 = f"audio/{s['id']}.mp3"
    gTTS(text=s["narration"], lang="hi", slow=False).save(mp3)
    dur = duration_of(mp3)
    frames = round(dur * FPS) + TRANSITION_PAD
    timing["scenes"].append({
        "id": s["id"],
        "audio": f"{s['id']}.mp3",
        "audioDuration": round(dur, 2),
        "durationInFrames": frames,
    })
    total_frames += frames
    print(f"  {s['id']:10} audio {dur:5.2f}s  → {frames:4d} frames")

timing["totalFrames"] = total_frames
with open("src/timing.json", "w") as f:
    json.dump(timing, f, ensure_ascii=False, indent=2)

print(f"\n  Total: {total_frames} frames = {total_frames / FPS:.1f}s")
print("  ✓ src/timing.json written")

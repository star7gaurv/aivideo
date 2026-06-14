#!/usr/bin/env python3
import os, json, subprocess, wave
FPS = 30; PAD = 16
VOICE = "/home/ubuntu/ancient-humans/voices/ryan.onnx"
PIPER = ["/home/ubuntu/manim-test/venv/bin/python3", "-m", "piper", "-m", VOICE]
OUT = "public/dream"; os.makedirs(OUT, exist_ok=True)

scenes = [
    ("title", "Every night, when you close your eyes and drift away, something extraordinary happens. Your body rests, but your mind comes alive."),
    ("question", "You slip into a world of dreams. Strange, vivid, and sometimes impossible. But why do we dream at all?"),
    ("memory", "One idea is that while you sleep, your brain replays the day. It sorts through everything that happened, keeping what matters, and quietly letting the rest fade away."),
    ("creativity", "Dreams may also spark creativity. Free from the rules of waking life, your mind connects ideas in wild new ways, solving problems you could not crack while awake."),
    ("emotion", "And dreams help you heal. They let your mind process fears and feelings in a safe space, so you wake up a little lighter than before."),
    ("mystery", "Yet after thousands of years, dreams remain one of the mind's deepest mysteries. So tonight, drift off, and let your mind wander. Sweet dreams."),
]

def dur(p):
    with wave.open(p, "rb") as w: return w.getnframes()/w.getframerate()

timing = {"fps": FPS, "scenes": []}; total = 0
print("🎙️  Dream narration (Piper)...\n")
for sid, text in scenes:
    wav = f"{OUT}/{sid}.wav"
    subprocess.run(PIPER + ["-f", wav], input=text, capture_output=True, text=True)
    d = dur(wav); fr = round(d*FPS)+PAD
    timing["scenes"].append({"id": sid, "audio": f"dream/{sid}.wav", "durationInFrames": fr})
    total += fr; print(f"  {sid:11} {d:5.2f}s → {fr} frames")
timing["totalFrames"] = total
json.dump(timing, open("src/dream-timing.json","w"), indent=2)
print(f"\n  TOTAL {total} frames = {total/FPS:.1f}s")

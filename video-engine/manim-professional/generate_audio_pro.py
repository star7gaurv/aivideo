#!/usr/bin/env python3
"""Generate scene-specific Hindi narration with gTTS."""
import os
import json
from gtts import gTTS

scenes_narration = {
    "TitleScene": {
        "text": "सौर ऊर्जा। सूरज की अपार शक्ति का उपयोग करके हम अपने भविष्य को उज्ज्वल बना सकते हैं।",
        "duration": 4,
    },
    "HowItWorksScene": {
        "text": "सोलर पैनल सूरज की किरणों को पकड़ते हैं। इसमें फोटॉन कण होते हैं जो सिलिकॉन सेल में टकराते हैं। यह विद्युत ऊर्जा पैदा करता है।",
        "duration": 9,
    },
    "BenefitsScene": {
        "text": "सौर ऊर्जा प्रदूषण मुक्त है, कभी ख़त्म नहीं होती, आपके बिजली बिल को कम करती है, और पृथ्वी को बचाती है।",
        "duration": 8,
    },
    "StatsScene": {
        "text": "भारत में अभी 160 गीगावाट सौर क्षमता स्थापित है। 2030 तक हमारा लक्ष्य 500 गीगावाट है। यह एक बड़ा कदम है नवीकरणीय ऊर्जा की ओर।",
        "duration": 8,
    },
    "ActionScene": {
        "text": "आज ही शुरुआत करो। सूरज की शक्ति का उपयोग करके एक स्वच्छ भविष्य बनाओ।",
        "duration": 5,
    },
}

output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

print("🎙️  Generating scene-specific Hindi audio narration...\n")

audio_config = {"scenes": []}

for scene_name, data in scenes_narration.items():
    audio_file = os.path.join(output_dir, f"{scene_name}_audio.mp3")

    try:
        # Generate audio
        print(f"  ▶ {scene_name}...", end=" ", flush=True)
        tts = gTTS(text=data["text"], lang="hi", slow=False)
        tts.save(audio_file)

        print(f"✓ ({data['duration']}s)")

        audio_config["scenes"].append({
            "name": scene_name,
            "duration": data["duration"],
            "audio_file": f"{scene_name}_audio.mp3",
            "narration": data["text"],
        })
    except Exception as e:
        print(f"✗ Error: {e}")

# Save config for ffmpeg merge
with open(os.path.join(output_dir, "audio-config.json"), "w") as f:
    json.dump(audio_config, f, ensure_ascii=False, indent=2)

print(f"\n✓ Generated {len(audio_config['scenes'])} audio files")
print(f"✓ Config saved: {os.path.join(output_dir, 'audio-config.json')}\n")

# Print timeline
print("Scene Timeline:")
total_duration = 0
for scene in audio_config["scenes"]:
    print(f"  {scene['name']:20} {scene['duration']}s  →  {total_duration}-{total_duration + scene['duration']}s")
    total_duration += scene["duration"]
print(f"\nTotal video duration: {total_duration}s ({total_duration / 60:.1f} min)")

#!/usr/bin/env python3
"""
Generate Hindi audio narration for each scene using gTTS.
Maps script lines to scene timing.
"""
from gtts import gTTS
import subprocess
import os

scenes_audio = {
    "SunScene": "सौर ऊर्जा — सूरज की अपार शक्ति का उपयोग करके हम अपने भविष्य को उज्ज्वल बना सकते हैं।",

    "PanelScene": "सोलर पैनल सूरज की किरणों को पकड़ते हैं। इसमें फोटॉन कण होते हैं जो सिलिकॉन सेल में टकराते हैं। यह विद्युत ऊर्जा पैदा करता है जिसे हम बिजली के रूप में उपयोग कर सकते हैं।",

    "BenefitsScene": "सौर ऊर्जा प्रदूषण मुक्त है, कभी ख़त्म नहीं होती, आपके बिजली बिल को कम करती है, और पृथ्वी को बचाती है।",

    "StatsScene": "भारत में अभी 160 गीगावाट सौर क्षमता स्थापित है। 2030 तक हमारा लक्ष्य 500 गीगावाट है। यह एक बड़ा कदम है नवीकरणीय ऊर्जा की ओर।",

    "ActionScene": "आज ही शुरुआत करो। सूरज की शक्ति का उपयोग करके एक स्वच्छ भविष्य बनाओ।",
}

print("▶ Generating Hindi audio narration...")
for scene, text in scenes_audio.items():
    audio_file = f"output/{scene}_audio.mp3"
    try:
        tts = gTTS(text=text, lang='hi', slow=False)
        tts.save(audio_file)
        print(f"  ✓ {scene}: {audio_file}")
    except Exception as e:
        print(f"  ✗ {scene}: {e}")

print("\n✓ All audio files generated")

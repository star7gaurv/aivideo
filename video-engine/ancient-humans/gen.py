#!/usr/bin/env python3
"""Gemini image-gen pipeline with character consistency via reference-image chaining."""
import os, sys, json, base64, urllib.request, urllib.error

KEY = open("/home/ubuntu/ancient-humans/.env").read().split("=", 1)[1].strip()
MODEL = "gemini-2.5-flash-image"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}"

STYLE = ("Flat 2D cartoon illustration, bold clean black outlines, soft cel shading, "
         "warm earthy color palette, simple expressive cartoon faces, Stone Age prehistoric setting, "
         "wide 16:9 composition, children's-book cartoon style.")

def call(parts):
    body = {"contents": [{"parts": parts}],
            "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}}
    req = urllib.request.Request(URL, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read().decode()[:500]); sys.exit(1)

def extract_image(resp, out):
    for c in resp.get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            if "inlineData" in p:
                open(out, "wb").write(base64.b64decode(p["inlineData"]["data"]))
                return True
    print("NO IMAGE. Response:", json.dumps(resp)[:600])
    return False

def text_to_image(prompt, out):
    print(f"  generating {out} (text)...")
    return extract_image(call([{"text": f"{STYLE}\n\nScene: {prompt}"}]), out)

def image_to_image(ref_path, prompt, out):
    print(f"  generating {out} (from {os.path.basename(ref_path)})...")
    ref_b64 = base64.b64encode(open(ref_path, "rb").read()).decode()
    parts = [
        {"inlineData": {"mimeType": "image/png", "data": ref_b64}},
        {"text": f"Using the EXACT SAME character, art style, colors and outline weight as the "
                 f"reference image, draw a new scene. Keep the character visually identical.\n\n"
                 f"New scene: {prompt}"},
    ]
    return extract_image(call(parts), out)

if __name__ == "__main__":
    os.makedirs("proof", exist_ok=True)
    CHAR = ("A friendly heavyset Stone Age caveman with a thick brown beard, messy hair, "
            "wearing a spotted animal-fur loincloth, barefoot. Full body, standing in a "
            "prehistoric grassland with rocks and a mountain in the background, smiling.")
    # Panel 1: establish character
    if not text_to_image(CHAR, "proof/p1.png"):
        sys.exit(1)
    # Panels 2-4: same character, new actions (chained from p1)
    scenes = [
        ("p2.png", "The same caveman running while hunting, holding a wooden spear, chasing off-screen, determined expression, prehistoric grassland."),
        ("p3.png", "The same caveman sitting by a fire happily eating a huge pile of meat and fruit, cheeks full, delighted expression, night campfire scene."),
        ("p4.png", "The same caveman lying back on a rock with a big round full belly, satisfied and sleepy, bones and empty food bowls around him, daytime."),
    ]
    for out, pr in scenes:
        image_to_image("proof/p1.png", pr, f"proof/{out}")
    print("DONE")

# Video Engine

Code-driven AI video generation — experiments and working pipelines.
Demos live at https://play.star7gaurav.in

## Lanes (what works, and the real cost)

| Lane | Tool | Style | Cost | Automated? |
|------|------|-------|------|-----------|
| **Mascot cartoon** ⭐ | Remotion + SVG | simple recurring mascot (the "Why Do We Dream?" look) | **₹0** | ✅ fully |
| Abstract / data | Manim + Remotion | charts, math, motion-graphics | ₹0 | ✅ fully |
| AI cartoon panels | image API + Remotion | detailed characters (caveman style) | ~₹250/video | ⚠️ semi |
| Kurzgesagt-tier | — | hand-animated studio art | ₹25–40 lakh | ❌ not viable |

The **mascot-cartoon lane is the business**: free, fully automated, perfect character
consistency (it's code), full motion. See `remotion-pro/src/dream/`.

## Structure

- `remotion-pro/` — Remotion (React) project. Compositions registered in `src/Root.tsx`:
  - `src/dream/` — mascot-cartoon film ("The Secret World of Dreams") ⭐
  - `src/ancient/` — illustrated documentary ("Did Ancient Humans Get Fat?")
  - `src/SolarFilm.tsx`, `src/ancient/kit.tsx` — reusable illustration + animation kit
  - `build-*-audio.py` — Piper narration → timing JSON
  - `public/<film>/*.wav` — generated narration (committed so you can render without the voice model)
- `manim-test/`, `manim-solar/`, `manim-professional/` — Manim scenes (math/data lane)
- `ancient-humans/` — Gemini image-gen experiment (`gen.py`) + Piper audio scripts

## Local setup

```bash
# Node / Remotion (renders via headless Chromium)
cd remotion-pro && npm install
npx remotion studio                       # preview in browser
npx remotion render src/index.ts DreamFilm out.mp4

# Python (Manim + Piper TTS)
python3 -m venv venv && source venv/bin/activate
pip install manim piper-tts gtts

# Piper narrator voice (NOT in git — 116 MB). Download once:
mkdir -p ancient-humans/voices && cd ancient-humans/voices
curl -L -o ryan.onnx      https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/high/en_US-ryan-high.onnx
curl -L -o ryan.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/high/en_US-ryan-high.onnx.json
```

## Secrets

`ancient-humans/.env` (gitignored) holds `GEMINI_API_KEY` for the AI-panel experiments.
Create it locally; never commit it.

## Not in git (regenerable / too large)

`node_modules/`, `venv/`, `media/`, `output/`, `*.onnx` voice models, `*.mp4` renders.

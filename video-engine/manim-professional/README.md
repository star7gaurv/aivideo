# Professional AI Video Generator
## Kurzgesagt + After Skool Quality | Manim + Audio Sync + Claude

### Architecture
- **Code**: Claude Haiku generates Manim Python
- **Animation**: Advanced Manim with SVG + smooth transitions
- **Audio**: Scene-specific Hindi narration (gTTS) with precise timing
- **Design**: Kurzgesagt principles (no overlaps, color theory, flow)
- **Deployment**: Deploy to play.star7gaurav.in

### Cost
- **Per video**: ₹1.20 (Haiku code gen + TTS)
- **Monthly (30)**: ₹36
- **Budget remaining**: Always under ₹3/video

### Scenes Structure
Each scene has:
1. Clear layout (no overlapping elements)
2. Animation timeline (synced to audio)
3. Color palette (cohesive, professional)
4. Narration (scene-specific, timed)
5. Transition (smooth morphing)

### Files
- `solar_scenes_pro.py` — Enhanced Manim code (5 scenes, professional)
- `generate_audio_pro.py` — Scene-specific audio generation
- `render_pro.sh` — Full render + audio sync + deploy

### Render
```bash
bash render_pro.sh
```

Creates: `output/solar-professional.mp4` (34s, 1920×1080, with audio)

"""
Resource & cost calculator for the Manim test video.
Run after render.sh completes.
"""
import os, subprocess, json

# ── Claude API cost (what you would pay to generate scenes.py) ──────────────

# Token counts (estimated via character count ÷ 4)
PROMPT = """
I am building a 2-minute Hindi educational video about compound interest
using Manim (Python). The style is Kurzgesagt-like: clean backgrounds,
bold animated text, simple geometric shapes.

Generate a complete Manim Python file with these 5 scenes, total runtime ~120 seconds:
Scene 1 (15s): Title card — "चक्रवृद्धि ब्याज" animates in.
Scene 2 (25s): Simple interest vs compound interest — two bars grow side by side over 10 years.
Scene 3 (30s): The formula A = P(1 + r/n)^nt appears piece by piece with each variable labeled in Hindi.
Scene 4 (35s): A ₹10,000 investment at 10% compounded yearly — animated number counter from year 0 to year 20, showing final value ₹67,275.
Scene 5 (15s): Outro — "जितना जल्दी शुरू करो, उतना ज़्यादा मिलेगा" fades in.

Requirements:
- Use Manim Community Edition (from manim import *)
- Each scene is a separate Scene class
- Use colors: BLUE_D background, WHITE text, YELLOW for highlights
- Hindi text must use Text() not Tex()
- Output target: 1920x1080, 60fps
"""

with open("scenes.py") as f:
    output_code = f.read()

input_tokens  = len(PROMPT) // 4
output_tokens = len(output_code) // 4

OPUS_INPUT_PER_M  = 5.00   # USD
OPUS_OUTPUT_PER_M = 25.00  # USD
INR_RATE          = 83.5   # 1 USD ≈ ₹83.5

claude_cost_usd = (input_tokens / 1_000_000 * OPUS_INPUT_PER_M) + \
                  (output_tokens / 1_000_000 * OPUS_OUTPUT_PER_M)
claude_cost_inr = claude_cost_usd * INR_RATE

# ── Render resource cost ─────────────────────────────────────────────────────
# Oracle Cloud free tier: 2 OCPU + 12GB RAM
# Effective hourly cost on paid Oracle: ~$0.06/OCPU-hour
# We measure render time from render.sh output

try:
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
         "-of", "csv=p=0", "output/final.mp4"],
        capture_output=True, text=True
    )
    video_duration_s = float(result.stdout.strip())
except Exception:
    video_duration_s = 120.0  # assume 2 min if probe fails

try:
    stat = os.stat("output/final.mp4")
    file_size_mb = stat.st_size / (1024 * 1024)
except Exception:
    file_size_mb = 0

ORACLE_COST_PER_HOUR_USD = 0.06  # 2 OCPU paid rate
# Render time must be passed in or read from a file written by render.sh
RENDER_TIME_S = 0
try:
    with open("/tmp/render_time_s.txt") as f:
        RENDER_TIME_S = int(f.read().strip())
except Exception:
    RENDER_TIME_S = 0  # will show 0 if not yet written

render_cost_usd = (RENDER_TIME_S / 3600) * ORACLE_COST_PER_HOUR_USD
render_cost_inr = render_cost_usd * INR_RATE

# ── TTS cost (gTTS = free) ───────────────────────────────────────────────────
tts_cost_usd = 0.00

# ── Summary ──────────────────────────────────────────────────────────────────
total_usd = claude_cost_usd + render_cost_usd + tts_cost_usd
total_inr = total_usd * INR_RATE
budget_inr = 3.00  # your target: ₹3/video

print()
print("=" * 52)
print("  COST REPORT — 2-Minute Manim Hindi Video")
print("=" * 52)
print()
print(f"  Video duration       : {video_duration_s:.1f}s  ({video_duration_s/60:.2f} min)")
print(f"  Output file size     : {file_size_mb:.1f} MB")
print()
print("  ── Claude API (Opus 4.8) ────────────────────")
print(f"  Input tokens         : {input_tokens:,}")
print(f"  Output tokens        : {output_tokens:,}")
print(f"  Claude cost          : ${claude_cost_usd:.5f}  (₹{claude_cost_inr:.3f})")
print()
print("  ── Render Compute (Oracle Cloud) ────────────")
print(f"  Render time          : {RENDER_TIME_S}s")
print(f"  Server rate          : $0.06/hr (paid) | $0.00 (free tier)")
print(f"  Render cost (paid)   : ${render_cost_usd:.5f}  (₹{render_cost_inr:.3f})")
print()
print("  ── TTS (gTTS / Google) ──────────────────────")
print(f"  TTS cost             : $0.00000  (₹0.000)  [free tier]")
print()
print("  ── TOTALS ───────────────────────────────────")
print(f"  Total USD            : ${total_usd:.5f}")
print(f"  Total INR            : ₹{total_inr:.3f}")
print(f"  Your budget/video    : ₹{budget_inr:.2f}")
surplus = budget_inr - total_inr
if surplus > 0:
    print(f"  Budget headroom      : ₹{surplus:.3f}  ✓ VIABLE")
else:
    print(f"  Budget overrun       : ₹{abs(surplus):.3f}  ✗ OVER BUDGET")
print()
# Scale to 15-min video
ratio = 15 / (video_duration_s / 60) if video_duration_s > 0 else 7.5
cost_15min_usd = total_usd * ratio
cost_15min_inr = cost_15min_usd * INR_RATE
print(f"  ── Scaled to 15-min video ───────────────────")
print(f"  Estimated cost       : ${cost_15min_usd:.4f}  (₹{cost_15min_inr:.2f})")
print(f"  Budget               : ₹{budget_inr:.2f}")
if cost_15min_inr <= budget_inr:
    print(f"  Verdict              : ✓ VIABLE AT SCALE")
else:
    print(f"  Verdict              : ✗ ADJUST — see notes below")
print("=" * 52)
print()
print("  NOTES:")
print("  • If render is on free Oracle tier, compute cost = ₹0.00")
print("  • Script generation adds ~200 input + 500 output tokens")
print("    (~₹0.001 extra) — negligible")
print("  • Switch to Sonnet 4.6 for scene code generation:")
print("    saves 40% on both input/output tokens")
print("  • Render time is the dominant variable — check above")
print()

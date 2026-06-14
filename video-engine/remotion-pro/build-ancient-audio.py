#!/usr/bin/env python3
"""Generate English documentary narration with Piper, per scene, and write timing."""
import os, json, subprocess, wave

FPS = 30
PAD = 14  # frames of breathing room per scene
VOICE = "/home/ubuntu/ancient-humans/voices/ryan.onnx"
PIPER = ["/home/ubuntu/manim-test/venv/bin/python3", "-m", "piper", "-m", VOICE]
OUT = "public/ancient"
os.makedirs(OUT, exist_ok=True)

# 25 scenes: id, visual concept (for reference), narration text
scenes = [
    ("discovery", "A strange thing happened about thirty thousand years ago. Somewhere in Europe, a human sat down and carved a small figurine from stone. When archaeologists discovered it thousands of years later, they were surprised by what they saw. The figure wasn't lean. It wasn't muscular. It didn't resemble the image most people have of prehistoric humans at all."),
    ("question", "Instead, it appeared overweight, which raises an uncomfortable question. How could someone carve a body like that if they had never seen one?"),
    ("stereotype", "We tend to imagine ancient humans as permanently fit. People who spent their days hunting animals, gathering plants, and walking across enormous distances. People who lived so close to starvation that gaining significant weight was practically impossible."),
    ("twist", "The idea feels obvious. Yet scattered across archaeology, history, and human biology are clues suggesting the story is not nearly that simple. Because ancient humans could get fat. Some almost certainly did. And the reason they could may explain why so many people struggle with weight today."),
    ("mechanism", "The answer has less to do with fast food, modern lifestyles, or personal discipline than most people realize. In fact, it begins with one of the oldest survival mechanisms ever built into the human body."),
    ("prehistoric", "To understand why, imagine waking up tomorrow in a prehistoric world. There is no refrigerator, no pantry, no guarantee that lunch exists. Every calorie entering your body has to come from somewhere in the landscape around you."),
    ("roulette", "Maybe your group finds a patch of berries. Maybe someone catches a rabbit. Maybe a hunt succeeds and everyone eats well for days. Or maybe nothing works. The weather changes. Animals move elsewhere. The plants your group depends on fail to appear."),
    ("stability", "The modern experience of food is remarkably stable. The prehistoric experience often wasn't. Anthropologists studying hunter gatherers have found that food availability can swing dramatically across seasons and years. Periods of abundance are followed by periods of scarcity."),
    ("stored", "In that environment, body fat becomes something very different from how we think about it today. It isn't just extra weight. It is stored survival. A kilogram of body fat contains thousands of calories. That energy can keep you alive when food becomes difficult to obtain. And surviving is the only thing evolution really cares about."),
    ("moviemyth", "The strange thing is that many people assume ancient humans constantly burned enormous numbers of calories every day. Movies often show prehistoric life as one endless action sequence. Everyone is sprinting. Everyone is fighting. Everyone looks like they just finished a professional fitness program."),
    ("dailylife", "Reality was probably much less dramatic. Hunter gatherers certainly worked for their food, but they were not exercising for the sake of exercise. Movement happened because daily life required it. Water had to be collected. Firewood had to be gathered. Food had to be found. Tools had to be made."),
    ("consistency", "Some anthropologists have argued that certain hunter gatherer groups enjoyed more leisure time than many modern workers. What made their lifestyle different was not constant intensity. It was consistency. The human body evolved in an environment where movement was built into daily life rather than scheduled into it."),
    ("venus", "But even if ancient humans could gain fat, do we have any evidence that they actually did? The figurine from the beginning of this story has a name. The Venus of Willendorf. It was carved around thirty thousand years ago, and has a rounded stomach, thick thighs, and visible fat deposits."),
    ("figurines", "Archaeologists have debated its meaning for over a century. And the Venus of Willendorf is not alone. Similar figurines have been discovered across Europe and parts of Asia. The details vary, but many depict bodies carrying substantial fat reserves. They suggest that larger bodies existed often enough to become meaningful symbols."),
    ("agriculture", "The archaeological evidence becomes even more interesting once agriculture enters the story. For roughly ninety-five percent of human history, people survived through hunting and gathering. Then, beginning around twelve thousand years ago, agriculture emerged. Instead of following food, humans increasingly started producing it."),
    ("villages", "This changed everything. Villages became possible. Populations expanded. Food storage improved. For the first time, some people gained access to relatively predictable calorie supplies. And something curious happened."),
    ("status", "Historical records from agricultural societies occasionally describe individuals who were extremely overweight. In some cultures, large body size became associated with wealth and status. If most people struggled to secure food, someone carrying obvious fat reserves was displaying access to resources. Body fat could function almost like a luxury item."),
    ("civilizations", "Ancient Egypt provides examples. So does Rome. So does China. The wealthy often ate differently from everyone else. Their diets included more refined foods, more meat, more alcohol, and greater overall calorie intake. The difference was that relatively few people had access to the conditions necessary for obesity."),
    ("tradeoffs", "If body fat was useful, why didn't evolution push humans toward becoming as large as possible? The answer is that survival involves trade-offs. Fat stores energy, but carrying too much of it creates costs. Movement becomes harder. Heat becomes more difficult to manage. Natural selection was trying to create a body capable of surviving unpredictable environments."),
    ("honey", "Consider honey. To modern humans, honey is ordinary. For most of human history, it was anything but. Finding honey often meant locating a wild bee nest, dealing with angry insects, and taking a real risk for a concentrated source of calories. The reward was worth it. Sweet foods contain energy, and the people most motivated to find them often gained an advantage."),
    ("sweet", "Generation after generation, those preferences became part of our species. Even today, a newborn infant shows a preference for sweetness. Nobody teaches that preference. It arrives already built into the brain. The challenge is that those ancient preferences now operate in an environment unlike anything our ancestors experienced."),
    ("mismatch", "For most of human history, calorie dense foods appeared occasionally. Today, they are available every day. Researchers sometimes call this an evolutionary mismatch. The body expects one environment, reality provides another, and the gap between those two things produces consequences."),
    ("asintended", "What makes this especially fascinating is that obesity itself is not evidence that something inside the human body is malfunctioning. In many ways, it demonstrates that one of our oldest biological programs is working exactly as intended. The body encounters abundance. The body stores energy. The difference is that abundance used to be temporary. Now it can last a lifetime."),
    ("conclusion", "So, did ancient humans get fat? Yes, some undoubtedly did. Ancient artwork suggests larger bodies existed thousands of years before the invention of fast food. Our species evolved to store energy whenever circumstances allowed. But widespread obesity was probably uncommon, because the environment kept getting in the way."),
    ("refrigerator", "Then humanity transformed the world. We built farms, cities, factories, and global supply chains. Yet the body making decisions inside us remains largely the same one that evolved long before any of those things appeared. So the next time you open a refrigerator, you are witnessing something extraordinary. A world where the famine never arrives, and where one of humanity's greatest survival adaptations continues doing exactly what it evolved to do."),
]

def wav_duration(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() / w.getframerate()

timing = {"fps": FPS, "scenes": []}
total = 0
print(f"🎙️  Generating {len(scenes)} narration clips with Piper...\n")
for sid, text in scenes:
    wav = f"{OUT}/{sid}.wav"
    p = subprocess.run(PIPER + ["-f", wav], input=text, capture_output=True, text=True)
    if not os.path.exists(wav):
        print(f"  ✗ {sid}: {p.stderr[-200:]}")
        continue
    dur = wav_duration(wav)
    frames = round(dur * FPS) + PAD
    timing["scenes"].append({"id": sid, "audio": f"ancient/{sid}.wav",
                             "audioDuration": round(dur, 2), "durationInFrames": frames})
    total += frames
    print(f"  {sid:14} {dur:6.2f}s  → {frames:5d} frames")

timing["totalFrames"] = total
with open("src/ancient-timing.json", "w") as f:
    json.dump(timing, f, ensure_ascii=False, indent=2)
print(f"\n  TOTAL: {total} frames = {total/FPS:.1f}s = {total/FPS/60:.1f} min")
print("  ✓ src/ancient-timing.json written")

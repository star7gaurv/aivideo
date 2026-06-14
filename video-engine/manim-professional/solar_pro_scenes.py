from manim import *
import numpy as np

# Professional color scheme (Kurzgesagt-inspired)
DARK_BG = "#0f172a"
PRIMARY = "#667eea"
SECONDARY = "#764ba2"
SUN_COLOR = "#fbbf24"
PANEL_COLOR = "#0369a1"
ENERGY_COLOR = "#10b981"
ACCENT = "#f59e0b"
WHITE = "#ffffff"
LIGHT_TEXT = "#e0e0e0"

class ProScene(Scene):
    """Base class for professional scenes with unified styling"""
    def construct(self):
        self.camera.background_color = DARK_BG

    def add_title_box(self, title_text, subtitle_text="", y_pos=2.5):
        """Add a title with optional subtitle (top of scene, no overlap)"""
        title = Text(title_text, font_size=60, color=WHITE, weight=BOLD).shift(UP * y_pos)
        if subtitle_text:
            subtitle = Text(subtitle_text, font_size=28, color=SUN_COLOR).shift(UP * (y_pos - 0.8))
            return VGroup(title, subtitle)
        return title

class TitleScene(ProScene):
    def construct(self):
        super().construct()

        # Title with smooth fade + scale
        title = Text("सौर ऊर्जा", font_size=80, color=SUN_COLOR, weight=BOLD)
        subtitle = Text("Solar Energy • शक्ति सूरज की", font_size=32, color=LIGHT_TEXT).next_to(title, DOWN, buff=0.4)

        title_group = VGroup(title, subtitle).shift(UP * 0.5)

        # Sun icon (bottom right, separate from text)
        sun = Circle(radius=1, color=SUN_COLOR, fill_opacity=1)
        sun_rays = VGroup()
        for angle in np.linspace(0, 2*np.pi, 12, endpoint=False):
            start = sun.get_center() + 1.1 * np.array([np.cos(angle), np.sin(angle), 0])
            end = sun.get_center() + 1.7 * np.array([np.cos(angle), np.sin(angle), 0])
            ray = Line(start, end, color=SUN_COLOR, stroke_width=2)
            sun_rays.add(ray)

        sun_glow = Circle(radius=1.3, color=SUN_COLOR, fill_opacity=0.1)
        sun_group = VGroup(sun_glow, sun, sun_rays).shift(DOWN * 1.5)

        # Animations
        self.play(FadeIn(title_group), run_time=1.5)
        self.play(Create(sun_group), run_time=1.5)
        self.wait(1)
        self.play(FadeOut(title_group, sun_group), run_time=0.8)

class HowItWorksScene(ProScene):
    def construct(self):
        super().construct()

        # Title (top, centered)
        title = Text("सोलर पैनल कैसे काम करता है", font_size=48, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # Left side: Sun and diagram
        sun = Circle(radius=0.6, color=SUN_COLOR, fill_opacity=1).shift(LEFT * 4 + UP * 1.5)

        # Photon rays moving to panel
        panel = Rectangle(width=2.5, height=1.5, color=PANEL_COLOR, fill_opacity=0.9).shift(LEFT * 1.5 + DOWN * 0.5)
        panel_label = Text("Solar Panel", font_size=20, color=WHITE).move_to(panel.get_center())

        # Right side: Text explanation (NO OVERLAPS)
        explanation = VGroup(
            Text("Step 1: फोटॉन", font_size=28, color=SUN_COLOR, weight=BOLD),
            Text("सूरज की किरणें", font_size=22, color=LIGHT_TEXT),
            Text("", font_size=14),  # Spacer
            Text("Step 2: इलेक्ट्रॉन", font_size=28, color=ACCENT, weight=BOLD),
            Text("सिलिकॉन में उत्तेजना", font_size=22, color=LIGHT_TEXT),
            Text("", font_size=14),  # Spacer
            Text("Step 3: विद्युत", font_size=28, color=ENERGY_COLOR, weight=BOLD),
            Text("विद्युत ऊर्जा निकलती है", font_size=22, color=LIGHT_TEXT),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.15).shift(RIGHT * 2.5)

        # Output line with electricity symbol
        output = Line(panel.get_right(), panel.get_right() + RIGHT * 1.5, color=ENERGY_COLOR, stroke_width=3)
        output_label = Text("⚡", font_size=40).next_to(output, RIGHT, buff=0.3)

        # Animations
        self.play(Create(sun), Create(panel), Write(panel_label), run_time=1.5)
        self.play(Write(explanation), run_time=2)
        self.play(Create(output), Write(output_label), run_time=1)
        self.wait(1.5)
        self.play(FadeOut(title, sun, panel, panel_label, explanation, output, output_label), run_time=1)

class BenefitsScene(ProScene):
    def construct(self):
        super().construct()

        # Title (top)
        title = Text("सौर ऊर्जा के 4 मुख्य फायदे", font_size=48, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # 2x2 grid (no overlapping)
        benefits = [
            {"emoji": "♻️", "hindi": "प्रदूषण मुक्त", "color": ENERGY_COLOR},
            {"emoji": "⚡", "hindi": "कभी ख़त्म नहीं", "color": ACCENT},
            {"emoji": "💰", "hindi": "बिजली बिल कम", "color": SUN_COLOR},
            {"emoji": "🌍", "hindi": "पृथ्वी बचाएं", "color": PRIMARY},
        ]

        cards = VGroup()
        positions = [(-3, 1), (3, 1), (-3, -1.5), (3, -1.5)]

        for i, (benefit, pos) in enumerate(zip(benefits, positions)):
            # Card background
            card_bg = RoundedRectangle(
                width=2.5, height=2,
                color=benefit["color"],
                fill_opacity=0.2,
                stroke_width=2,
                corner_radius=0.2
            )

            # Emoji
            emoji = Text(benefit["emoji"], font_size=48).shift(UP * 0.5)

            # Text
            text = Text(benefit["hindi"], font_size=24, color=WHITE, weight=BOLD).shift(DOWN * 0.4)

            card = VGroup(card_bg, emoji, text).move_to(np.array([pos[0], pos[1], 0]))
            cards.add(card)

        # Animate cards sequentially
        for card in cards:
            self.play(FadeIn(card), run_time=0.5)

        self.wait(1.5)
        self.play(FadeOut(title, cards), run_time=1)

class StatsScene(ProScene):
    def construct(self):
        super().construct()

        # Title (top)
        title = Text("भारत में सौर ऊर्जा का विकास", font_size=48, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # Left: Bar chart visualization (no overlap with right)
        bar_width = 0.8

        # Current bar
        bar1_height = 3.2  # 160 GW
        bar1 = Rectangle(width=bar_width, height=bar1_height, color=PANEL_COLOR, fill_opacity=0.9).shift(LEFT * 2.5 + DOWN * 1.6)
        label1_value = Text("160 GW", font_size=32, color=SUN_COLOR, weight=BOLD).shift(LEFT * 2.5 + UP * 2)
        label1_text = Text("2026", font_size=20, color=LIGHT_TEXT).shift(LEFT * 2.5 + DOWN * 2.5)

        # Target bar
        bar2_height = 5  # 500 GW
        bar2 = Rectangle(width=bar_width, height=bar2_height, color=ENERGY_COLOR, fill_opacity=0.9).shift(RIGHT * 2.5 + DOWN * 1.0)
        label2_value = Text("500 GW", font_size=32, color=ENERGY_COLOR, weight=BOLD).shift(RIGHT * 2.5 + UP * 2.8)
        label2_text = Text("2030 लक्ष्य", font_size=20, color=LIGHT_TEXT).shift(RIGHT * 2.5 + DOWN * 2.5)

        # Arrow between bars
        arrow = Arrow(bar1.get_right() + RIGHT * 0.3, bar2.get_left() + LEFT * 0.3, color=ACCENT, stroke_width=3)
        arrow_text = Text("3.1× वृद्धि", font_size=24, color=ACCENT, weight=BOLD).next_to(arrow, UP, buff=0.2)

        # Animations
        self.play(Create(bar1), Write(label1_value), Write(label1_text), run_time=1.5)
        self.wait(0.5)
        self.play(Create(bar2), Write(label2_value), Write(label2_text), run_time=1.5)
        self.play(Create(arrow), Write(arrow_text), run_time=1)

        self.wait(1.5)
        self.play(FadeOut(title, bar1, bar2, label1_value, label1_text, label2_value, label2_text, arrow, arrow_text), run_time=1)

class ActionScene(ProScene):
    def construct(self):
        super().construct()

        # Large centered CTA
        main_text = Text("आज ही शुरुआत करो", font_size=72, color=SUN_COLOR, weight=BOLD).shift(UP * 0.8)
        sub_text = Text("सूरज की शक्ति से स्वच्छ भविष्य बनाओ", font_size=32, color=LIGHT_TEXT).shift(DOWN * 1.2)

        # Bottom: Small electricity icon
        lightning = Text("⚡", font_size=64, color=ENERGY_COLOR).shift(DOWN * 2.5)

        # Animations
        self.play(ScaleInPlace(main_text, scale_factor=0), Write(main_text), run_time=2)
        self.play(FadeIn(sub_text, shift=UP*0.3), run_time=1.5)
        self.play(FadeIn(lightning), run_time=1)

        self.wait(2)
        self.play(FadeOut(main_text, sub_text, lightning), run_time=1)

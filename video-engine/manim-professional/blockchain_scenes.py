from manim import *
import numpy as np

# Colors
DARK_BG = "#0f172a"
PRIMARY = "#667eea"
SECONDARY = "#764ba2"
ACCENT_ORANGE = "#f59e0b"
ACCENT_BLUE = "#3b82f6"
ACCENT_GREEN = "#10b981"
ACCENT_PURPLE = "#a855f7"
WHITE = "#ffffff"
LIGHT_TEXT = "#e0e0e0"

class BlockchainTitleScene(Scene):
    def construct(self):
        self.camera.background_color = DARK_BG

        title = Text("ब्लॉकचेन", font_size=80, color=ACCENT_BLUE, weight=BOLD)
        subtitle = Text("Blockchain • डिजिटल पारदर्शिता", font_size=32, color=LIGHT_TEXT).next_to(title, DOWN, buff=0.4)

        # Decorative blocks
        blocks = VGroup()
        for i in range(3):
            block = Square(side_length=0.8, fill_opacity=0.8, color=ACCENT_PURPLE if i % 2 == 0 else ACCENT_BLUE).shift(RIGHT * (i - 1) * 1.2 + DOWN * 1.5)
            blocks.add(block)

        group = VGroup(title, subtitle, blocks)
        self.play(FadeIn(group), run_time=2)
        self.wait(1)
        self.play(FadeOut(group), run_time=1)

class BlockchainBasicsScene(Scene):
    def construct(self):
        self.camera.background_color = DARK_BG

        title = Text("ब्लॉकचेन क्या है?", font_size=48, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # Chain of blocks
        blocks = VGroup()
        connections = VGroup()

        for i in range(4):
            block = Rectangle(width=1.5, height=1.2, color=ACCENT_BLUE, fill_opacity=0.9, stroke_width=2)
            block.shift(LEFT * 4.5 + RIGHT * (i * 2.5))

            # Block number
            num = Text(f"Block {i+1}", font_size=16, color=WHITE).move_to(block.get_center() + UP * 0.2)
            hash_text = Text(f"Hash: {hex(i)}", font_size=12, color=ACCENT_ORANGE).move_to(block.get_center() + DOWN * 0.3)

            block_group = VGroup(block, num, hash_text)
            blocks.add(block_group)

            # Connection arrow
            if i < 3:
                arrow = Arrow(block.get_right() + RIGHT * 0.15, block.get_right() + RIGHT * 0.7, color=ACCENT_GREEN, stroke_width=2)
                connections.add(arrow)

        chain = VGroup(blocks, connections)
        self.play(Create(chain), run_time=2)

        # Explanation text
        explanation = VGroup(
            Text("हर ब्लॉक में:", font_size=28, color=ACCENT_GREEN, weight=BOLD),
            Text("✓ डेटा (Transactions)", font_size=20, color=LIGHT_TEXT),
            Text("✓ पिछले ब्लॉक का Hash", font_size=20, color=LIGHT_TEXT),
            Text("✓ नया Hash", font_size=20, color=LIGHT_TEXT),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.15).shift(DOWN * 2.2 + LEFT * 1)

        self.play(Write(explanation), run_time=1.5)
        self.wait(1.5)
        self.play(FadeOut(title, chain, explanation), run_time=1)

class CryptographyScene(Scene):
    def construct(self):
        self.camera.background_color = DARK_BG

        title = Text("क्रिप्टोग्राफी की शक्ति", font_size=48, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # Left: Data
        data_box = RoundedRectangle(width=2.5, height=1.5, color=ACCENT_BLUE, fill_opacity=0.2, stroke_width=2, corner_radius=0.2)
        data_text = Text("डेटा", font_size=28, color=ACCENT_BLUE, weight=BOLD).move_to(data_box.get_center())
        data_group = VGroup(data_box, data_text).shift(LEFT * 3)

        # Middle: Lock
        lock = Text("🔐", font_size=60).shift(UP * 0.3)

        # Right: Hash
        hash_box = RoundedRectangle(width=2.5, height=1.5, color=ACCENT_GREEN, fill_opacity=0.2, stroke_width=2, corner_radius=0.2)
        hash_text = Text("Unique\nHash", font_size=20, color=ACCENT_GREEN, weight=BOLD).move_to(hash_box.get_center())
        hash_group = VGroup(hash_box, hash_text).shift(RIGHT * 3)

        # Arrow
        arrow = Arrow(data_group.get_right() + RIGHT * 0.3, hash_group.get_left() + LEFT * 0.3, color=ACCENT_PURPLE, stroke_width=3)

        self.play(FadeIn(data_group), run_time=1)
        self.play(FadeIn(lock), run_time=0.8)
        self.play(Create(arrow), run_time=1)
        self.play(FadeIn(hash_group), run_time=1)

        # Explanation
        explanation = Text("थोड़ी सी भी गलती = बिल्कुल नया Hash", font_size=24, color=ACCENT_ORANGE).shift(DOWN * 2)
        self.play(Write(explanation), run_time=1.5)

        self.wait(1.5)
        self.play(FadeOut(title, data_group, lock, arrow, hash_group, explanation), run_time=1)

class ApplicationsScene(Scene):
    def construct(self):
        self.camera.background_color = DARK_BG

        title = Text("ब्लॉकचेन के उपयोग", font_size=48, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # 2x2 grid
        applications = [
            {"emoji": "💰", "name": "क्रिप्टोकरेंसी", "color": ACCENT_ORANGE},
            {"emoji": "🏥", "name": "स्वास्थ्य रिकॉर्ड", "color": ACCENT_GREEN},
            {"emoji": "📝", "name": "स्मार्ट अनुबंध", "color": ACCENT_BLUE},
            {"emoji": "🏗️", "name": "सप्लाई चेन", "color": ACCENT_PURPLE},
        ]

        cards = VGroup()
        positions = [(-3, 1), (3, 1), (-3, -1.5), (3, -1.5)]

        for app, pos in zip(applications, positions):
            card_bg = RoundedRectangle(width=2.8, height=2, color=app["color"], fill_opacity=0.2, stroke_width=2, corner_radius=0.2)
            emoji = Text(app["emoji"], font_size=48).shift(UP * 0.5)
            text = Text(app["name"], font_size=22, color=WHITE, weight=BOLD).shift(DOWN * 0.4)

            card = VGroup(card_bg, emoji, text).move_to(np.array([pos[0], pos[1], 0]))
            cards.add(card)

        for card in cards:
            self.play(FadeIn(card), run_time=0.4)

        self.wait(1.5)
        self.play(FadeOut(title, cards), run_time=1)

class FutureScene(Scene):
    def construct(self):
        self.camera.background_color = DARK_BG

        main = Text("भविष्य विकेंद्रीकृत है", font_size=66, color=ACCENT_GREEN, weight=BOLD).shift(UP * 0.8)
        sub = Text("बैंकों और बिचौलियों के बिना", font_size=32, color=LIGHT_TEXT).shift(DOWN * 1.2)

        # Decoration
        circle1 = Circle(radius=2, color=ACCENT_PURPLE, fill_opacity=0.1, stroke_width=2).shift(LEFT * 3 + DOWN * 2)
        circle2 = Circle(radius=1.5, color=ACCENT_BLUE, fill_opacity=0.1, stroke_width=2).shift(RIGHT * 3.5 + UP * 1)

        self.play(Write(main), run_time=2)
        self.play(FadeIn(sub, shift=UP*0.3), run_time=1.5)
        self.play(Create(circle1), Create(circle2), run_time=1)

        self.wait(2)
        self.play(FadeOut(main, sub, circle1, circle2), run_time=1)

from manim import *
import numpy as np

class SunScene(Scene):
    def construct(self):
        self.camera.background_color = "#001a4d"

        # Sun
        sun = Circle(radius=0.8, color=YELLOW, fill_opacity=1)
        sun_glow = Circle(radius=0.95, color=ORANGE, fill_opacity=0.3)
        sun_group = VGroup(sun_glow, sun)

        # Sun rays
        rays = VGroup()
        for angle in np.linspace(0, 2*np.pi, 12, endpoint=False):
            start = sun.get_center() + 0.9 * np.array([np.cos(angle), np.sin(angle), 0])
            end = sun.get_center() + 1.5 * np.array([np.cos(angle), np.sin(angle), 0])
            ray = Line(start, end, color=GOLD, stroke_width=3)
            rays.add(ray)

        title = Text("सौर ऊर्जा", font_size=72, color=WHITE).shift(DOWN * 3)
        subtitle = Text("Solar Energy • शक्ति सूरज की", font_size=28, color=YELLOW).next_to(title, DOWN, buff=0.3)

        self.play(Create(sun_glow), Create(sun), run_time=1.5)
        self.play(*[Create(ray) for ray in rays], run_time=1)
        self.play(Write(title), run_time=1.5)
        self.play(FadeIn(subtitle, shift=UP*0.2), run_time=1)
        self.wait(2)
        self.play(FadeOut(sun_group, rays, title, subtitle), run_time=1)


class PanelScene(Scene):
    def construct(self):
        self.camera.background_color = "#001a4d"

        # Title
        title = Text("सोलर पैनल कैसे काम करता है?", font_size=36, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # Sun on left
        sun = Circle(radius=0.4, color=YELLOW, fill_opacity=1).shift(LEFT * 5 + UP * 2)

        # Rays
        rays = VGroup()
        for i in range(8):
            angle = i * np.pi / 4
            ray = Line(
                sun.get_center() + 0.5 * np.array([np.cos(angle), np.sin(angle), 0]),
                sun.get_center() + 2.5 * np.array([np.cos(angle), np.sin(angle), 0]),
                color=GOLD, stroke_width=2
            )
            rays.add(ray)

        # Solar panel
        panel = Rectangle(width=2, height=1.2, color=BLUE, fill_opacity=0.8).shift(RIGHT * 1.5)
        panel_label = Text("सोलर सेल", font_size=20, color=WHITE).move_to(panel.get_center())

        # Photons
        photon_group = VGroup()
        for i in range(5):
            dot = Dot(radius=0.05, color=YELLOW).shift(LEFT * 3 + UP * (1 - i*0.5))
            photon_group.add(dot)

        # Electricity output (lightning bolt effect)
        output_line = Line(panel.get_right(), panel.get_right() + RIGHT * 1.5, color=YELLOW_D, stroke_width=3)
        output_label = Text("विद्युत", font_size=20, color=YELLOW_D).next_to(output_line, DOWN)

        # Animation
        self.play(Create(sun), run_time=1)
        self.play(*[Create(ray) for ray in rays], run_time=1)
        self.play(Create(panel), run_time=1)
        self.play(Write(panel_label), run_time=0.5)

        # Photons moving to panel
        for photon in photon_group:
            self.play(photon.animate.move_to(panel.get_center()), run_time=0.3)

        self.play(Create(output_line), run_time=1)
        self.play(Write(output_label), run_time=0.5)

        self.wait(2)
        self.play(FadeOut(sun, rays, panel, panel_label, photon_group, output_line, output_label, title), run_time=1)


class BenefitsScene(Scene):
    def construct(self):
        self.camera.background_color = "#001a4d"

        title = Text("सौर ऊर्जा के फायदे", font_size=40, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        benefits = VGroup(
            Text("♻️  प्रदूषण मुक्त", font_size=28, color=GREEN),
            Text("⚡  कभी ख़त्म न होने वाली", font_size=28, color=YELLOW),
            Text("💰  बिजली बिल कम करें", font_size=28, color=GOLD),
            Text("🌍  पृथ्वी को बचाएं", font_size=28, color=TEAL),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.6).shift(DOWN * 0.5)

        for benefit in benefits:
            self.play(FadeIn(benefit, shift=RIGHT*0.3), run_time=0.5)

        self.wait(2)
        self.play(FadeOut(title, benefits), run_time=1)


class StatsScene(Scene):
    def construct(self):
        self.camera.background_color = "#001a4d"

        title = Text("भारत में सौर ऊर्जा", font_size=40, color=WHITE).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=1)

        # Statistics
        stat1 = VGroup(
            Text("160 GW", font_size=44, color=YELLOW),
            Text("स्थापित क्षमता", font_size=22, color=WHITE)
        ).arrange(DOWN, buff=0.2).shift(LEFT * 2.5 + DOWN * 0.5)

        stat2 = VGroup(
            Text("2030 तक", font_size=44, color=YELLOW),
            Text("500 GW लक्ष्य", font_size=22, color=WHITE)
        ).arrange(DOWN, buff=0.2).shift(RIGHT * 2.5 + DOWN * 0.5)

        # Bars
        bar1 = Rectangle(width=1.5, height=2, color=BLUE_D, fill_opacity=0.7).move_to(stat1.get_bottom() + DOWN * 2)
        bar2 = Rectangle(width=1.5, height=3.1, color=GREEN_D, fill_opacity=0.7).move_to(stat2.get_bottom() + DOWN * 2)

        self.play(Write(stat1), run_time=1)
        self.play(Write(stat2), run_time=1)
        self.play(Create(bar1), Create(bar2), run_time=1.5)

        self.wait(2)
        self.play(FadeOut(title, stat1, stat2, bar1, bar2), run_time=1)


class ActionScene(Scene):
    def construct(self):
        self.camera.background_color = "#001a4d"

        message1 = Text("आज ही शुरुआत करो", font_size=52, color=YELLOW, weight=BOLD)
        message2 = Text("सूरज की शक्ति का उपयोग करो", font_size=36, color=GOLD).next_to(message1, DOWN, buff=0.5)

        sun_icon = Circle(radius=0.3, color=YELLOW, fill_opacity=1).shift(LEFT * 1.5)
        arrow = Arrow(sun_icon.get_right(), message1.get_left(), color=GREEN, stroke_width=3)

        self.play(Create(sun_icon), run_time=0.5)
        self.play(Write(message1), run_time=1.5)
        self.play(Write(message2), run_time=1.5)
        self.play(Create(arrow), run_time=1)

        self.wait(3)
        self.play(FadeOut(sun_icon, message1, message2, arrow), run_time=1)

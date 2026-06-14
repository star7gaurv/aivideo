from manim import *

class TitleScene(Scene):
    def construct(self):
        self.camera.background_color = BLUE_D

        title = Text("चक्रवृद्धि ब्याज", font_size=72, color=WHITE)
        subtitle = Text("पैसा खुद कैसे बढ़ता है?", font_size=36, color=YELLOW)
        subtitle.next_to(title, DOWN, buff=0.4)

        self.play(Write(title), run_time=2)
        self.play(FadeIn(subtitle, shift=UP * 0.3), run_time=1.5)
        self.wait(2)
        self.play(FadeOut(title), FadeOut(subtitle), run_time=1)


class ComparisonScene(Scene):
    def construct(self):
        self.camera.background_color = BLUE_D

        heading = Text("साधारण ब्याज vs चक्रवृद्धि ब्याज", font_size=32, color=WHITE)
        heading.to_edge(UP, buff=0.4)
        self.play(Write(heading), run_time=1.5)

        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 30000, 5000],
            x_length=9,
            y_length=5,
            axis_config={"color": WHITE},
            x_axis_config={"numbers_to_include": range(0, 11, 2)},
            y_axis_config={"numbers_to_include": range(0, 30001, 10000)},
        ).shift(DOWN * 0.3)

        x_label = Text("वर्ष (Year)", font_size=20, color=WHITE).next_to(axes.x_axis, DOWN)
        y_label = Text("₹ मूल्य", font_size=20, color=WHITE).next_to(axes.y_axis, LEFT)

        simple_line = axes.plot(lambda x: 10000 + 1000 * x, color=RED, x_range=[0, 10])
        compound_line = axes.plot(lambda x: 10000 * (1.1 ** x), color=GREEN, x_range=[0, 10])

        simple_label = Text("साधारण ब्याज", font_size=20, color=RED).next_to(simple_line.get_end(), RIGHT, buff=0.1)
        compound_label = Text("चक्रवृद्धि ब्याज", font_size=20, color=GREEN).next_to(compound_line.get_end(), RIGHT, buff=0.1)

        self.play(Create(axes), Write(x_label), Write(y_label), run_time=1.5)
        self.play(Create(simple_line), run_time=2)
        self.play(Write(simple_label), run_time=0.8)
        self.play(Create(compound_line), run_time=2)
        self.play(Write(compound_label), run_time=0.8)
        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1)


class FormulaScene(Scene):
    def construct(self):
        self.camera.background_color = BLUE_D

        heading = Text("सूत्र (Formula)", font_size=40, color=YELLOW)
        heading.to_edge(UP, buff=0.5)
        self.play(Write(heading), run_time=1)

        # Plain text formula — no LaTeX needed
        formula = Text("A  =  P × ( 1 + r/n ) ^ (n×t)", font_size=46, color=WHITE)
        formula.shift(UP * 0.5)

        labels = VGroup(
            Text("A = भविष्य का मूल्य (Future Value)", font_size=22, color=GREEN),
            Text("P = मूलधन — Principal", font_size=22, color=YELLOW),
            Text("r = ब्याज दर — Interest Rate", font_size=22, color=RED),
            Text("n = चक्र प्रति वर्ष — Compounding/year", font_size=22, color=BLUE),
            Text("t = समय — Time in Years", font_size=22, color=ORANGE),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.25)
        labels.next_to(formula, DOWN, buff=0.5)

        self.play(Write(formula), run_time=2)
        for label in labels:
            self.play(FadeIn(label, shift=RIGHT * 0.2), run_time=0.4)
        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1)


class CounterScene(Scene):
    def construct(self):
        self.camera.background_color = BLUE_D

        heading = Text("₹10,000 @ 10% प्रति वर्ष — 20 साल", font_size=32, color=WHITE)
        heading.to_edge(UP, buff=0.5)
        self.play(Write(heading), run_time=1)

        year_label = Text("वर्ष: ", font_size=40, color=WHITE).shift(UP * 0.5 + LEFT * 2)
        value_label = Text("मूल्य: ", font_size=40, color=WHITE).shift(DOWN * 0.5 + LEFT * 2)

        year_num = Integer(0, font_size=50, color=YELLOW).next_to(year_label, RIGHT)
        value_num = DecimalNumber(10000, num_decimal_places=0, font_size=50, color=GREEN).next_to(value_label, RIGHT)

        rupee = Text("₹", font_size=50, color=GREEN).next_to(value_label, RIGHT)
        value_num.next_to(rupee, RIGHT)

        self.play(Write(year_label), Write(value_label), FadeIn(year_num), FadeIn(rupee), FadeIn(value_num))

        self.play(
            ChangeDecimalToValue(year_num, 20),
            ChangeDecimalToValue(value_num, 67275),
            run_time=6,
            rate_func=linear
        )
        self.wait(2)

        result = Text("₹67,275 — 6.7 गुना वृद्धि!", font_size=42, color=YELLOW)
        result.next_to(value_label, DOWN, buff=1)
        self.play(Write(result), run_time=1.5)
        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1)


class OutroScene(Scene):
    def construct(self):
        self.camera.background_color = BLUE_D

        line1 = Text("जितना जल्दी शुरू करो,", font_size=52, color=WHITE)
        line2 = Text("उतना ज़्यादा मिलेगा।", font_size=52, color=YELLOW)
        line2.next_to(line1, DOWN, buff=0.4)

        group = VGroup(line1, line2).move_to(ORIGIN)

        self.play(FadeIn(line1, shift=UP * 0.3), run_time=1.5)
        self.play(FadeIn(line2, shift=UP * 0.3), run_time=1.5)
        self.wait(3)
        self.play(FadeOut(group), run_time=1)

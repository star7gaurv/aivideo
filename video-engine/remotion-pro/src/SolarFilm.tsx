import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import timing from './timing.json';
import { Hero } from './scenes/Hero';
import { Problem } from './scenes/Problem';
import { HowItWorks } from './scenes/HowItWorks';
import { Benefits } from './scenes/Benefits';
import { India } from './scenes/India';
import { CTA } from './scenes/CTA';

const COMPONENTS: Record<string, React.FC<{ total: number }>> = {
  hero: Hero,
  problem: Problem,
  how: HowItWorks,
  benefits: Benefits,
  india: India,
  cta: CTA,
};

export const SolarFilm: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      {timing.scenes.map((s) => {
        const Comp = COMPONENTS[s.id];
        const from = cursor;
        cursor += s.durationInFrames;
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.durationInFrames}>
            <Comp total={s.durationInFrames} />
            <Audio src={staticFile(`audio/${s.audio}`)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

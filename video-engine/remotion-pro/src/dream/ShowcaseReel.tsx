import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { title, question, creativity, emotion, mystery } from './dreamscenes';

// 20s sizzle reel @30fps = 600 frames. Five 120-frame beats showcasing the engine:
// code-drawn mascot, multiple expressions, full motion, day/night/storm scenes, animated type.
const BEAT = 120;
const order = [title, question, creativity, emotion, mystery];

// Brief brand tag that fades in over the first beat and out over the last.
const BrandTag: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames: D } = useVideoConfig();
  const op = interpolate(f, [0, 18, D - 18, D], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 46, pointerEvents: 'none' }}>
      <div style={{ opacity: op * 0.9, display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: 'Inter,sans-serif', fontSize: 26, fontWeight: 700, color: '#1a1a2e',
        background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(4px)', padding: '8px 18px', borderRadius: 999 }}>
        <span style={{ width: 12, height: 12, borderRadius: 99, background: '#7c5cff', display: 'inline-block' }} />
        Code-Driven Video Engine · ₹0 / render
      </div>
    </AbsoluteFill>
  );
};

export const ShowcaseReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
    {order.map((Scene, i) => (
      <Sequence key={i} from={i * BEAT} durationInFrames={BEAT}>
        <Scene total={BEAT} />
      </Sequence>
    ))}
    <BrandTag />
  </AbsoluteFill>
);

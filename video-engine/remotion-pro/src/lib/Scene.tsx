import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { sceneFade } from './anim';

export const Scene: React.FC<{
  total: number;
  children: React.ReactNode;
}> = ({ total, children }) => {
  const frame = useCurrentFrame();
  const opacity = sceneFade(frame, total);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Caption: React.FC<{
  main: string;
  sub?: string;
  mainSize?: number;
  subSize?: number;
  translateY?: number;
  opacity?: number;
  color?: string;
}> = ({ main, sub, mainSize = 88, subSize = 32, translateY = 0, opacity = 1, color = '#fff' }) => (
  <div style={{ transform: `translateY(${translateY}px)`, opacity, textAlign: 'center' }}>
    <div
      style={{
        fontFamily: "'Noto Sans Devanagari', sans-serif",
        fontSize: mainSize,
        fontWeight: 800,
        color,
        textShadow: '0 6px 24px rgba(0,0,0,0.35)',
        lineHeight: 1.1,
      }}
    >
      {main}
    </div>
    {sub && (
      <div
        style={{
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          fontSize: subSize,
          fontWeight: 500,
          color: '#fff4dc',
          marginTop: 14,
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

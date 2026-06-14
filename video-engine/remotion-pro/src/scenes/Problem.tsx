import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene, Caption } from '../lib/Scene';
import { Defs, Smoke } from '../lib/Illustrations';
import { ramp, riseIn, floaty } from '../lib/anim';

export const Problem: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Thermometer fill rises
  const tempFill = ramp(frame, 70, 90, 0, 150);
  const caption = riseIn(frame, 20, 36, 40);
  const factoryIn = ramp(frame, 30, 40, 80, 0);

  return (
    <Scene total={total}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs />
        <rect width={width} height={height} fill="url(#skyGrey)" />

        {/* dim sun behind haze */}
        <circle cx={width * 0.8} cy={240} r={90} fill="#d9b96b" opacity={0.45} />

        {/* ground */}
        <rect x={0} y={height - 220} width={width} height={220} fill="#3a3f4d" />

        {/* factories */}
        <g transform={`translate(${width * 0.32}, ${height - 220 + factoryIn})`}>
          <rect x={-150} y={-200} width={300} height={200} fill="#2c303b" />
          <rect x={-110} y={-280} width={55} height={90} fill="#3a3f4d" />
          <rect x={20} y={-300} width={55} height={110} fill="#3a3f4d" />
          {/* windows */}
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} x={-120 + i * 70} y={-150} width={36} height={36} fill="#ffd23f" opacity={0.5} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <Smoke key={`s1-${i}`} x={-82} baseY={-280} frame={frame} i={i} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <Smoke key={`s2-${i}`} x={48} baseY={-300} frame={frame} i={i + 3} />
          ))}
        </g>

        {/* thermometer (right) */}
        <g transform={`translate(${width * 0.82}, ${height - 430})`}>
          <rect x={-18} y={-10} width={36} height={300} rx={18} fill="#e8e8ee" />
          <circle cx={0} cy={320} r={42} fill="#e8e8ee" />
          <rect x={-10} y={290 - tempFill} width={20} height={tempFill + 30} rx={10} fill="#e0463c" />
          <circle cx={0} cy={320} r={30} fill="#e0463c" />
        </g>
      </svg>

      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 110 }}>
        <Caption main="प्रदूषण बढ़ रहा है" sub="कोयला और तेल हमारी धरती को गर्म कर रहे हैं" mainSize={80} translateY={caption.translateY} opacity={caption.opacity} />
      </AbsoluteFill>
    </Scene>
  );
};

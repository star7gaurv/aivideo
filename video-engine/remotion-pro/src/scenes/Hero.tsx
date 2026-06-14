import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene, Caption } from '../lib/Scene';
import { Defs, Sun, House, Panel, Cloud } from '../lib/Illustrations';
import { ramp, riseIn, floaty } from '../lib/anim';

export const Hero: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sunY = ramp(frame, 0, 50, 640, 360);
  const sunScale = ramp(frame, 0, 50, 0.6, 1);
  const rayRotate = (frame / 30) * 10;
  const glow = 1 + Math.sin(frame / 14) * 0.04;
  const hillShift = ramp(frame, 10, 40, 120, 0);
  const title = riseIn(frame, 55, 40, 44);

  return (
    <Scene total={total}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs />
        <rect width={width} height={height} fill="url(#skyWarm)" />
        <Sun cx={width / 2} cy={sunY} scale={sunScale} rayRotate={rayRotate} glowPulse={glow} />
        <g transform={`translate(0, ${hillShift})`}>
          <path d={`M0 ${height} L0 760 Q ${width * 0.3} 640 ${width * 0.55} 720 Q ${width * 0.8} 800 ${width} 690 L${width} ${height} Z`} fill="url(#hillBack)" />
        </g>
        <g transform={`translate(0, ${hillShift * 0.6})`}>
          <path d={`M0 ${height} L0 880 Q ${width * 0.25} 800 ${width * 0.5} 860 Q ${width * 0.75} 920 ${width} 840 L${width} ${height} Z`} fill="url(#hillFront)" />
        </g>
        <House x={width * 0.14} y={900 + floaty(frame, 3, 0.03)} scale={1} />
        <House x={width * 0.86} y={900 + floaty(frame, 3, 0.03, 2)} scale={0.9} />
        <Panel x={width * 0.30} y={935} scale={1.25} />
        <Panel x={width * 0.70} y={935} scale={1.25} />
        <Cloud x={((frame / 30) * 18 + 200) % (width + 400) - 200} y={180} />
        <Cloud x={((frame / 30) * 11 + 900) % (width + 400) - 200} y={300} opacity={0.7} scale={0.8} />
      </svg>

      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 120 }}>
        <Caption main="सौर ऊर्जा" sub="सूरज से चलने वाला कल" mainSize={104} translateY={title.translateY} opacity={title.opacity} />
      </AbsoluteFill>
    </Scene>
  );
};

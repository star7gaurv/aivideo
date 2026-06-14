import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene, Caption } from '../lib/Scene';
import { Defs, Sun, House, Panel, Cloud } from '../lib/Illustrations';
import { ramp, riseIn, floaty } from '../lib/anim';

export const CTA: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Sun rises over horizon (hopeful)
  const sunY = ramp(frame, 0, 60, 720, 430);
  const glow = 1 + Math.sin(frame / 14) * 0.05;
  const caption = riseIn(frame, 40, 40, 44);

  return (
    <Scene total={total}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs />
        <rect width={width} height={height} fill="url(#skyHope)" />
        <Sun cx={width / 2} cy={sunY} scale={0.95} rayRotate={(frame / 30) * 9} glowPulse={glow} />
        {/* horizon hill */}
        <path d={`M0 ${height} L0 820 Q ${width * 0.5} 760 ${width} 820 L${width} ${height} Z`} fill="url(#hillFront)" />
        <House x={width * 0.2} y={height - 70} scale={0.85} />
        <House x={width * 0.8} y={height - 70} scale={0.95} />
        <Panel x={width * 0.4} y={height - 110} scale={1.0} />
        <Panel x={width * 0.6} y={height - 110} scale={1.0} />
        <Cloud x={((frame / 30) * 14 + 250) % (width + 400) - 200} y={150} opacity={0.8} />
      </svg>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `translateY(${caption.translateY}px)`, opacity: caption.opacity, textAlign: 'center' }}>
          <Caption main="भविष्य सूरज से चलेगा" sub="आज ही इस बदलाव का हिस्सा बनो" mainSize={92} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

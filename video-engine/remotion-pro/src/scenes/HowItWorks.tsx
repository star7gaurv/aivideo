import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene, Caption } from '../lib/Scene';
import { Defs, Sun, Panel, House } from '../lib/Illustrations';
import { ramp, riseIn, floaty } from '../lib/anim';

export const HowItWorks: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const caption = riseIn(frame, 10, 30, 36);

  // Photon travel from sun (top-left) to panel (center). Loop.
  const sunPos = { x: width * 0.2, y: 300 };
  const panelPos = { x: width * 0.5, y: 640 };

  const photons = Array.from({ length: 5 }).map((_, i) => {
    const t = ((frame - 40 + i * 16) % 80) / 80;
    if (t < 0) return null;
    return {
      x: sunPos.x + (panelPos.x - sunPos.x) * t,
      y: sunPos.y + (panelPos.y - sunPos.y) * t,
      op: Math.sin(t * Math.PI),
    };
  });

  // Electricity flows panel -> house after frame 120
  const houseLit = ramp(frame, 150, 40, 0, 1);
  const wireFlow = ((frame * 3) % 40);

  // step labels
  const step1 = riseIn(frame, 50, 26, 24);
  const step2 = riseIn(frame, 110, 26, 24);
  const step3 = riseIn(frame, 160, 26, 24);

  return (
    <Scene total={total}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs />
        <rect width={width} height={height} fill="url(#skyClean)" />
        <path d={`M0 ${height} L0 880 Q ${width * 0.5} 820 ${width} 880 L${width} ${height} Z`} fill="url(#hillGreen)" />

        <Sun cx={sunPos.x} cy={sunPos.y} scale={0.62} rayRotate={(frame / 30) * 14} />

        {/* photons */}
        {photons.map((p, i) =>
          p ? <circle key={i} cx={p.x} cy={p.y} r={11} fill="#fff2a8" opacity={p.op} stroke="#ffd23f" strokeWidth={3} /> : null
        )}

        {/* big panel */}
        <Panel x={panelPos.x} y={panelPos.y + 120} scale={1.7} />

        {/* wire to house */}
        <path
          d={`M ${panelPos.x + 60} ${panelPos.y + 150} Q ${width * 0.72} ${panelPos.y + 250} ${width * 0.84} ${height - 200}`}
          fill="none" stroke="#2a2a38" strokeWidth={8}
        />
        <path
          d={`M ${panelPos.x + 60} ${panelPos.y + 150} Q ${width * 0.72} ${panelPos.y + 250} ${width * 0.84} ${height - 200}`}
          fill="none" stroke="#34d399" strokeWidth={6} strokeDasharray="6 14" strokeDashoffset={-wireFlow} opacity={houseLit}
        />

        {/* house lighting up */}
        <g opacity={1}>
          <House x={width * 0.84} y={height - 90} scale={1.1} />
          <circle cx={width * 0.84 + 11} cy={height - 105} r={28} fill="#ffe49c" opacity={houseLit * (0.5 + floaty(frame, 0.3, 0.2))} />
        </g>
      </svg>

      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 70 }}>
        <Caption main="यह कैसे काम करता है" mainSize={72} translateY={caption.translateY} opacity={caption.opacity} />
      </AbsoluteFill>

      {/* step chips */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 50 }}>
        <div style={{ display: 'flex', gap: 26, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
          {[
            { t: '1. फोटॉन', c: '#f59e0b', s: step1 },
            { t: '2. सिलिकॉन सेल', c: '#3b82f6', s: step2 },
            { t: '3. बिजली', c: '#10b981', s: step3 },
          ].map((chip, i) => (
            <div key={i} style={{
              opacity: chip.s.opacity,
              transform: `translateY(${chip.s.translateY}px)`,
              background: 'rgba(255,255,255,0.92)',
              color: chip.c, fontWeight: 700, fontSize: 30,
              padding: '14px 28px', borderRadius: 14,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}>{chip.t}</div>
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

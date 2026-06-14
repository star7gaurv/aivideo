import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene, Caption } from '../lib/Scene';
import { Defs } from '../lib/Illustrations';
import { riseIn, scaleIn, floaty } from '../lib/anim';

const ICONS: Record<string, React.ReactNode> = {
  leaf: <path d="M -2 34 C -40 10 -36 -30 24 -34 C 30 18 4 34 -2 34 Z M -2 34 C 0 14 6 0 22 -16" fill="#10b981" stroke="#0a7a52" strokeWidth={3} strokeLinejoin="round" />,
  infinity: <path d="M -34 0 C -34 -22 -2 -22 0 0 C 2 22 34 22 34 0 C 34 -22 2 -22 0 0 C -2 22 -34 22 -34 0 Z" fill="none" stroke="#f59e0b" strokeWidth={11} strokeLinecap="round" />,
  rupee: <g stroke="#fbbf24" strokeWidth={9} strokeLinecap="round" fill="none"><path d="M -16 -28 H 20 M -16 -8 H 20 M -16 -28 C 18 -28 18 12 -10 12 L 18 36" /></g>,
  earth: <g><circle r={34} fill="#3b82f6" /><path d="M -20 -14 Q -4 -22 6 -10 Q 18 -2 8 10 Q -2 20 -14 12 Q -26 2 -20 -14 Z" fill="#34d399" /></g>,
};

export const Benefits: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const caption = riseIn(frame, 8, 28, 34);

  const items = [
    { icon: 'leaf', label: 'साफ़ ऊर्जा', color: '#10b981', delay: 36 },
    { icon: 'infinity', label: 'कभी ख़त्म नहीं', color: '#f59e0b', delay: 50 },
    { icon: 'rupee', label: 'कम बिल', color: '#fbbf24', delay: 64 },
    { icon: 'earth', label: 'हरित धरती', color: '#3b82f6', delay: 78 },
  ];

  return (
    <Scene total={total}>
      <AbsoluteFill style={{ background: 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)' }} />
      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 90 }}>
        <Caption main="सौर ऊर्जा के फायदे" mainSize={76} translateY={caption.translateY} opacity={caption.opacity} />
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 40, marginTop: 60 }}>
          {items.map((it, i) => {
            const s = scaleIn(frame, it.delay, 34, 0.6);
            const fy = floaty(frame, 7, 0.045, i);
            return (
              <div key={i} style={{
                opacity: s.opacity,
                transform: `scale(${s.scale}) translateY(${fy}px)`,
                width: 230, height: 250,
                background: 'rgba(255,255,255,0.06)',
                border: `2px solid ${it.color}55`,
                borderRadius: 22,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 24,
                boxShadow: `0 18px 50px ${it.color}22`,
              }}>
                <svg width={120} height={120} viewBox="-60 -60 120 120">{ICONS[it.icon]}</svg>
                <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 30, fontWeight: 700, color: '#fff' }}>{it.label}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

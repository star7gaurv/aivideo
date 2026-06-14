import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
// NOTE: raw <svg> is not a positioned element; a positioned background layer
// would paint over it. Wrap the svg in <AbsoluteFill> so DOM order controls paint.
import { Scene, Caption } from '../lib/Scene';
import { Defs } from '../lib/Illustrations';
import { ramp, riseIn } from '../lib/anim';

export const India: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const caption = riseIn(frame, 8, 28, 34);

  const baseY = height - 220;
  const maxH = 460;

  // bar grows: current 160, target 500
  const bar1 = ramp(frame, 45, 50, 0, (160 / 500) * maxH);
  const bar2 = ramp(frame, 80, 70, 0, maxH);

  const val1 = Math.round(ramp(frame, 45, 50, 0, 160));
  const val2 = Math.round(ramp(frame, 80, 70, 0, 500));

  const x1 = width * 0.38;
  const x2 = width * 0.62;
  const bw = 150;

  return (
    <Scene total={total}>
      <AbsoluteFill style={{ background: 'linear-gradient(135deg,#0f2027 0%,#203a43 60%,#2c5364 100%)' }} />
      <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs />
        {/* baseline */}
        <line x1={width * 0.2} y1={baseY} x2={width * 0.8} y2={baseY} stroke="#ffffff44" strokeWidth={3} />

        {/* bar 1 - current */}
        <rect x={x1 - bw / 2} y={baseY - bar1} width={bw} height={bar1} rx={10} fill="#3b82f6" />
        {/* bar 2 - target */}
        <rect x={x2 - bw / 2} y={baseY - bar2} width={bw} height={bar2} rx={10} fill="url(#barGrad)" />

        {/* arrow showing growth */}
        {frame > 150 && (
          <g opacity={ramp(frame, 150, 25, 0, 1)}>
            <path d={`M ${x1} ${baseY - bar1 - 40} Q ${(x1 + x2) / 2} ${baseY - maxH - 80} ${x2} ${baseY - bar2 - 40}`}
              fill="none" stroke="#fbbf24" strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" />
          </g>
        )}
      </svg>
      </AbsoluteFill>

      {/* numeric labels — lifted clear of the bars, single line */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: x1 - 150, top: baseY - bar1 - 120, width: 300, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 56, fontWeight: 800, color: '#7fd1ff' }}>{val1} GW</div>
          <div style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: 26, color: '#cfe8ff' }}>आज (2026)</div>
        </div>
        <div style={{ position: 'absolute', left: x2 - 150, top: baseY - bar2 - 120, width: 300, textAlign: 'center', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 56, fontWeight: 800, color: '#34d399' }}>{val2} GW</div>
          <div style={{ fontFamily: "'Noto Sans Devanagari',sans-serif", fontSize: 26, color: '#c7f5e2' }}>2030 लक्ष्य</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 80 }}>
        <Caption main="भारत का सौर सफ़र" mainSize={76} translateY={caption.translateY} opacity={caption.opacity} />
      </AbsoluteFill>
    </Scene>
  );
};

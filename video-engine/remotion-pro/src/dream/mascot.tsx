import React from 'react';
import { interpolate, Easing } from 'remotion';

export const float = (f: number, amp = 8, sp = 0.05, ph = 0) => Math.sin(f * sp + ph) * amp;
const SMOOTH = Easing.bezier(0.22, 1, 0.36, 1);
export const ramp = (f: number, s: number, d: number, a: number, b: number) =>
  interpolate(f, [s, s + d], [a, b], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SMOOTH });
export const sceneFade = (f: number, total: number, fade = 16) =>
  interpolate(f, [0, fade, total - fade, total], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

// Blink: eyes shut briefly every ~2.5s
const blink = (f: number) => (f % 75 < 4 ? 0.1 : 1);

type Expr = 'sleepy' | 'curious' | 'happy' | 'calm' | 'wow';

export const DreamBg: React.FC<{ f: number; W: number; H: number; hue?: string; night?: boolean }> = ({
  f, W, H, hue = '#e7d9ff', night = false,
}) => (
  <>
    <defs>
      <radialGradient id="dhalo" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor="#fff4fb" />
        <stop offset="45%" stopColor="#d9e8ff" />
        <stop offset="75%" stopColor={hue} />
        <stop offset="100%" stopColor={night ? '#2a2350' : '#ffffff'} stopOpacity={night ? 1 : 0} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={night ? '#1e1840' : '#ffffff'} />
    <circle cx={W / 2} cy={H * 0.46} r={W * 0.46} fill="url(#dhalo)" />
    {Array.from({ length: 26 }).map((_, i) => {
      const x = (i * 173) % W;
      const y = (i * 251) % (H * 0.92);
      const tw = 0.25 + (Math.sin(f * 0.08 + i) + 1) * 0.35;
      return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill={night ? '#cdbfff' : '#c9a0ff'} opacity={tw} />;
    })}
    {[[0.2, 0.22, 0.8], [0.8, 0.2, 0.7], [0.13, 0.6, 0.6], [0.88, 0.62, 0.7]].map(([cx, cy, s], i) => (
      <g key={i} transform={`translate(${W * cx + float(f, 12, 0.02, i)} ${H * cy}) scale(${s})`} opacity={night ? 0.25 : 0.95}>
        <ellipse cx={0} cy={0} rx={60} ry={30} fill="#fff" />
        <ellipse cx={46} cy={8} rx={42} ry={23} fill="#fff" />
        <ellipse cx={-44} cy={10} rx={38} ry={21} fill="#fff" />
      </g>
    ))}
  </>
);

// Upright round mascot. cx,cy = center of head area.
export const Mascot: React.FC<{
  f: number; x: number; y: number; scale?: number; expr?: Expr;
  cape?: boolean; armsUp?: boolean; lookUp?: boolean;
}> = ({ f, x, y, scale = 1, expr = 'happy', cape = false, armsUp = false, lookUp = false }) => {
  const bob = float(f, 6, 0.05);
  const b = blink(f);
  const eyeY = lookUp ? -6 : 0;

  const eyes = () => {
    if (expr === 'sleepy') return (
      <>
        <path d="M -34 -6 Q -24 4 -14 -6" stroke="#2b2b3a" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M 14 -6 Q 24 4 34 -6" stroke="#2b2b3a" strokeWidth={5} fill="none" strokeLinecap="round" />
      </>
    );
    if (expr === 'happy') return (
      <>
        <path d="M -34 -2 Q -24 -14 -14 -2" stroke="#2b2b3a" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M 14 -2 Q 24 -14 34 -2" stroke="#2b2b3a" strokeWidth={5} fill="none" strokeLinecap="round" />
      </>
    );
    const r = expr === 'curious' || expr === 'wow' ? 9 : 7;
    return (
      <>
        <ellipse cx={-24} cy={-2 + eyeY} rx={r} ry={r * b} fill="#2b2b3a" />
        <ellipse cx={24} cy={-2 + eyeY} rx={r} ry={r * b} fill="#2b2b3a" />
        <circle cx={-21} cy={-5 + eyeY} r={2.5} fill="#fff" />
        <circle cx={27} cy={-5 + eyeY} r={2.5} fill="#fff" />
      </>
    );
  };
  const mouth = () => {
    if (expr === 'wow') return <ellipse cx={0} cy={26} rx={10} ry={13} fill="#c2606a" />;
    if (expr === 'sleepy' || expr === 'calm') return <path d="M -12 24 Q 0 32 12 24" stroke="#2b2b3a" strokeWidth={4} fill="none" strokeLinecap="round" />;
    return <path d="M -16 22 Q 0 38 16 22" stroke="#2b2b3a" strokeWidth={4.5} fill="none" strokeLinecap="round" />;
  };

  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
      {cape && <path d="M -40 30 Q -90 60 -70 130 Q -30 100 -6 70 Z" fill="#e0483c" />}
      {/* feet */}
      <ellipse cx={-34} cy={140} rx={26} ry={18} fill="#fdfdfd" stroke="#2b2b3a" strokeWidth={5} />
      <ellipse cx={34} cy={140} rx={26} ry={18} fill="#fdfdfd" stroke="#2b2b3a" strokeWidth={5} />
      {/* body (rounded egg) */}
      <path d="M -86 70 Q -96 -110 0 -110 Q 96 -110 86 70 Q 50 130 0 130 Q -50 130 -86 70 Z"
        fill="#fdfdfd" stroke="#2b2b3a" strokeWidth={6} />
      {/* arms */}
      {armsUp ? (
        <>
          <path d="M -78 0 Q -110 -50 -86 -78" stroke="#fdfdfd" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M -78 0 Q -110 -50 -86 -78" stroke="#2b2b3a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0} />
          <path d="M 78 0 Q 110 -50 86 -78" stroke="#fdfdfd" strokeWidth={22} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M -82 10 Q -104 40 -88 66" stroke="#fdfdfd" strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M 82 10 Q 104 40 88 66" stroke="#fdfdfd" strokeWidth={22} fill="none" strokeLinecap="round" />
        </>
      )}
      {/* face */}
      <g transform="translate(0 -28)">
        {eyes()}
        {mouth()}
        <circle cx={-44} cy={18} r={14} fill="#ffb4b4" opacity={0.6} />
        <circle cx={44} cy={18} r={14} fill="#ffb4b4" opacity={0.6} />
      </g>
      {/* superhero headband + emblem */}
      {cape && (
        <>
          <rect x={-58} y={-92} width={116} height={16} rx={6} fill="#26262f" transform="translate(0 -28)" />
          <path d="M -8 22 L 8 22 L 1 44 Z" fill="#f2c14e" />
        </>
      )}
    </g>
  );
};

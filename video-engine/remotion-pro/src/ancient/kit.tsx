import React from 'react';
import { interpolate, Easing } from 'remotion';

// ── Cinematic palette (warm, muted, documentary) ──
export const C = {
  night: '#1a1410',
  duskTop: '#3a2f4a',
  duskMid: '#7a5a6a',
  duskLow: '#c98a5a',
  earth: '#caa46a',
  earthDark: '#8a6a3a',
  skin: '#e0a87a',
  skinDark: '#b07a4a',
  stone: '#d8c8a8',
  stoneDark: '#a89878',
  fire: '#ff8c3a',
  fireCore: '#ffd23f',
  gold: '#e8b54a',
  teal: '#5aa89a',
  blood: '#b04a3a',
  ink: '#2a2018',
  cream: '#f5ecd8',
  green: '#6a9a5a',
  greenDark: '#4a7a3a',
  sky: '#bcd8e8',
};

const SMOOTH = Easing.bezier(0.22, 1, 0.36, 1);

export const ramp = (f: number, s: number, d: number, a: number, b: number) =>
  interpolate(f, [s, s + d], [a, b], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SMOOTH });

export const fadeInOut = (f: number, total: number, fade = 18) =>
  interpolate(f, [0, fade, total - fade, total], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

export const float = (f: number, amp = 6, sp = 0.04, ph = 0) => Math.sin(f * sp + ph) * amp;

// Slow cinematic push-in (subtle zoom). Returns a scale value.
export const slowZoom = (f: number, total: number, from = 1, to = 1.08) =>
  interpolate(f, [0, total], [from, to], { extrapolateRight: 'clamp', easing: Easing.linear });

// ── Reusable defs ──
export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.duskTop} />
      <stop offset="55%" stopColor={C.duskMid} />
      <stop offset="100%" stopColor={C.duskLow} />
    </linearGradient>
    <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0d0b14" />
      <stop offset="100%" stopColor="#2a2030" />
    </linearGradient>
    <linearGradient id="day" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#add2e6" />
      <stop offset="100%" stopColor="#e8d2a8" />
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.earth} />
      <stop offset="100%" stopColor={C.earthDark} />
    </linearGradient>
    <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.stone} />
      <stop offset="100%" stopColor={C.stoneDark} />
    </linearGradient>
    <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffcf6a" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#ffcf6a" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
    </radialGradient>
  </defs>
);

// ── A heavier human figure (the recurring motif) ──
export const HeavyFigure: React.FC<{ x: number; y: number; scale?: number; fill?: string }> = ({
  x, y, scale = 1, fill = C.skin,
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {/* legs */}
    <path d="M -34 60 Q -44 110 -30 150 L -6 150 Q -14 110 -10 64 Z" fill={fill} />
    <path d="M 34 60 Q 44 110 30 150 L 6 150 Q 14 110 10 64 Z" fill={fill} />
    {/* big rounded torso */}
    <ellipse cx="0" cy="0" rx="70" ry="86" fill={fill} />
    {/* belly shading */}
    <ellipse cx="0" cy="18" rx="52" ry="56" fill={C.skinDark} opacity={0.25} />
    {/* breasts (Venus motif) */}
    <circle cx="-26" cy="-30" r="24" fill={fill} />
    <circle cx="26" cy="-30" r="24" fill={fill} />
    {/* arms */}
    <path d="M -66 -34 Q -96 6 -78 54" stroke={fill} strokeWidth="26" fill="none" strokeLinecap="round" />
    <path d="M 66 -34 Q 96 6 78 54" stroke={fill} strokeWidth="26" fill="none" strokeLinecap="round" />
    {/* head */}
    <circle cx="0" cy="-104" r="34" fill={fill} />
  </g>
);

// ── Lean hunter silhouette ──
export const LeanHunter: React.FC<{ x: number; y: number; scale?: number; fill?: string; stride?: number }> = ({
  x, y, scale = 1, fill = C.ink, stride = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <circle cx="0" cy="-86" r="17" fill={fill} />
    <path d="M -4 -70 L 4 -70 L 8 0 L -8 0 Z" fill={fill} />
    {/* legs striding */}
    <path d={`M -4 0 L ${-18 - stride} 60`} stroke={fill} strokeWidth="9" strokeLinecap="round" />
    <path d={`M 4 0 L ${18 + stride} 60`} stroke={fill} strokeWidth="9" strokeLinecap="round" />
    {/* arms + spear */}
    <path d={`M 0 -50 L ${26 + stride} -34`} stroke={fill} strokeWidth="8" strokeLinecap="round" />
    <line x1={26 + stride} y1="-70" x2={26 + stride} y2="20" stroke={C.earthDark} strokeWidth="5" />
  </g>
);

// ── Venus of Willendorf figurine ──
export const Venus: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {/* body */}
    <ellipse cx="0" cy="20" rx="60" ry="80" fill="url(#stoneGrad)" />
    <circle cx="-24" cy="-22" r="22" fill="url(#stoneGrad)" />
    <circle cx="24" cy="-22" r="22" fill="url(#stoneGrad)" />
    <path d="M -48 60 Q -40 130 -16 140 L 0 140 L 0 60 Z" fill="url(#stoneGrad)" />
    <path d="M 48 60 Q 40 130 16 140 L 0 140 L 0 60 Z" fill="url(#stoneGrad)" />
    {/* head with braided texture */}
    <circle cx="0" cy="-80" r="30" fill={C.stoneDark} />
    {Array.from({ length: 6 }).map((_, i) => (
      <circle key={i} cx={-22 + (i % 3) * 22} cy={-96 + Math.floor(i / 3) * 20} r="8" fill={C.stone} opacity={0.6} />
    ))}
    {/* carved shading */}
    <ellipse cx="0" cy="34" rx="40" ry="44" fill={C.stoneDark} opacity={0.3} />
  </g>
);

// ── Fire ──
export const Fire: React.FC<{ x: number; y: number; frame: number; scale?: number }> = ({ x, y, frame, scale = 1 }) => {
  const flick = 1 + Math.sin(frame * 0.5) * 0.12;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r={120 * flick} fill="url(#fireGlow)" />
      <path d={`M 0 ${-50 * flick} Q -22 -10 -16 14 Q -2 24 0 24 Q 2 24 16 14 Q 22 -10 0 ${-50 * flick} Z`} fill={C.fire} />
      <path d={`M 0 ${-30 * flick} Q -10 -6 -6 10 Q 0 16 0 16 Q 6 14 6 10 Q 10 -6 0 ${-30 * flick} Z`} fill={C.fireCore} />
      {/* logs */}
      <rect x="-30" y="20" width="60" height="9" rx="4" fill={C.earthDark} transform="rotate(8)" />
      <rect x="-30" y="20" width="60" height="9" rx="4" fill={C.ink} transform="rotate(-12)" />
    </g>
  );
};

// ── Rolling hills (layered) ──
export const Hills: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <>
    <path d={`M0 ${h} L0 ${h * 0.72} Q ${w * 0.3} ${h * 0.6} ${w * 0.55} ${h * 0.68} Q ${w * 0.8} ${h * 0.76} ${w} ${h * 0.64} L${w} ${h} Z`} fill={C.earthDark} opacity={0.7} />
    <path d={`M0 ${h} L0 ${h * 0.82} Q ${w * 0.25} ${h * 0.74} ${w * 0.5} ${h * 0.8} Q ${w * 0.75} ${h * 0.86} ${w} ${h * 0.78} L${w} ${h} Z`} fill="url(#ground)" />
  </>
);

// Vignette overlay for cinematic depth
export const Vignette: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <rect width={w} height={h} fill="url(#vignette)" />
);

// Drifting star/dust particles
export const Dust: React.FC<{ frame: number; w: number; h: number; n?: number }> = ({ frame, w, h, n = 18 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const seed = i * 137.5;
      const x = (seed * 3 + frame * (0.2 + (i % 3) * 0.1)) % w;
      const y = (seed * 1.7) % h;
      const op = 0.1 + (Math.sin(frame * 0.03 + i) + 1) * 0.12;
      return <circle key={i} cx={x} cy={y} r={1.6 + (i % 3)} fill="#fff" opacity={op} />;
    })}
  </>
);

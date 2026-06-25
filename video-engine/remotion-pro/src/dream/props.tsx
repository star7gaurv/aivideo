import React from 'react';
import { float } from './mascot';

// Shared line-art style — thick consistent outlines, the #1 "drawn, not emoji" tell.
const OUT = '#2b2b3a';

type PropProps = { x: number; y: number; scale?: number; f?: number; phase?: number; amp?: number };

// Wrapper that gives every prop a gentle idle float so nothing sits dead-still.
const Floater: React.FC<PropProps & { children: React.ReactNode; rot?: number }> = ({
  x, y, scale = 1, f = 0, phase = 0, amp = 10, rot = 0, children,
}) => (
  <g transform={`translate(${x} ${y + float(f, amp, 0.045, phase)}) rotate(${rot}) scale(${scale})`}>
    {children}
  </g>
);

// 💡 → hand-drawn lightbulb with glow + filament + screw base
export const Lightbulb: React.FC<PropProps> = (p) => (
  <Floater {...p}>
    <circle cx={0} cy={-4} r={46} fill="#fff3b0" opacity={0.45} />
    <circle cx={0} cy={-6} r={30} fill="#ffe16b" stroke={OUT} strokeWidth={6} />
    <path d="M -9 -8 Q 0 6 9 -8" stroke="#c79a2e" strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <rect x={-13} y={20} width={26} height={18} rx={4} fill="#d3d3dc" stroke={OUT} strokeWidth={5} />
    <line x1={-11} y1={27} x2={11} y2={27} stroke={OUT} strokeWidth={3} />
    <line x1={-11} y1={32} x2={11} y2={32} stroke={OUT} strokeWidth={3} />
  </Floater>
);

// ⭐ → 5-point star
const starPath = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 30 : 13;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
})();
export const Star: React.FC<PropProps> = (p) => (
  <Floater {...p} rot={8}>
    <path d={starPath} fill="#ffd24a" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
  </Floater>
);

// ✨ → 4-point sparkle
export const Sparkle: React.FC<PropProps> = (p) => (
  <Floater {...p} amp={14}>
    <path d="M 0 -26 Q 4 -4 26 0 Q 4 4 0 26 Q -4 4 -26 0 Q -4 -4 0 -26 Z"
      fill="#fff4b8" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
  </Floater>
);

// 🔭 → telescope on a tripod
export const Telescope: React.FC<PropProps> = (p) => (
  <Floater {...p} amp={6}>
    {/* tripod */}
    <line x1={0} y1={6} x2={-22} y2={44} stroke={OUT} strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={6} x2={22} y2={44} stroke={OUT} strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={6} x2={2} y2={46} stroke={OUT} strokeWidth={6} strokeLinecap="round" />
    {/* tube */}
    <g transform="rotate(-28)">
      <rect x={-34} y={-16} width={68} height={26} rx={13} fill="#7c6ff0" stroke={OUT} strokeWidth={5} />
      <rect x={28} y={-19} width={18} height={32} rx={6} fill="#9b90f5" stroke={OUT} strokeWidth={5} />
      <circle cx={-30} cy={-3} r={6} fill="#cfc8ff" />
    </g>
  </Floater>
);

// 🎨 → painter's palette with dabs
export const Palette: React.FC<PropProps> = (p) => (
  <Floater {...p} rot={-6}>
    <path d="M -36 -8 Q -36 -34 0 -34 Q 38 -34 38 -2 Q 38 22 10 26 Q 18 12 4 10 Q -10 8 -10 22 Q -10 32 -2 34 Q -36 30 -36 -8 Z"
      fill="#fef2e0" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={-18} cy={-16} r={6} fill="#ff6b81" />
    <circle cx={2} cy={-22} r={6} fill="#4aa3ff" />
    <circle cx={20} cy={-12} r={6} fill="#ffd24a" />
    <circle cx={22} cy={6} r={6} fill="#5fd08a" />
  </Floater>
);

// ❤ → heart
export const Heart: React.FC<PropProps & { color?: string; opacity?: number }> = ({ color = '#ff6b81', opacity = 1, ...p }) => (
  <Floater {...p} amp={0}>
    <g opacity={opacity}>
      <path d="M 0 12 C -10 -8 -34 -2 -22 16 C -14 28 0 34 0 34 C 0 34 14 28 22 16 C 34 -2 10 -8 0 12 Z"
        fill={color} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
    </g>
  </Floater>
);

// Soft ground shadow — anchors a character/prop to the floor instead of floating in void.
export const GroundShadow: React.FC<{ x: number; y: number; rx?: number; ry?: number; opacity?: number }> = ({
  x, y, rx = 120, ry = 26, opacity = 0.16,
}) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#1a1430" opacity={opacity} />;

import React from 'react';
import { floaty } from './anim';

// Shared gradient/filter defs — include once per <svg>.
export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="skyWarm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffd56b" />
      <stop offset="38%" stopColor="#ff9e5e" />
      <stop offset="100%" stopColor="#7b4ea3" />
    </linearGradient>
    <linearGradient id="skyGrey" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#8a93a6" />
      <stop offset="60%" stopColor="#6b7488" />
      <stop offset="100%" stopColor="#4a5165" />
    </linearGradient>
    <linearGradient id="skyClean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#aee3ff" />
      <stop offset="100%" stopColor="#5fb8f0" />
    </linearGradient>
    <linearGradient id="skyHope" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffe49c" />
      <stop offset="45%" stopColor="#ff9e5e" />
      <stop offset="100%" stopColor="#6a4aa0" />
    </linearGradient>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#fff6d6" />
      <stop offset="55%" stopColor="#ffd23f" />
      <stop offset="100%" stopColor="#ffac33" />
    </radialGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffe49c" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#ffe49c" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#9b6bc4" />
      <stop offset="100%" stopColor="#7b4ea3" />
    </linearGradient>
    <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5a3d82" />
      <stop offset="100%" stopColor="#422d63" />
    </linearGradient>
    <linearGradient id="hillGreen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7bc47f" />
      <stop offset="100%" stopColor="#4a9e5c" />
    </linearGradient>
    <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7fd1ff" />
      <stop offset="100%" stopColor="#3b82f6" />
    </linearGradient>
    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#34d399" />
      <stop offset="100%" stopColor="#059669" />
    </linearGradient>
  </defs>
);

export const Sun: React.FC<{
  cx: number; cy: number; scale?: number; rayRotate?: number;
  glowPulse?: number; face?: boolean;
}> = ({ cx, cy, scale = 1, rayRotate = 0, glowPulse = 1, face = true }) => (
  <>
    <circle cx={cx} cy={cy} r={340 * glowPulse} fill="url(#sunGlow)" />
    <g transform={`translate(${cx}, ${cy}) rotate(${rayRotate}) scale(${scale})`}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.cos(a) * 165} y1={Math.sin(a) * 165}
            x2={Math.cos(a) * 230} y2={Math.sin(a) * 230}
            stroke="#ffd23f" strokeWidth={14} strokeLinecap="round"
          />
        );
      })}
    </g>
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <circle r={140} fill="url(#sunGrad)" />
      {face && (
        <>
          <circle cx={-46} cy={-18} r={15} fill="#4a2c00" />
          <circle cx={46} cy={-18} r={15} fill="#4a2c00" />
          <circle cx={-41} cy={-23} r={5} fill="#fff" />
          <circle cx={51} cy={-23} r={5} fill="#fff" />
          <circle cx={-72} cy={22} r={18} fill="#ff8c42" opacity={0.55} />
          <circle cx={72} cy={22} r={18} fill="#ff8c42" opacity={0.55} />
          <path d="M -42 30 Q 0 72 42 30" stroke="#4a2c00" strokeWidth={11} fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  </>
);

export const House: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <rect x={-60} y={-90} width={120} height={110} rx={8} fill="#fef3e2" />
    <path d="M -75 -88 L 0 -150 L 75 -88 Z" fill="#e06650" />
    <rect x={-22} y={-50} width={44} height={70} rx={4} fill="#8b5e34" />
    <circle cx={10} cy={-15} r={4} fill="#ffd23f" />
  </g>
);

export const Panel: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <rect x={-5} y={0} width={10} height={70} fill="#3a3a4a" />
    <rect x={-26} y={66} width={52} height={9} rx={4} fill="#2a2a38" />
    <g transform="rotate(-18)">
      <rect x={-78} y={-52} width={156} height={94} rx={7} fill="url(#panelGrad)" />
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={-71 + c * 37} y={-45 + r * 30}
            width={32} height={26} rx={2} fill="#2a5fb0" opacity={0.5} />
        ))
      )}
      <path d="M -78 -52 L -20 -52 L -78 20 Z" fill="#fff" opacity={0.12} />
    </g>
  </g>
);

export const Cloud: React.FC<{ x: number; y: number; opacity?: number; scale?: number }> = ({
  x, y, opacity = 0.85, scale = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
    <ellipse cx={0} cy={0} rx={70} ry={34} fill="#fff" />
    <ellipse cx={55} cy={8} rx={50} ry={26} fill="#fff" />
    <ellipse cx={-50} cy={10} rx={44} ry={24} fill="#fff" />
  </g>
);

// Animated smoke puff (for the pollution scene)
export const Smoke: React.FC<{ x: number; baseY: number; frame: number; i: number }> = ({
  x, baseY, frame, i,
}) => {
  const t = ((frame + i * 22) % 90) / 90;
  const y = baseY - t * 220;
  const op = Math.sin(t * Math.PI) * 0.5;
  const s = 0.5 + t * 1.1;
  return <circle cx={x + floaty(frame, 14, 0.05, i)} cy={y} r={26 * s} fill="#cfd4dd" opacity={op} />;
};

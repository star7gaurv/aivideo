import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

// Simple-mascot flat-cartoon style proof (the "Why Do We Dream?" look).
const float = (f: number, amp = 8, sp = 0.05, ph = 0) => Math.sin(f * sp + ph) * amp;

export const DreamProof: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const breathe = 1 + Math.sin(f * 0.06) * 0.018;
  const haloPulse = 1 + Math.sin(f * 0.04) * 0.04;
  const zzz = (i: number) => {
    const t = ((f + i * 30) % 90) / 90;
    return { y: -t * 90, opacity: Math.sin(t * Math.PI), scale: 0.6 + t * 0.5 };
  };

  return (
    <AbsoluteFill style={{ background: '#ffffff' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="halo" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fff4fb" />
            <stop offset="40%" stopColor="#d9e8ff" />
            <stop offset="70%" stopColor="#e7d9ff" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="couch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6b89e" />
            <stop offset="100%" stopColor="#e89a7e" />
          </linearGradient>
          <linearGradient id="pj" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9fd0f0" />
            <stop offset="100%" stopColor="#6fb3e0" />
          </linearGradient>
        </defs>

        {/* soft dreamy halo */}
        <g transform={`translate(${W * 0.62} ${H * 0.42}) scale(${haloPulse})`}>
          <circle r={420} fill="url(#halo)" />
        </g>

        {/* twinkle stars */}
        {Array.from({ length: 22 }).map((_, i) => {
          const x = W * 0.38 + (i * 97) % (W * 0.55);
          const y = H * 0.12 + (i * 137) % (H * 0.6);
          const tw = 0.3 + (Math.sin(f * 0.08 + i) + 1) * 0.35;
          return <circle key={i} cx={x} cy={y} r={2.5 + (i % 3)} fill="#c9a0ff" opacity={tw} />;
        })}

        {/* clouds */}
        {[[0.5, 0.3, 1], [0.78, 0.22, 0.7], [0.86, 0.45, 0.85]].map(([cx, cy, s], i) => (
          <g key={i} transform={`translate(${W * cx + float(f, 10, 0.02, i)} ${H * cy}) scale(${s})`}>
            <ellipse cx={0} cy={0} rx={62} ry={30} fill="#fff" />
            <ellipse cx={48} cy={8} rx={44} ry={24} fill="#fff" />
            <ellipse cx={-46} cy={10} rx={40} ry={22} fill="#fff" />
          </g>
        ))}

        {/* couch */}
        <g transform={`translate(${W * 0.6} ${H * 0.66})`}>
          <ellipse cx={0} cy={210} rx={420} ry={40} fill="#000" opacity={0.06} />
          <rect x={-380} y={40} width={760} height={150} rx={40} fill="url(#couch)" />
          <rect x={-400} y={-40} width={90} height={210} rx={40} fill="url(#couch)" />
          <rect x={310} y={-40} width={90} height={210} rx={40} fill="url(#couch)" />
          <rect x={-300} y={20} width={600} height={70} rx={30} fill="#f3a98c" />
          <rect x={-44} y={188} width={28} height={40} rx={8} fill="#7a4a32" />
          <rect x={16} y={188} width={28} height={40} rx={8} fill="#7a4a32" />
        </g>

        {/* sleeping mascot: big rounded white body lying down */}
        <g transform={`translate(${W * 0.62} ${H * 0.55}) scale(${breathe})`}>
          {/* striped pajama legs */}
          <g transform="translate(-150 70)">
            <rect x={-90} y={0} width={150} height={70} rx={34} fill="url(#pj)" />
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={-86 + i * 26} y={2} width={12} height={66} fill="#ffffff" opacity={0.5} />
            ))}
            <ellipse cx={-92} cy={36} rx={26} ry={20} fill="#fff" />
            <ellipse cx={66} cy={40} rx={24} ry={18} fill="#fff" />
          </g>
          {/* body */}
          <path d="M -180 40 Q -200 -150 40 -150 Q 240 -150 220 60 Q 160 110 -120 100 Z" fill="#fdfdfd" stroke="#2b2b3a" strokeWidth={6} />
          {/* sleep mask band */}
          <path d="M -150 -70 Q 40 -120 215 -55 L 205 5 Q 40 -55 -160 -10 Z" fill="#26262f" />
          <circle cx={120} cy={-40} r={20} fill="#f2c14e" stroke="#caa033" strokeWidth={3} />
          <line x1={120} y1={-40} x2={120} y2={-52} stroke="#7a5a18" strokeWidth={3} />
          <line x1={120} y1={-40} x2={130} y2={-40} stroke="#7a5a18" strokeWidth={3} />
          {/* sleepy closed eyes (under mask edge) + smile + blush */}
          <path d="M 0 24 Q 16 40 32 24" stroke="#2b2b3a" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={-10} cy={48} r={16} fill="#ffb4b4" opacity={0.6} />
          <circle cx={70} cy={44} r={16} fill="#ffb4b4" opacity={0.6} />
        </g>

        {/* Zzz */}
        {[0, 1, 2].map((i) => {
          const z = zzz(i);
          return (
            <text key={i} x={W * 0.6 + i * 34} y={H * 0.38 + z.y} fontSize={38 + i * 10}
              fill="#8a8ab0" opacity={z.opacity} fontFamily="Inter" fontWeight={800}
              transform={`scale(${z.scale})`} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>z</text>
          );
        })}

        {/* tiny flying superhero mascot */}
        <g transform={`translate(${W * 0.6 + float(f, 14, 0.05)} ${H * 0.2 + float(f, 8, 0.07)}) rotate(-8)`}>
          {/* cape */}
          <path d="M -8 6 Q -40 20 -30 54 Q -10 40 4 30 Z" fill="#e0483c" />
          {/* body */}
          <rect x={-22} y={6} width={44} height={48} rx={18} fill="#4aa3e8" />
          <path d="M -4 18 L 6 18 L 1 30 Z" fill="#f2c14e" />
          {/* head */}
          <circle cx={0} cy={-8} r={26} fill="#fdfdfd" stroke="#2b2b3a" strokeWidth={4} />
          <rect x={-26} y={-16} width={52} height={9} rx={4} fill="#26262f" />
          <circle cx={-9} cy={2} r={3.5} fill="#2b2b3a" />
          <circle cx={9} cy={2} r={3.5} fill="#2b2b3a" />
          <path d="M -6 10 Q 0 15 6 10" stroke="#2b2b3a" strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* arms out */}
          <rect x={20} y={14} width={26} height={11} rx={5} fill="#fdfdfd" stroke="#2b2b3a" strokeWidth={3} transform="rotate(-20 20 14)" />
        </g>
      </svg>

      {/* title */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 120 }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, lineHeight: 1.05 }}>
          <div style={{ fontSize: 96, color: '#1a1a1a' }}>WHY</div>
          <div style={{ fontSize: 96, color: '#1a1a1a' }}>DO WE</div>
          <div style={{ fontSize: 96, color: '#e0322a' }}>DREAM?</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

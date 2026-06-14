import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

// Flat-illustration solar scene — Kurzgesagt-inspired.
// Everything is hand-authored vector art with depth, gradients, and eased motion.

export const SolarHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Sun rises with a spring (overshoot for life)
  const sunRise = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const sunY = interpolate(sunRise, [0, 1], [620, 360]);
  const sunScale = interpolate(sunRise, [0, 1], [0.6, 1]);

  // Continuous gentle ray rotation
  const rayRotate = (frame / fps) * 12; // deg/sec

  // Sun breathing glow
  const glowPulse = 1 + Math.sin(frame / 12) * 0.04;

  // Hills slide up
  const hillRise = interpolate(frame, [8, 38], [120, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Houses + panels pop in (staggered)
  const popIn = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.6 } });

  // Energy particles rising from panels
  const particle = (i: number) => {
    const t = ((frame + i * 14) % 70) / 70;
    return {
      y: interpolate(t, [0, 1], [0, -160]),
      opacity: interpolate(t, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
    };
  };

  // Title fade + lift
  const titleProg = spring({ frame: frame - 45, fps, config: { damping: 16 } });
  const titleY = interpolate(titleProg, [0, 1], [40, 0]);

  // Clouds drift
  const cloudX = (speed: number, base: number) =>
    ((base + (frame / fps) * speed) % (width + 400)) - 200;

  return (
    <AbsoluteFill>
      {/* ── Sky gradient ── */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd56b" />
            <stop offset="38%" stopColor="#ff9e5e" />
            <stop offset="100%" stopColor="#7b4ea3" />
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
          <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7fd1ff" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width={width} height={height} fill="url(#sky)" />

        {/* ── Sun glow ── */}
        <circle
          cx={width / 2}
          cy={sunY}
          r={340 * glowPulse}
          fill="url(#sunGlow)"
        />

        {/* ── Sun rays ── */}
        <g
          transform={`translate(${width / 2}, ${sunY}) rotate(${rayRotate}) scale(${sunScale})`}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r1 = 165;
            const r2 = 230;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r1}
                y1={Math.sin(a) * r1}
                x2={Math.cos(a) * r2}
                y2={Math.sin(a) * r2}
                stroke="#ffd23f"
                strokeWidth={14}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ── Sun body with face ── */}
        <g transform={`translate(${width / 2}, ${sunY}) scale(${sunScale})`}>
          <circle r={140} fill="url(#sunGrad)" />
          {/* eyes */}
          <circle cx={-46} cy={-18} r={15} fill="#4a2c00" />
          <circle cx={46} cy={-18} r={15} fill="#4a2c00" />
          {/* eye sparkle */}
          <circle cx={-41} cy={-23} r={5} fill="#fff" />
          <circle cx={51} cy={-23} r={5} fill="#fff" />
          {/* cheeks */}
          <circle cx={-72} cy={22} r={18} fill="#ff8c42" opacity={0.55} />
          <circle cx={72} cy={22} r={18} fill="#ff8c42" opacity={0.55} />
          {/* smile */}
          <path
            d="M -42 30 Q 0 72 42 30"
            stroke="#4a2c00"
            strokeWidth={11}
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ── Back hill ── */}
        <path
          transform={`translate(0, ${hillRise})`}
          d={`M0 ${height} L0 760 Q ${width * 0.3} 640 ${width * 0.55} 720 Q ${width * 0.8} 800 ${width} 690 L${width} ${height} Z`}
          fill="url(#hillBack)"
        />

        {/* ── Front hill ── */}
        <path
          transform={`translate(0, ${hillRise * 0.6})`}
          d={`M0 ${height} L0 880 Q ${width * 0.25} 800 ${width * 0.5} 860 Q ${width * 0.75} 920 ${width} 840 L${width} ${height} Z`}
          fill="url(#hillFront)"
        />

        {/* ── Houses ── */}
        {[
          { x: width * 0.14, delay: 50, s: 1 },
          { x: width * 0.86, delay: 62, s: 0.9 },
        ].map((h, i) => {
          const p = popIn(h.delay);
          const sc = interpolate(p, [0, 1], [0, h.s]);
          return (
            <g key={i} transform={`translate(${h.x}, 900) scale(${sc})`} style={{ transformBox: 'fill-box' }}>
              <rect x={-60} y={-90} width={120} height={110} rx={8} fill="#fef3e2" />
              <path d="M -75 -88 L 0 -150 L 75 -88 Z" fill="#e06650" />
              <rect x={-22} y={-50} width={44} height={70} rx={4} fill="#8b5e34" />
              <circle cx={10} cy={-15} r={4} fill="#ffd23f" />
            </g>
          );
        })}

        {/* ── Solar panels + energy particles (flanking, clear of title) ── */}
        {[
          { x: width * 0.30, delay: 70 },
          { x: width * 0.70, delay: 80 },
        ].map((pnl, i) => {
          const p = popIn(pnl.delay);
          const sc = interpolate(p, [0, 1], [0, 1.35]);
          return (
            <g key={i}>
              <g transform={`translate(${pnl.x}, 935) scale(${sc})`}>
                {/* stand */}
                <rect x={-5} y={0} width={10} height={70} fill="#3a3a4a" />
                <rect x={-26} y={66} width={52} height={9} rx={4} fill="#2a2a38" />
                {/* tilted panel */}
                <g transform="rotate(-18)">
                  <rect x={-78} y={-52} width={156} height={94} rx={7} fill="url(#panelGrad)" />
                  {Array.from({ length: 3 }).map((_, r) =>
                    Array.from({ length: 4 }).map((_, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={-71 + c * 37}
                        y={-45 + r * 30}
                        width={32}
                        height={26}
                        rx={2}
                        fill="#2a5fb0"
                        opacity={0.5}
                      />
                    ))
                  )}
                  {/* glossy shine */}
                  <path d="M -78 -52 L -20 -52 L -78 20 Z" fill="#fff" opacity={0.12} />
                </g>
              </g>
              {/* rising energy particles */}
              {Array.from({ length: 4 }).map((_, k) => {
                const pt = particle(i * 4 + k);
                return (
                  <circle
                    key={k}
                    cx={pnl.x - 24 + k * 16}
                    cy={840 + pt.y}
                    r={9}
                    fill="#bff7d0"
                    opacity={pt.opacity * sc}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ── Clouds ── */}
        <g opacity={0.85}>
          <g transform={`translate(${cloudX(18, 200)}, 180)`}>
            <ellipse cx={0} cy={0} rx={70} ry={34} fill="#fff" opacity={0.85} />
            <ellipse cx={55} cy={8} rx={50} ry={26} fill="#fff" opacity={0.85} />
            <ellipse cx={-50} cy={10} rx={44} ry={24} fill="#fff" opacity={0.85} />
          </g>
          <g transform={`translate(${cloudX(11, 900)}, 290)`}>
            <ellipse cx={0} cy={0} rx={55} ry={28} fill="#fff" opacity={0.7} />
            <ellipse cx={42} cy={6} rx={40} ry={21} fill="#fff" opacity={0.7} />
          </g>
        </g>
      </svg>

      {/* ── Title ── */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 110,
        }}
      >
        <div
          style={{
            opacity: titleProg,
            transform: `translateY(${titleY}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              fontSize: 96,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 6px 24px rgba(0,0,0,0.35)',
              lineHeight: 1,
            }}
          >
            सौर ऊर्जा
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 34,
              fontWeight: 500,
              color: '#fff4dc',
              marginTop: 14,
              letterSpacing: 1,
            }}
          >
            सूरज से चलने वाला कल
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

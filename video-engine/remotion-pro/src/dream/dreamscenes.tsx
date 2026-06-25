import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { DreamBg, Mascot, float, ramp, sceneFade } from './mascot';
import { Lightbulb, Star, Sparkle, Telescope, Palette, Heart, GroundShadow } from './props';

type P = { total: number };
const Wrap: React.FC<{ total: number; children: React.ReactNode }> = ({ total, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: sceneFade(f, total) }}>{children}</AbsoluteFill>;
};

// High-contrast caption: white fill + dark outline (paint-order stroke) over a soft bottom scrim.
// Reads cleanly on light OR dark scenes — replaces the old low-contrast translucent text.
const Cap: React.FC<{ text: string; sub?: string; at?: number; f: number; size?: number }> =
  ({ text, sub, at = 8, f, size = 60 }) => {
    const op = ramp(f, at, 24, 0, 1); const ty = ramp(f, at, 28, 26, 0);
    return (
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '32%', background: 'linear-gradient(to top, rgba(18,14,38,0.5), rgba(18,14,38,0))' }} />
        <div style={{ opacity: op, transform: `translateY(${ty}px)`, textAlign: 'center', maxWidth: '84%', paddingBottom: 78 }}>
          <div style={{
            fontFamily: 'Inter,sans-serif', fontSize: size, fontWeight: 900, color: '#ffffff',
            lineHeight: 1.12, letterSpacing: '-0.5px',
            WebkitTextStroke: '6px #2b2b3a', paintOrder: 'stroke fill' as any,
            textShadow: '0 6px 22px rgba(0,0,0,0.45)',
          }}>{text}</div>
          {sub && <div style={{
            fontFamily: 'Inter,sans-serif', fontSize: size * 0.46, fontWeight: 800, color: '#ffe6a8',
            marginTop: 14, WebkitTextStroke: '4px #2b2b3a', paintOrder: 'stroke fill' as any,
            textShadow: '0 4px 14px rgba(0,0,0,0.5)',
          }}>{sub}</div>}
        </div>
      </AbsoluteFill>
    );
  };

// 1 — Title: sleeping mascot on couch
export const title: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const breathe = 1 + Math.sin(f * 0.06) * 0.02;
  const zzz = (i: number) => { const t = ((f + i * 30) % 90) / 90; return { y: -t * 80, o: Math.sin(t * Math.PI) }; };
  return (
    <Wrap total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <DreamBg f={f} W={W} H={H} />
        {/* couch */}
        <g transform={`translate(${W / 2} ${H * 0.6})`}>
          <ellipse cx={0} cy={200} rx={430} ry={40} fill="#000" opacity={0.08} />
          <rect x={-390} y={40} width={780} height={150} rx={42} fill="#f0a98e" />
          <rect x={-410} y={-40} width={92} height={210} rx={42} fill="#f0a98e" />
          <rect x={318} y={-40} width={92} height={210} rx={42} fill="#f0a98e" />
          <rect x={-300} y={18} width={600} height={70} rx={30} fill="#f6b89e" />
        </g>
        {/* sleeping mascot */}
        <g transform={`translate(${W / 2} ${H * 0.5}) scale(${breathe})`}>
          <path d="M -180 40 Q -200 -150 40 -150 Q 240 -150 220 60 Q 160 110 -120 100 Z" fill="#fdfdfd" stroke="#2b2b3a" strokeWidth={6} />
          <path d="M -150 -70 Q 40 -120 215 -55 L 205 5 Q 40 -55 -160 -10 Z" fill="#26262f" />
          <circle cx={120} cy={-40} r={20} fill="#f2c14e" stroke="#caa033" strokeWidth={3} />
          <path d="M 0 24 Q 16 40 32 24" stroke="#2b2b3a" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={-10} cy={48} r={16} fill="#ffb4b4" opacity={0.6} />
          <circle cx={70} cy={44} r={16} fill="#ffb4b4" opacity={0.6} />
        </g>
        {[0, 1, 2].map(i => { const z = zzz(i); return <text key={i} x={W * 0.56 + i * 30} y={H * 0.34 + z.y} fontSize={34 + i * 10} fill="#8a8ab0" opacity={z.o} fontFamily="Inter" fontWeight={800}>z</text>; })}
      </svg>
      <Cap f={f} text="The Secret World of Dreams" at={20} size={64} />
    </Wrap>
  );
};

// 2 — Question
export const question: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  return (
    <Wrap total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><DreamBg f={f} W={W} H={H} hue="#d9ecff" /></svg>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        {['?', '?', '?'].map((q, i) => {
          const op = ramp(f, 20 + i * 12, 20, 0, 0.85);
          return <text key={i} x={W * (0.36 + i * 0.12)} y={H * 0.3 + float(f, 12, 0.06, i)} fontSize={70 + i * 20} fill="#9c7fd6" opacity={op} fontFamily="Inter" fontWeight={900}>?</text>;
        })}
        <GroundShadow x={W / 2} y={H * 0.72} rx={140} ry={28} />
        <Mascot f={f} x={W / 2} y={H * 0.56} scale={1.05} expr="curious" lookUp />
      </svg>
      <Cap f={f} text="But why do we dream at all?" at={14} size={58} />
    </Wrap>
  );
};

// 3 — Memory sorting
export const memory: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const cards = [
    { x: 0.30, keep: true, d: 20 }, { x: 0.40, keep: false, d: 40 }, { x: 0.62, keep: true, d: 60 },
    { x: 0.72, keep: false, d: 80 }, { x: 0.5, keep: true, d: 100 },
  ];
  return (
    <Wrap total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><DreamBg f={f} W={W} H={H} hue="#ffe0ec" /></svg>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        {cards.map((c, i) => {
          const rise = ramp(f, c.d, 50, 0, 1);
          const y = H * 0.6 - rise * H * 0.32 + float(f, 8, 0.05, i);
          const op = c.keep ? ramp(f, c.d, 30, 0, 1) : ramp(f, c.d, 30, 0, 1) * (1 - ramp(f, c.d + 60, 40, 0, 0.85));
          const glow = c.keep ? 1 : 0;
          return (
            <g key={i} transform={`translate(${W * c.x} ${y}) rotate(${(i - 2) * 6})`} opacity={op}>
              <rect x={-44} y={-56} width={88} height={112} rx={10} fill="#fff" stroke={c.keep ? '#ffca61' : '#bbb'} strokeWidth={glow ? 5 : 3} />
              <circle cx={0} cy={-18} r={18} fill={c.keep ? '#ffd98a' : '#d8d8d8'} />
              <rect x={-30} y={12} width={60} height={8} rx={4} fill="#e0e0e0" />
              <rect x={-30} y={28} width={42} height={8} rx={4} fill="#e0e0e0" />
            </g>
          );
        })}
        <GroundShadow x={W / 2} y={H * 0.82} rx={130} ry={26} />
        <Mascot f={f} x={W / 2} y={H * 0.66} scale={0.9} expr="calm" armsUp />
      </svg>
      <Cap f={f} text="Your brain sorts the day's memories" sub="keeping what matters, letting the rest fade" at={14} size={52} />
    </Wrap>
  );
};

// 4 — Creativity: mascot flies, connecting hand-drawn ideas (no emoji)
export const creativity: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const flyX = ramp(f, 0, total, W * 0.25, W * 0.7);
  const flyY = H * 0.5 + float(f, 30, 0.04);
  // hand-drawn idea props arranged in a constellation
  const ideas: { Comp: React.FC<any>; x: number; y: number; d: number }[] = [
    { Comp: Lightbulb, x: W * 0.2, y: H * 0.26, d: 10 },
    { Comp: Sparkle, x: W * 0.4, y: H * 0.18, d: 24 },
    { Comp: Telescope, x: W * 0.7, y: H * 0.2, d: 38 },
    { Comp: Palette, x: W * 0.83, y: H * 0.36, d: 52 },
    { Comp: Star, x: W * 0.52, y: H * 0.34, d: 66 },
  ];
  return (
    <Wrap total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><DreamBg f={f} W={W} H={H} hue="#d7ccff" night /></svg>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        {/* connector lines from the flying mascot to each idea — "connecting ideas" */}
        {ideas.map((it, i) => {
          const op = ramp(f, it.d + 6, 26, 0, 0.5);
          return <line key={`l${i}`} x1={flyX} y1={flyY} x2={it.x} y2={it.y} stroke="#bda9ff" strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" opacity={op} />;
        })}
        {ideas.map((it, i) => {
          const op = ramp(f, it.d, 22, 0, 1);
          const s = ramp(f, it.d, 22, 0.4, 1.1);
          return <g key={`p${i}`} opacity={op}><it.Comp x={it.x} y={it.y} scale={s} f={f} phase={i} /></g>;
        })}
        <g transform={`rotate(-6 ${flyX} ${flyY})`}>
          <Mascot f={f} x={flyX} y={flyY} scale={0.72} expr="happy" cape armsUp />
        </g>
      </svg>
      <Cap f={f} text="Dreams spark creativity" sub="connecting ideas in wild new ways" at={14} size={56} />
    </Wrap>
  );
};

// 5 — Emotion: storm cloud calms to sun
export const emotion: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const calm = ramp(f, 30, 70, 0, 1);
  return (
    <Wrap total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><DreamBg f={f} W={W} H={H} hue="#ffe9d6" /></svg>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        {/* storm cloud fading */}
        <g transform={`translate(${W * 0.36} ${H * 0.26})`} opacity={1 - calm}>
          <ellipse cx={0} cy={0} rx={80} ry={44} fill="#8a90a8" />
          <ellipse cx={60} cy={10} rx={56} ry={32} fill="#8a90a8" />
          <path d="M -10 40 L -24 80 L -4 74 L -18 110" stroke="#f2c14e" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
        {/* warm sun appearing */}
        <g transform={`translate(${W * 0.66} ${H * 0.24}) scale(${calm})`}>
          <circle r={60} fill="#ffd76a" />
          {Array.from({ length: 10 }).map((_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 72} y1={Math.sin(a) * 72} x2={Math.cos(a) * 96} y2={Math.sin(a) * 96} stroke="#ffd76a" strokeWidth={7} strokeLinecap="round" />; })}
        </g>
        {/* floating hearts (hand-drawn, not emoji) */}
        {[0, 1, 2].map(i => {
          const t = ((f + i * 40) % 120) / 120;
          return <Heart key={i} x={W * (0.45 + i * 0.05)} y={H * 0.5 - t * 130} scale={0.8} opacity={Math.sin(t * Math.PI) * calm} />;
        })}
        <GroundShadow x={W / 2} y={H * 0.82} rx={130} ry={26} />
        <Mascot f={f} x={W / 2} y={H * 0.66} scale={0.95} expr="calm" />
      </svg>
      <Cap f={f} text="They help you process emotions" sub="so you wake up a little lighter" at={14} size={54} />
    </Wrap>
  );
};

// 6 — Mystery / close
export const mystery: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const zzz = (i: number) => { const t = ((f + i * 30) % 90) / 90; return { y: -t * 70, o: Math.sin(t * Math.PI) }; };
  return (
    <Wrap total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><DreamBg f={f} W={W} H={H} hue="#3a3270" night /></svg>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        {/* moon */}
        <circle cx={W * 0.8} cy={H * 0.2} r={56} fill="#fdf6e3" />
        <circle cx={W * 0.82} cy={H * 0.18} r={48} fill="#1e1840" />
        <GroundShadow x={W / 2} y={H * 0.76} rx={130} ry={26} opacity={0.28} />
        <Mascot f={f} x={W / 2} y={H * 0.6} scale={0.95} expr="sleepy" lookUp />
        {[0, 1, 2].map(i => { const z = zzz(i); return <text key={i} x={W * 0.54 + i * 28} y={H * 0.38 + z.y} fontSize={30 + i * 9} fill="#cdbfff" opacity={z.o} fontFamily="Inter" fontWeight={800}>z</text>; })}
      </svg>
      <Cap f={f} text="Sweet dreams." sub="one of the mind's deepest mysteries" at={20} size={64} />
    </Wrap>
  );
};

export const DREAM_SCENES: Record<string, React.FC<P>> = { title, question, memory, creativity, emotion, mystery };

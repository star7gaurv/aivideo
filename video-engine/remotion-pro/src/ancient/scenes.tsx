import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { DocScene, KeyText, CenterText } from './Doc';
import {
  Defs, C, ramp, float, slowZoom, HeavyFigure, LeanHunter, Venus, Fire, Hills, Vignette, Dust,
} from './kit';

type P = { total: number };
const W = 1920, H = 1080;

// 1 — Discovery: cave, fire, figure carving by firelight
export const discovery: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const z = slowZoom(f, total, 1, 1.07);
  const reveal = ramp(f, total * 0.55, 50, 0, 1);
  return (
    <DocScene total={total}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <rect width={W} height={H} fill="url(#night)" />
          {/* cave walls */}
          <path d={`M0 0 L0 ${H} L${W} ${H} L${W} 0 Q ${W * 0.7} 160 ${W * 0.5} 120 Q ${W * 0.3} 160 0 0 Z`} fill="#0a0810" opacity={0.6} />
          <Fire x={W * 0.32} y={H * 0.72} frame={f} scale={1.4} />
          {/* seated carver */}
          <g transform={`translate(${W * 0.5}, ${H * 0.68})`}>
            <ellipse cx="0" cy="40" rx="80" ry="60" fill={C.ink} />
            <circle cx="20" cy="-40" r="30" fill={C.ink} />
            <path d="M 30 -30 Q 80 -10 70 30" stroke={C.ink} strokeWidth="22" fill="none" strokeLinecap="round" />
          </g>
          {/* the figurine being revealed */}
          <g opacity={reveal} transform={`translate(${W * 0.62}, ${H * 0.66}) scale(0.5)`}>
            <Venus x={0} y={0} scale={1} />
          </g>
          <Dust frame={f} w={W} h={H} n={14} />
          <Vignette w={W} h={H} />
        </svg>
      </AbsoluteFill>
      <KeyText text="30,000 years ago" appearAt={20} size={56} />
    </DocScene>
  );
};

// 2 — Question: figurine on pedestal + ?
export const question: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const z = slowZoom(f, total, 1.05, 1);
  const q = ramp(f, total * 0.5, 30, 0, 1);
  return (
    <DocScene total={total}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs />
          <rect width={W} height={H} fill="url(#night)" />
          <ellipse cx={W / 2} cy={H * 0.62} rx={260} ry={60} fill="#000" opacity={0.4} />
          <Venus x={W / 2} y={H * 0.45 + float(f, 6)} scale={1.5} />
          <text x={W * 0.72} y={H * 0.4} fontSize={200} fill={C.gold} opacity={q} fontFamily="Inter" fontWeight="800">?</text>
          <Vignette w={W} h={H} />
        </svg>
      </AbsoluteFill>
      <KeyText text="How could they carve a body they'd never seen?" appearAt={total * 0.3} size={42} />
    </DocScene>
  );
};

// 3 — Stereotype: lean hunter striding across daylight landscape
export const stereotype: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const stride = Math.sin(f * 0.3) * 6;
  const walkX = ramp(f, 0, total, W * 0.2, W * 0.7);
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs />
        <rect width={W} height={H} fill="url(#day)" />
        <circle cx={W * 0.8} cy={H * 0.22} r={70} fill={C.fireCore} opacity={0.8} />
        <Hills w={W} h={H} />
        <LeanHunter x={walkX} y={H * 0.78} scale={1.5} stride={stride} />
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="The image we all carry" appearAt={20} size={52} />
    </DocScene>
  );
};

// 4 — Twist: clues converge, the claim
export const twist: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const icons = ['🦴', '📜', '🧬'];
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><Defs /><rect width={W} height={H} fill="url(#night)" /><Dust frame={f} w={W} h={H} /><Vignette w={W} h={H} /></svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 60, flexDirection: 'row' }}>
        {icons.map((ic, i) => {
          const op = ramp(f, 10 + i * 12, 24, 0, 1);
          return <div key={i} style={{ fontSize: 110, opacity: op, transform: `translateY(${float(f, 8, 0.05, i)}px)` }}>{ic}</div>;
        })}
      </AbsoluteFill>
      <KeyText text="Ancient humans could get fat." sub="And some almost certainly did." appearAt={total * 0.5} size={58} color={C.gold} />
    </DocScene>
  );
};

// 5 — Mechanism: body with glowing energy core
export const mechanism: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f * 0.12) * 0.12;
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <g transform={`translate(${W / 2}, ${H * 0.52})`}>
          <ellipse cx="0" cy="40" rx="110" ry="150" fill={C.ink} />
          <circle cx="0" cy="-150" r="56" fill={C.ink} />
          <circle cx="0" cy="40" r={70 * pulse} fill={C.fire} opacity={0.5} />
          <circle cx="0" cy="40" r={40 * pulse} fill={C.fireCore} opacity={0.9} />
        </g>
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="One of the oldest survival mechanisms" appearAt={20} size={48} />
    </DocScene>
  );
};

// 6 — Prehistoric: no fridge / no pantry
export const prehistoric: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#dusk)" /><Hills w={W} h={H} />
        <Vignette w={W} h={H} />
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 80, flexDirection: 'row' }}>
        {['🧊', '🥫'].map((ic, i) => {
          const op = ramp(f, 14 + i * 14, 20, 0, 1);
          return (
            <div key={i} style={{ position: 'relative', opacity: op }}>
              <div style={{ fontSize: 150, filter: 'grayscale(1)' }}>{ic}</div>
              <div style={{ position: 'absolute', inset: 0, fontSize: 200, color: C.blood, lineHeight: 0.9 }}>✕</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <KeyText text="No refrigerator. No pantry. No guarantee." appearAt={total * 0.4} size={46} />
    </DocScene>
  );
};

// 7 — Roulette: food appears then fails
export const roulette: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const items = [{ e: '🫐', t: 'berries' }, { e: '🐇', t: 'a rabbit' }, { e: '🍖', t: 'a hunt' }, { e: '🌧️', t: 'or nothing' }];
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><Defs /><rect width={W} height={H} fill="url(#dusk)" /><Hills w={W} h={H} /><Vignette w={W} h={H} /></svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 50, flexDirection: 'row' }}>
        {items.map((it, i) => {
          const seg = total / 4;
          const op = ramp(f, i * seg + 6, 18, 0, 1) * (1 - ramp(f, (i + 1) * seg, 14, 0, i === 3 ? 0 : 0.4));
          const fade = i === 3 ? 1 : 1;
          return (
            <div key={i} style={{ textAlign: 'center', opacity: op * fade, transform: `scale(${ramp(f, i * seg + 6, 22, 0.7, 1)})` }}>
              <div style={{ fontSize: 120, filter: i === 3 ? 'grayscale(0.6)' : 'none' }}>{it.e}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 30, color: C.cream }}>{it.t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </DocScene>
  );
};

// 8 — Stability: flat modern line vs swinging prehistoric line
export const stability: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const prog = ramp(f, 20, total - 40, 0, 1);
  const midY = H * 0.5;
  const flat = `M 200 ${midY} L ${200 + 1500 * prog} ${midY}`;
  let swing = `M 200 ${midY + 120}`;
  for (let i = 0; i <= 1500 * prog; i += 20) {
    swing += ` L ${200 + i} ${midY + 120 + Math.sin(i * 0.012) * 150}`;
  }
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <path d={flat} stroke={C.teal} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d={swing} stroke={C.gold} strokeWidth="6" fill="none" strokeLinecap="round" />
        <Vignette w={W} h={H} />
      </svg>
      <AbsoluteFill style={{ padding: 120, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 220, top: midY - 60, color: C.teal, fontFamily: 'Inter', fontSize: 30, fontWeight: 700, opacity: ramp(f, 30, 20, 0, 1) }}>Modern food — stable</div>
        <div style={{ position: 'absolute', left: 220, top: midY + 300, color: C.gold, fontFamily: 'Inter', fontSize: 30, fontWeight: 700, opacity: ramp(f, 60, 20, 0, 1) }}>Prehistoric food — feast & famine</div>
      </AbsoluteFill>
    </DocScene>
  );
};

// 9 — Stored survival: fat as energy battery
export const stored: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const fill = ramp(f, 30, 90, 0, 1);
  const cal = Math.round(ramp(f, 30, 90, 0, 7700));
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        {/* battery */}
        <g transform={`translate(${W / 2}, ${H * 0.46})`}>
          <rect x={-160} y={-90} width={320} height={180} rx={20} fill="none" stroke={C.cream} strokeWidth={8} />
          <rect x={160} y={-34} width={26} height={68} rx={8} fill={C.cream} />
          <rect x={-148} y={-78} width={296 * fill} height={156} rx={12} fill={C.fire} />
          <rect x={-148} y={-78} width={296 * fill} height={60} rx={12} fill={C.fireCore} opacity={0.5} />
        </g>
        <Vignette w={W} h={H} />
      </svg>
      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 150 }}>
        <div style={{ fontFamily: 'Inter', fontSize: 56, fontWeight: 800, color: C.fireCore }}>{cal.toLocaleString()} kcal / kg</div>
      </AbsoluteFill>
      <KeyText text="Body fat is stored survival" appearAt={total * 0.45} size={56} color={C.cream} />
    </DocScene>
  );
};

// 10 — Movie myth: action silhouettes crossed out
export const moviemyth: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <LeanHunter x={W * 0.3} y={H * 0.6} scale={1.6} stride={Math.sin(f * 0.5) * 14} />
        <LeanHunter x={W * 0.55} y={H * 0.62} scale={1.4} stride={Math.cos(f * 0.5) * 14} fill="#3a2a2a" />
        <LeanHunter x={W * 0.72} y={H * 0.58} scale={1.5} stride={Math.sin(f * 0.5 + 1) * 14} fill="#2a2a3a" />
        <Vignette w={W} h={H} />
      </svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 300, color: C.blood, opacity: ramp(f, total * 0.5, 16, 0, 0.85), fontWeight: 900 }}>✕</div>
      </AbsoluteFill>
      <KeyText text="Not one endless action movie" appearAt={total * 0.55} size={50} />
    </DocScene>
  );
};

// 11 — Daily life: calm chores
export const dailylife: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const items = [{ e: '🏺', t: 'water' }, { e: '🪵', t: 'firewood' }, { e: '🍒', t: 'food' }, { e: '🪨', t: 'tools' }];
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><Defs /><rect width={W} height={H} fill="url(#dusk)" /><Hills w={W} h={H} /><Vignette w={W} h={H} /></svg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 70, flexDirection: 'row' }}>
        {items.map((it, i) => {
          const op = ramp(f, 12 + i * 16, 22, 0, 1);
          return <div key={i} style={{ textAlign: 'center', opacity: op, transform: `translateY(${float(f, 7, 0.04, i)}px)` }}>
            <div style={{ fontSize: 110 }}>{it.e}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 28, color: C.cream }}>{it.t}</div>
          </div>;
        })}
      </AbsoluteFill>
      <KeyText text="Movement built into life — not scheduled" appearAt={total * 0.5} size={44} />
    </DocScene>
  );
};

// 12 — Consistency
export const consistency: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#dusk)" />
        <circle cx={W * 0.5} cy={H * 0.3} r={80} fill={C.fireCore} opacity={0.85} />
        <Hills w={W} h={H} />
        <LeanHunter x={W * 0.5} y={H * 0.8} scale={1.4} stride={0} fill={C.ink} />
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Consistency — not intensity" appearAt={20} size={58} color={C.cream} />
    </DocScene>
  );
};

// 13 — Venus detailed with labels
export const venus: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const z = slowZoom(f, total, 1, 1.06);
  const labels = [
    { t: 'rounded stomach', x: W * 0.66, y: H * 0.5, at: 30 },
    { t: 'thick thighs', x: W * 0.66, y: H * 0.66, at: 55 },
    { t: 'visible fat reserves', x: W * 0.3, y: H * 0.42, at: 80 },
  ];
  return (
    <DocScene total={total}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs /><rect width={W} height={H} fill="url(#night)" />
          <Venus x={W / 2} y={H * 0.42} scale={1.7} />
          <Vignette w={W} h={H} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {labels.map((l, i) => (
          <div key={i} style={{ position: 'absolute', left: l.x, top: l.y, opacity: ramp(f, l.at, 22, 0, 1), color: C.gold, fontFamily: 'Inter', fontSize: 30, fontWeight: 700 }}>{l.t}</div>
        ))}
      </AbsoluteFill>
      <KeyText text="The Venus of Willendorf" appearAt={12} size={56} />
    </DocScene>
  );
};

// 14 — Figurines across a map
export const figurines: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const pins = [[0.42, 0.42], [0.48, 0.5], [0.55, 0.38], [0.6, 0.55], [0.66, 0.46], [0.5, 0.6]];
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        {/* stylized landmass */}
        <path d={`M ${W*0.32} ${H*0.4} Q ${W*0.5} ${H*0.28} ${W*0.7} ${H*0.4} Q ${W*0.78} ${H*0.58} ${W*0.6} ${H*0.66} Q ${W*0.42} ${H*0.72} ${W*0.34} ${H*0.58} Z`} fill={C.earthDark} opacity={0.7} stroke={C.earth} strokeWidth={3} />
        {pins.map((p, i) => {
          const op = ramp(f, 20 + i * 14, 16, 0, 1);
          const r = 8 + Math.sin(f * 0.2 + i) * 3;
          return <g key={i} opacity={op}><circle cx={W * p[0]} cy={H * p[1]} r={r + 10} fill={C.gold} opacity={0.3} /><circle cx={W * p[0]} cy={H * p[1]} r={r} fill={C.gold} /></g>;
        })}
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Found across Europe and Asia" appearAt={total * 0.4} size={50} />
    </DocScene>
  );
};

// 15 — Agriculture: 95% / 5% timeline + sprout
export const agriculture: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const grow = ramp(f, 40, 60, 0, 1);
  const barW = ramp(f, 15, 50, 0, 1400);
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <rect x={260} y={H * 0.4} width={barW * 0.95} height={70} fill={C.stoneDark} />
        <rect x={260 + barW * 0.95} y={H * 0.4} width={barW * 0.05} height={70} fill={C.green} />
        {/* sprout */}
        <g transform={`translate(${W * 0.5}, ${H * 0.72})`}>
          <path d={`M 0 0 L 0 ${-120 * grow}`} stroke={C.greenDark} strokeWidth={10} strokeLinecap="round" />
          <path d={`M 0 ${-80 * grow} Q ${40 * grow} ${-110 * grow} ${70 * grow} ${-80 * grow}`} stroke={C.green} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={`M 0 ${-80 * grow} Q ${-40 * grow} ${-110 * grow} ${-70 * grow} ${-80 * grow}`} stroke={C.green} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
        <Vignette w={W} h={H} />
      </svg>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 320, top: H * 0.4 - 50, color: C.stone, fontFamily: 'Inter', fontSize: 30, fontWeight: 700, opacity: ramp(f, 30, 20, 0, 1) }}>95% — hunting & gathering</div>
      </AbsoluteFill>
      <KeyText text="~12,000 years ago: agriculture" appearAt={total * 0.5} size={48} />
    </DocScene>
  );
};

// 16 — Villages
export const villages: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const huts = [[0.3, 0], [0.42, 1], [0.55, 2], [0.66, 3], [0.5, 4]];
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#dusk)" /><Hills w={W} h={H} />
        {huts.map(([x, i]) => {
          const s = ramp(f, 14 + i * 12, 24, 0, 1);
          return <g key={i} transform={`translate(${W * x}, ${H * 0.78}) scale(${s})`}>
            <rect x={-50} y={-60} width={100} height={70} fill={C.cream} />
            <path d={`M -62 -58 L 0 -110 L 62 -58 Z`} fill={C.blood} />
            <rect x={-16} y={-36} width={32} height={46} fill={C.earthDark} />
          </g>;
        })}
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Predictable calories — for the first time" appearAt={total * 0.45} size={46} />
    </DocScene>
  );
};

// 17 — Status: large wealthy figure + gold
export const status: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <ellipse cx={W / 2} cy={H * 0.7} rx={300} ry={70} fill="#000" opacity={0.4} />
        <HeavyFigure x={W / 2} y={H * 0.46} scale={1.7} fill={C.skin} />
        {/* gold coins */}
        {Array.from({ length: 8 }).map((_, i) => {
          const op = ramp(f, 20 + i * 8, 16, 0, 1);
          const cx = W * (0.2 + (i % 4) * 0.05) + (i > 3 ? W * 0.45 : 0);
          return <circle key={i} cx={cx} cy={H * (0.75 + (i % 2) * 0.04)} r={22} fill={C.gold} opacity={op} stroke={C.earthDark} strokeWidth={3} />;
        })}
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Body fat as a luxury — a sign of wealth" appearAt={total * 0.4} size={46} color={C.gold} />
    </DocScene>
  );
};

// 18 — Civilizations
export const civilizations: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const items = [
    { label: 'Egypt', draw: <path d="M 0 60 L 70 -80 L 140 60 Z" fill={C.earth} stroke={C.earthDark} strokeWidth={3} /> },
    { label: 'Rome', draw: <g><rect x={20} y={-80} width={100} height={140} fill={C.stone} /><rect x={10} y={-90} width={120} height={16} fill={C.stoneDark} /></g> },
    { label: 'China', draw: <g><path d="M 0 -40 L 140 -40 L 110 -70 L 30 -70 Z" fill={C.blood} /><rect x={30} y={-40} width={80} height={100} fill={C.earth} /></g> },
  ];
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#dusk)" /><Hills w={W} h={H} />
        {items.map((it, i) => {
          const op = ramp(f, 16 + i * 22, 22, 0, 1);
          return <g key={i} opacity={op} transform={`translate(${W * (0.24 + i * 0.26)}, ${H * 0.62})`}>{it.draw}</g>;
        })}
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Egypt. Rome. China — the wealthy ate differently." appearAt={total * 0.5} size={42} />
    </DocScene>
  );
};

// 19 — Trade-offs: balance scale
export const tradeoffs: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const tilt = Math.sin(f * 0.06) * 6;
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <g transform={`translate(${W / 2}, ${H * 0.3})`}>
          <rect x={-6} y={0} width={12} height={320} fill={C.stoneDark} />
          <g transform={`rotate(${tilt})`}>
            <rect x={-300} y={-6} width={600} height={12} rx={6} fill={C.stone} />
            <line x1={-300} y1={0} x2={-300} y2={70} stroke={C.stone} strokeWidth={4} />
            <line x1={300} y1={0} x2={300} y2={70} stroke={C.stone} strokeWidth={4} />
            <circle cx={-300} cy={110} r={70} fill={C.fire} opacity={0.85} />
            <text x={-300} y={120} fontSize={30} fill="#000" textAnchor="middle" fontFamily="Inter" fontWeight="700">energy</text>
            <circle cx={300} cy={110} r={70} fill={C.teal} opacity={0.85} />
            <text x={300} y={120} fontSize={28} fill="#000" textAnchor="middle" fontFamily="Inter" fontWeight="700">mobility</text>
          </g>
        </g>
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Survival is a trade-off" appearAt={total * 0.45} size={54} />
    </DocScene>
  );
};

// 20 — Honey
export const honey: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const drip = ramp(f, 40, 60, 0, 120);
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#day)" />
        {/* tree */}
        <rect x={W * 0.46} y={H * 0.4} width={70} height={H * 0.5} fill={C.earthDark} />
        <ellipse cx={W * 0.5} cy={H * 0.32} rx={260} ry={170} fill={C.greenDark} />
        {/* hive */}
        <ellipse cx={W * 0.5} cy={H * 0.42} rx={70} ry={90} fill={C.gold} />
        <path d={`M ${W*0.5} ${H*0.5} q 0 ${drip} -6 ${drip}`} stroke={C.gold} strokeWidth={14} fill="none" strokeLinecap="round" />
        {/* bees */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = f * 0.06 + i;
          return <circle key={i} cx={W * 0.5 + Math.cos(a) * (120 + i * 14)} cy={H * 0.42 + Math.sin(a) * (90 + i * 10)} r={6} fill={C.ink} />;
        })}
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Honey — a rare, risky burst of calories" appearAt={total * 0.45} size={46} />
    </DocScene>
  );
};

// 21 — Sweet preference: baby + brain
export const sweet: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f * 0.16) * 0.14;
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <g transform={`translate(${W * 0.4}, ${H * 0.5})`}>
          <circle r={120} fill={C.skin} />
          <circle cx={-40} cy={-10} r={12} fill={C.ink} />
          <circle cx={40} cy={-10} r={12} fill={C.ink} />
          <path d="M -30 40 Q 0 64 30 40" stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
          <circle cx={0} cy={-90} r={40} fill={C.fireCore} opacity={0.5 * pulse} />
        </g>
        <text x={W * 0.66} y={H * 0.5} fontSize={150} opacity={ramp(f, 30, 24, 0, 1)}>🍯</text>
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="A preference we are born with" appearAt={total * 0.45} size={50} />
    </DocScene>
  );
};

// 22 — Mismatch split
export const mismatch: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const split = ramp(f, 15, 40, W, W / 2);
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs />
        <rect x={0} y={0} width={W} height={H} fill="url(#dusk)" />
        <rect x={split} y={0} width={W - split} height={H} fill="url(#night)" />
        <line x1={split} y1={0} x2={split} y2={H} stroke={C.gold} strokeWidth={4} />
        <text x={W * 0.25} y={H * 0.45} fontSize={120} textAnchor="middle">🌾</text>
        <text x={split + (W - split) * 0.5} y={H * 0.45} fontSize={120} textAnchor="middle">🍔</text>
        <Vignette w={W} h={H} />
      </svg>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: W * 0.12, top: H * 0.56, width: W * 0.26, textAlign: 'center', color: C.cream, fontFamily: 'Inter', fontSize: 30, fontWeight: 700, opacity: ramp(f, 40, 20, 0, 1) }}>Scarcity, occasionally</div>
        <div style={{ position: 'absolute', left: W * 0.62, top: H * 0.56, width: W * 0.26, textAlign: 'center', color: C.cream, fontFamily: 'Inter', fontSize: 30, fontWeight: 700, opacity: ramp(f, 55, 20, 0, 1) }}>Abundance, every day</div>
      </AbsoluteFill>
      <KeyText text="An evolutionary mismatch" appearAt={total * 0.6} size={52} color={C.gold} />
    </DocScene>
  );
};

// 23 — As intended: temporary -> permanent
export const asintended: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const prog = ramp(f, 20, total - 50, 0, 1);
  const midY = H * 0.52;
  let path = `M 200 ${midY}`;
  const end = 1500 * prog;
  for (let i = 0; i <= end; i += 16) {
    const x = 200 + i;
    // temporary spikes early, permanent plateau later
    const spikePart = i < 750 ? Math.max(0, Math.sin(i * 0.03)) * 160 : 0;
    const plateau = i >= 750 ? Math.min(180, (i - 750) * 0.5) : 0;
    path += ` L ${x} ${midY - spikePart - plateau}`;
  }
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        <path d={path} stroke={C.fire} strokeWidth={6} fill="none" strokeLinecap="round" />
        <line x1={200} y1={midY} x2={1700} y2={midY} stroke={C.stoneDark} strokeWidth={2} />
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="Abundance used to be temporary. Now it lasts a lifetime." appearAt={total * 0.5} size={42} />
    </DocScene>
  );
};

// 24 — Conclusion: the answer
export const conclusion: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><Defs /><rect width={W} height={H} fill="url(#night)" /><Dust frame={f} w={W} h={H} /><Vignette w={W} h={H} /></svg>
      <CenterText text="Did ancient humans get fat?" sub="Yes — some undoubtedly did." appearAt={10} size={76} color={C.gold} />
    </DocScene>
  );
};

// 25 — Refrigerator finale
export const refrigerator: React.FC<P> = ({ total }) => {
  const f = useCurrentFrame();
  const open = ramp(f, total * 0.35, 50, 0, 1);
  const glow = ramp(f, total * 0.4, 40, 0, 1);
  return (
    <DocScene total={total}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs /><rect width={W} height={H} fill="url(#night)" />
        {/* fridge */}
        <g transform={`translate(${W / 2}, ${H * 0.5})`}>
          <rect x={-150} y={-260} width={300} height={520} rx={20} fill={C.stoneDark} />
          {/* interior glow */}
          <rect x={-130} y={-240} width={260} height={480} rx={12} fill={C.fireCore} opacity={glow} />
          {/* door opening */}
          <g transform={`rotate(${-open * 28}) translate(-140 0)`} style={{ transformOrigin: '-150px 0px' }}>
            <rect x={-10} y={-260} width={150} height={520} rx={16} fill={C.stone} />
          </g>
          {/* person silhouette */}
          <g transform={`translate(${260}, 120)`}>
            <circle cx={0} cy={-150} r={40} fill={C.ink} />
            <path d="M -40 -110 Q -60 30 -30 150 L 30 150 Q 50 30 40 -110 Z" fill={C.ink} />
          </g>
        </g>
        <Vignette w={W} h={H} />
      </svg>
      <KeyText text="A world where the famine never arrives" appearAt={total * 0.55} size={48} color={C.cream} />
    </DocScene>
  );
};

export const SCENES: Record<string, React.FC<P>> = {
  discovery, question, stereotype, twist, mechanism, prehistoric, roulette, stability,
  stored, moviemyth, dailylife, consistency, venus, figurines, agriculture, villages,
  status, civilizations, tradeoffs, honey, sweet, mismatch, asintended, conclusion, refrigerator,
};

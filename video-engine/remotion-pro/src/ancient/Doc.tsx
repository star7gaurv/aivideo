import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { fadeInOut, ramp, C } from './kit';

// Documentary scene wrapper: gentle fade in/out + cinematic letterbox.
export const DocScene: React.FC<{ total: number; children: React.ReactNode; letterbox?: boolean }> = ({
  total, children, letterbox = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(frame, total), backgroundColor: C.night }}>
      {children}
      {letterbox && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: '#000' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: '#000' }} />
        </>
      )}
    </AbsoluteFill>
  );
};

// Sparse on-screen key term — appears low, elegant, documentary-style.
export const KeyText: React.FC<{
  text: string; sub?: string; appearAt?: number; size?: number; color?: string; y?: number;
}> = ({ text, sub, appearAt = 8, size = 60, color = C.cream, y = 0 }) => {
  const frame = useCurrentFrame();
  const op = ramp(frame, appearAt, 26, 0, 1);
  const ty = ramp(frame, appearAt, 30, 26, 0);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 130 + y }}>
      <div style={{ opacity: op, transform: `translateY(${ty}px)`, textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: size, fontWeight: 800, color,
          letterSpacing: 0.5, textShadow: '0 4px 24px rgba(0,0,0,0.6)',
        }}>{text}</div>
        {sub && <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: size * 0.42, fontWeight: 400,
          color, opacity: 0.8, marginTop: 10,
        }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

// Centered title (for opening / key statements)
export const CenterText: React.FC<{
  text: string; sub?: string; appearAt?: number; size?: number; color?: string;
}> = ({ text, sub, appearAt = 8, size = 84, color = C.cream }) => {
  const frame = useCurrentFrame();
  const op = ramp(frame, appearAt, 30, 0, 1);
  const sc = ramp(frame, appearAt, 40, 0.92, 1);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: op, transform: `scale(${sc})`, textAlign: 'center', maxWidth: '78%' }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: size, fontWeight: 800, color,
          lineHeight: 1.15, textShadow: '0 6px 30px rgba(0,0,0,0.6)',
        }}>{text}</div>
        {sub && <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: size * 0.4, fontWeight: 400,
          color, opacity: 0.85, marginTop: 18,
        }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

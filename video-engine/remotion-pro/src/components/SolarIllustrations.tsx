import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { theme } from '../theme';

export const Sun: React.FC<{ size?: number; animated?: boolean }> = ({
  size = 120,
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const rotation = animated ? (frame % 120) * 3 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{
        filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
      }}
    >
      {/* Sun rays */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = 60 + 45 * Math.cos(angle);
        const y1 = 60 + 45 * Math.sin(angle);
        const x2 = 60 + 55 * Math.cos(angle);
        const y2 = 60 + 55 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={theme.colors.solar.sun}
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}

      {/* Sun glow */}
      <circle
        cx="60"
        cy="60"
        r="45"
        fill="none"
        stroke={theme.colors.solar.sun}
        strokeWidth={2}
        opacity={0.4}
      />

      {/* Sun core */}
      <circle cx="60" cy="60" r="38" fill={theme.colors.solar.sun} />
    </svg>
  );
};

export const SolarPanel: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  const frame = useCurrentFrame();
  const scaleY = animated ? interpolate(frame % 60, [0, 30, 60], [1, 1.1, 1]) : 1;

  return (
    <svg
      width="200"
      height="120"
      viewBox="0 0 200 120"
      style={{
        transform: `scaleY(${scaleY})`,
        transformOrigin: 'center',
        filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
      }}
    >
      {/* Panel frame */}
      <rect
        x="20"
        y="20"
        width="160"
        height="80"
        fill={theme.colors.solar.panel}
        rx="8"
      />

      {/* Panel cells grid */}
      {[...Array(4)].map((_, i) =>
        [...Array(6)].map((_, j) => (
          <rect
            key={`${i}-${j}`}
            x={30 + j * 24}
            y={30 + i * 18}
            width={22}
            height={16}
            fill={theme.colors.dark}
            stroke={theme.colors.solar.panel}
            strokeWidth={1}
          />
        ))
      )}

      {/* Shine effect */}
      <ellipse
        cx="100"
        cy="40"
        rx="60"
        ry="20"
        fill="white"
        opacity={0.15}
      />
    </svg>
  );
};

export const Photon: React.FC<{
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  duration: number;
  delay: number;
}> = ({ x, y, targetX, targetY, duration, delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame - delay,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const currentX = x + (targetX - x) * progress;
  const currentY = y + (targetY - y) * progress;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      style={{
        position: 'absolute',
        left: currentX,
        top: currentY,
        filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
      }}
    >
      <circle cx="10" cy="10" r="6" fill={theme.colors.solar.sun} />
      <circle cx="10" cy="10" r="6" fill={theme.colors.solar.sun} opacity={0.3} r="9" />
    </svg>
  );
};

export const Electricity: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  const frame = useCurrentFrame();
  const strokeOffset = animated ? (frame * 2) % 100 : 0;

  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      style={{
        filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))',
      }}
    >
      {/* Lightning bolt */}
      <path
        d="M 60 10 L 40 45 L 55 45 L 35 75 L 85 35 L 70 35 L 85 10 Z"
        fill={theme.colors.solar.energy}
        stroke={theme.colors.solar.energy}
        strokeWidth={2}
      />

      {/* Animated glow */}
      <path
        d="M 60 10 L 40 45 L 55 45 L 35 75 L 85 35 L 70 35 L 85 10 Z"
        fill="none"
        stroke={theme.colors.solar.energy}
        strokeWidth={3}
        opacity={animated ? Math.sin(frame * 0.1) * 0.5 + 0.5 : 1}
        strokeDasharray="100"
        strokeDashoffset={strokeOffset}
      />
    </svg>
  );
};

export const Globe: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  const frame = useCurrentFrame();
  const rotation = animated ? (frame % 120) * 3 : 0;

  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      style={{
        filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
      }}
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" fill="none" stroke={theme.colors.white} strokeWidth={2} />

      {/* Globe shading */}
      <circle cx="50" cy="50" r="45" fill={theme.colors.solar.energy} opacity={0.8} />

      {/* Continents (simplified) */}
      <path
        d="M 50 20 Q 60 30 55 40 Q 65 45 60 55 Q 50 60 45 50 Q 40 55 35 50 Q 30 45 35 35 Q 40 30 50 20"
        fill={theme.colors.dark}
      />

      {/* Highlight */}
      <ellipse cx="65" cy="35" rx="12" ry="18" fill={theme.colors.white} opacity={0.2} />
    </svg>
  );
};

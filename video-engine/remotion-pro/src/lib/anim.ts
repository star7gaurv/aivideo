import { interpolate, Easing } from 'remotion';

// Smooth, cinematic easing helpers — no abrupt pops.

const SMOOTH = Easing.bezier(0.22, 1, 0.36, 1); // easeOutExpo-ish, gentle settle

/** Fade + lift in over [start, start+dur], holding after. */
export const riseIn = (
  frame: number,
  start: number,
  dur = 30,
  distance = 50
) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: SMOOTH,
  });
  return { opacity: p, translateY: (1 - p) * distance };
};

/** Gentle scale-in (no overshoot). */
export const scaleIn = (
  frame: number,
  start: number,
  dur = 36,
  from = 0.7
) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: SMOOTH,
  });
  return { opacity: p, scale: from + (1 - from) * p };
};

/** Scene-level fade: in over first `fade`, out over last `fade`. */
export const sceneFade = (
  frame: number,
  total: number,
  fade = 16
) =>
  interpolate(
    frame,
    [0, fade, total - fade, total],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  );

/** Continuous gentle float (sin). */
export const floaty = (frame: number, amp = 8, speed = 0.04, phase = 0) =>
  Math.sin(frame * speed + phase) * amp;

/** Smooth value ramp between two numbers. */
export const ramp = (
  frame: number,
  start: number,
  dur: number,
  from: number,
  to: number
) =>
  interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: SMOOTH,
  });

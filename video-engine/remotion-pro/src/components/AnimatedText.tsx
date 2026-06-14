import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'typewriter';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = theme.typography.sizes.xl,
  fontWeight = theme.typography.weights.bold,
  color = theme.colors.white,
  delay = 0,
  duration = 30,
  animation = 'fadeIn',
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame - delay,
    [0, duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const getStyle = () => {
    switch (animation) {
      case 'fadeIn':
        return { opacity: progress };

      case 'slideInLeft':
        return {
          opacity: progress,
          transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
        };

      case 'slideInRight':
        return {
          opacity: progress,
          transform: `translateX(${interpolate(progress, [0, 1], [50, 0])}px)`,
        };

      case 'scaleIn':
        return {
          opacity: progress,
          transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
        };

      case 'typewriter':
        const visibleChars = Math.floor(progress * text.length);
        return {
          opacity: 1,
          display: 'inline-block',
        };

      default:
        return { opacity: progress };
    }
  };

  return (
    <div
      style={{
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        fontFamily: text.match(/[ऀ-ॿ]/)
          ? theme.typography.fontFamily.hindi
          : theme.typography.fontFamily.sans,
        lineHeight: 1.3,
        margin: '0',
        ...getStyle(),
      }}
    >
      {animation === 'typewriter'
        ? text.substring(0, Math.floor(progress * text.length))
        : text}
    </div>
  );
};

interface TitleProps {
  main: string;
  subtitle?: string;
  mainSize?: number;
  subtitleSize?: number;
  color?: string;
  delay?: number;
}

export const Title: React.FC<TitleProps> = ({
  main,
  subtitle,
  mainSize = theme.typography.sizes['4xl'],
  subtitleSize = theme.typography.sizes.xl,
  color = theme.colors.white,
  delay = 0,
}) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <AnimatedText
        text={main}
        fontSize={mainSize}
        fontWeight={theme.typography.weights.bold}
        color={color}
        delay={delay}
        duration={40}
        animation="scaleIn"
      />
      {subtitle && (
        <AnimatedText
          text={subtitle}
          fontSize={subtitleSize}
          fontWeight={theme.typography.weights.normal}
          color={color}
          delay={delay + 15}
          duration={30}
          animation="fadeIn"
        />
      )}
    </div>
  );
};

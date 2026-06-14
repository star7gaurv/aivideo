import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../theme';

interface SceneBaseProps {
  children: React.ReactNode;
  bgColor?: string;
  bgGradient?: boolean;
}

export const SceneBase: React.FC<SceneBaseProps> = ({
  children,
  bgColor = theme.colors.solar.bg,
  bgGradient = true,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: bgGradient
          ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
          : bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

interface ContentGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  columns = 2,
  gap = 24,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        width: '90%',
        maxWidth: 1280,
        margin: '0 auto',
        padding: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  padding?: number;
}

export const Section: React.FC<SectionProps> = ({
  children,
  align = 'center',
  padding = 24,
}) => {
  return (
    <div
      style={{
        textAlign: align,
        padding: `${padding}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
      }}
    >
      {children}
    </div>
  );
};

import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, Img } from 'remotion';
import { AdFilmProps, defaultAdFilmProps } from './props';
import { sceneFade, ramp } from '../lib/anim';

// 450 frames @ 30fps = 15 seconds
// Intro: 0-149 (5s), Main: 150-359 (7s), CTA: 360-449 (3s)

function IntroSection({ brand }: { brand: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const fade  = sceneFade(frame, 150, 12);

  return (
    <Sequence from={0} durationInFrames={150}>
      <AbsoluteFill
        style={{
          background: brand,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: fade,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            color: '#fff',
            fontSize: 72,
            fontWeight: 900,
            textAlign: 'center',
            letterSpacing: -2,
          }}
        >
          ✦
        </div>
      </AbsoluteFill>
    </Sequence>
  );
}

function MainSection({
  productImageUrl,
  productName,
  tagline,
  brand,
}: {
  productImageUrl?: string;
  productName: string;
  tagline: string;
  brand: string;
}) {
  const frame      = useCurrentFrame();
  const localFrame = frame - 150;
  const dur        = 210;
  const fade       = sceneFade(localFrame, dur, 15);
  const textY      = ramp(localFrame, 10, 30, 50, 0);

  return (
    <Sequence from={150} durationInFrames={dur}>
      <AbsoluteFill style={{ opacity: fade }}>
        {productImageUrl ? (
          <Img src={productImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f0f1a 0%, #1a0a2e 100%)' }} />
        )}
        <AbsoluteFill style={{ background: 'rgba(0,0,0,0.35)' }} />

        <div
          style={{
            position: 'absolute',
            bottom: 200,
            left: 60,
            right: 60,
            transform: `translateY(${textY}px)`,
            opacity: fade,
          }}
        >
          <p style={{ color: brand, fontSize: 28, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 2 }}>
            {tagline}
          </p>
          <p style={{ color: '#fff', fontSize: 56, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
            {productName}
          </p>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
}

function CTASection({ ctaText, brand }: { ctaText: string; brand: string }) {
  const frame      = useCurrentFrame();
  const localFrame = frame - 360;
  const { fps }    = useVideoConfig();

  const scale = spring({ frame: localFrame, fps, config: { damping: 15, stiffness: 120 } });
  const fade  = sceneFade(localFrame, 90, 8);

  return (
    <Sequence from={360} durationInFrames={90}>
      <AbsoluteFill
        style={{
          background: '#0f0f1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 32,
          opacity: fade,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            background: brand,
            borderRadius: 60,
            padding: '28px 80px',
          }}
        >
          <p style={{ color: '#fff', fontSize: 52, fontWeight: 900, margin: 0 }}>{ctaText}</p>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
}

export function AdFilm(props: AdFilmProps) {
  const {
    brandColor = '#7c3aed',
    ctaText = 'Shop Now',
    productImageUrl,
    productName = 'Your Product',
    tagline = 'Experience the difference',
  } = { ...defaultAdFilmProps, ...props };

  return (
    <AbsoluteFill style={{ background: '#0f0f1a' }}>
      <IntroSection brand={brandColor} />
      <MainSection productImageUrl={productImageUrl} productName={productName} tagline={tagline} brand={brandColor} />
      <CTASection ctaText={ctaText} brand={brandColor} />
    </AbsoluteFill>
  );
}

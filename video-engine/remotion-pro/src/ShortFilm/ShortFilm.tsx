import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig, spring, useCurrentFrame, Img, Audio, Video, staticFile } from 'remotion';
import { ShortFilmProps, defaultShortFilmProps } from './props';
import { sceneFade, ramp } from '../lib/anim';

function ShortScene({
  scene,
  startFrame,
  accent,
}: {
  scene: ShortFilmProps['scenes'][0];
  startFrame: number;
  accent: string;
}) {
  const frame       = useCurrentFrame();
  const { fps }     = useVideoConfig();
  const localFrame  = frame - startFrame;
  const dur         = scene.durationInFrames;

  const fade        = sceneFade(localFrame, dur, 10);
  const textY       = ramp(localFrame, 5, 20, 40, 0);

  return (
    <Sequence from={startFrame} durationInFrames={dur}>
      <AbsoluteFill style={{ opacity: fade }}>
        {/* Background */}
        {scene.imageUrl ? (
          <Img
            src={scene.imageUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f0f1a 0%, #1a0a2e 100%)' }} />
        )}

        {/* Dark overlay for readability */}
        <AbsoluteFill style={{ background: 'rgba(0,0,0,0.4)' }} />

        {/* Text overlay — bottom third */}
        {scene.overlayText && (
          <div
            style={{
              position: 'absolute',
              bottom: 160,
              left: 60,
              right: 60,
              transform: `translateY(${textY}px)`,
              opacity: fade,
            }}
          >
            <div
              style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                borderRadius: 16,
                padding: '20px 28px',
                borderLeft: `4px solid ${accent}`,
              }}
            >
              <p style={{ color: '#fff', fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                {scene.overlayText}
              </p>
            </div>
          </div>
        )}

        {/* Accent bar at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: accent,
          }}
        />

        {/* Narration audio */}
        {scene.narrationAudioPath && (
          <Audio src={staticFile(scene.narrationAudioPath)} volume={1} />
        )}

        {/* Talking-head avatar PIP — lower-right circle */}
        {scene.avatarVideoPath && (
          <div
            style={{
              position:     'absolute',
              bottom:       80,
              right:        60,
              width:        280,
              height:       280,
              borderRadius: '50%',
              overflow:     'hidden',
              border:       `4px solid ${accent}`,
              boxShadow:    '0 8px 32px rgba(0,0,0,0.6)',
              opacity:      fade,
            }}
          >
            <Video
              src={staticFile(scene.avatarVideoPath)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              volume={0}
            />
          </div>
        )}
      </AbsoluteFill>
    </Sequence>
  );
}

export function ShortFilm(props: ShortFilmProps) {
  const { scenes, accentColor = '#7c3aed' } = { ...defaultShortFilmProps, ...props };

  let cursor = 0;
  const sceneElements = scenes.map((scene) => {
    const start = cursor;
    cursor += scene.durationInFrames;
    return <ShortScene key={scene.id} scene={scene} startFrame={start} accent={accentColor} />;
  });

  return <AbsoluteFill style={{ background: '#0f0f1a' }}>{sceneElements}</AbsoluteFill>;
}

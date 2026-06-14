import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import timing from '../dream-timing.json';
import { DREAM_SCENES } from './dreamscenes';

export const DreamFilm: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      {timing.scenes.map((s) => {
        const Comp = DREAM_SCENES[s.id];
        const from = cursor; cursor += s.durationInFrames;
        if (!Comp) return null;
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.durationInFrames}>
            <Comp total={s.durationInFrames} />
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

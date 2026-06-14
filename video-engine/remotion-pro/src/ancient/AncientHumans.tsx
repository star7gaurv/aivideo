import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import timing from '../ancient-timing.json';
import { SCENES } from './scenes';
import { C } from './kit';

export const AncientHumans: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.night }}>
      {timing.scenes.map((s) => {
        const Comp = SCENES[s.id];
        const from = cursor;
        cursor += s.durationInFrames;
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

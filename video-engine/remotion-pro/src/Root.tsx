import React from 'react';
import { Composition } from 'remotion';
import { SolarFilm } from './SolarFilm';
import timing from './timing.json';
import { AncientHumans } from './ancient/AncientHumans';
import ancientTiming from './ancient-timing.json';
import { DreamProof } from './dream/DreamProof';
import { DreamFilm } from './dream/DreamFilm';
import dreamTiming from './dream-timing.json';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SolarFilm"
        component={SolarFilm}
        durationInFrames={timing.totalFrames}
        fps={timing.fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="AncientHumans"
        component={AncientHumans}
        durationInFrames={ancientTiming.totalFrames}
        fps={ancientTiming.fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="DreamProof"
        component={DreamProof}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DreamFilm"
        component={DreamFilm}
        durationInFrames={dreamTiming.totalFrames}
        fps={dreamTiming.fps}
        width={1920}
        height={1080}
      />
    </>
  );
};

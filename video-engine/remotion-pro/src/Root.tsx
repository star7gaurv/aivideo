import React from 'react';
import { Composition } from 'remotion';
import { SolarFilm } from './SolarFilm';
import timing from './timing.json';
import { AncientHumans } from './ancient/AncientHumans';
import ancientTiming from './ancient-timing.json';
import { DreamProof } from './dream/DreamProof';
import { DreamFilm } from './dream/DreamFilm';
import dreamTiming from './dream-timing.json';
import { ShortFilm } from './ShortFilm/ShortFilm';
import { defaultShortFilmProps, ShortFilmProps } from './ShortFilm/props';
import { AdFilm } from './AdFilm/AdFilm';
import { defaultAdFilmProps } from './AdFilm/props';

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
      <Composition
        id="ShortFilm"
        component={ShortFilm}
        durationInFrames={defaultShortFilmProps.scenes!.reduce((s, sc) => s + sc.durationInFrames, 0)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultShortFilmProps}
        calculateMetadata={({ props }: { props: ShortFilmProps }) => ({
          durationInFrames: (props.scenes ?? defaultShortFilmProps.scenes!).reduce(
            (s, sc) => s + (sc.durationInFrames || 90),
            0
          ),
        })}
      />
      <Composition
        id="AdFilm"
        component={AdFilm}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultAdFilmProps}
      />
    </>
  );
};

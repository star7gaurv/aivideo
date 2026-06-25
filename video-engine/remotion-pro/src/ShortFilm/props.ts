export interface ShortScene {
  id: string;
  narration: string;
  imageUrl?: string;
  overlayText?: string;
  durationInFrames: number;
  /** Relative path inside remotion-pro/public/, e.g. "tts/project-42/scene1.wav" */
  narrationAudioPath?: string;
  /**
   * Talking-head avatar MP4 from SadTalker.
   * Relative path inside remotion-pro/public/ — rendered as a PIP in the lower-right.
   * e.g. "avatars/42/7.mp4"
   */
  avatarVideoPath?: string;
}

export interface ShortFilmProps {
  scenes: ShortScene[];
  accentColor?: string;
  fontFamily?: string;
  musicFilePath?: string;
  narrationAudioFile?: string;
}

export const defaultShortFilmProps: ShortFilmProps = {
  scenes: [
    { id: 'scene1', narration: 'Welcome to your short video.',  imageUrl: undefined, overlayText: 'Your Story', durationInFrames: 90 },
    { id: 'scene2', narration: 'Share your message with the world.', imageUrl: undefined, overlayText: 'Your Message', durationInFrames: 90 },
    { id: 'scene3', narration: 'Take action today!', imageUrl: undefined, overlayText: 'Act Now', durationInFrames: 60 },
  ],
  accentColor: '#7c3aed',
  fontFamily: 'sans-serif',
};

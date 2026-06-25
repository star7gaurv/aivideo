import { create } from 'zustand';

export interface Scene {
  id: string;
  narration: string;
  imageUrl?: string;
  overlayText?: string;
  /** AI-suggested prompt for generating this scene's image */
  imagePrompt?: string;
  durationHint?: number;
  /** Storage-relative path returned by TTS generate, e.g. "tts/42/scene1.wav" */
  narrationAudioPath?: string;
  /** Public URL for browser preview of narration */
  narrationAudioUrl?: string;
  /** Storage-relative path of SadTalker avatar MP4, e.g. "avatars/1/7.mp4" */
  avatarVideoPath?: string;
  /** Public URL for browser preview of avatar video */
  avatarVideoUrl?: string;
}

export interface ProjectState {
  id: string | null;
  title: string;
  format: 'landscape' | 'portrait' | 'ad';
  templateId: string;
  scenes: Scene[];
  musicTrackId: number | null;
  style?: string;
  musicMood?: string;
  targetSeconds?: number;

  setId: (id: string) => void;
  setTitle: (title: string) => void;
  setFormat: (format: ProjectState['format']) => void;
  setTemplate: (id: string) => void;
  addScene: () => void;
  updateScene: (id: string, patch: Partial<Scene>) => void;
  removeScene: (id: string) => void;
  setScenes: (scenes: Scene[]) => void;
  reorderScenes: (from: number, to: number) => void;
  setMusic: (id: number | null) => void;
  setMeta: (patch: Partial<Pick<ProjectState, 'style' | 'musicMood' | 'targetSeconds'>>) => void;
  reset: () => void;
  loadFromApi: (project: Partial<ProjectState> & { config?: { scenes?: Scene[]; music_track_id?: number } }) => void;
}

const defaultScene = (): Scene => ({
  id: Math.random().toString(36).slice(2),
  narration: '',
});

export const useProjectStore = create<ProjectState>((set) => ({
  id: null,
  title: 'My Video',
  format: 'landscape',
  templateId: '',
  scenes: [defaultScene()],
  musicTrackId: null,

  setId: (id) => set({ id }),
  setTitle: (title) => set({ title }),
  setFormat: (format) => set({ format }),
  setTemplate: (templateId) => set({ templateId }),
  addScene: () => set((s) => ({ scenes: [...s.scenes, defaultScene()] })),
  updateScene: (id, patch) =>
    set((s) => ({ scenes: s.scenes.map((sc) => (sc.id === id ? { ...sc, ...patch } : sc)) })),
  removeScene: (id) => set((s) => ({ scenes: s.scenes.filter((sc) => sc.id !== id) })),
  setScenes: (scenes) => set({ scenes }),
  reorderScenes: (from, to) =>
    set((s) => {
      const next = [...s.scenes];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { scenes: next };
    }),
  setMusic: (musicTrackId) => set({ musicTrackId }),
  setMeta: (patch) => set(patch),
  reset: () => set({ id: null, title: 'My Video', format: 'landscape', templateId: '', scenes: [defaultScene()], musicTrackId: null }),
  loadFromApi: (project) =>
    set({
      id: project.id ?? null,
      title: project.title ?? 'My Video',
      format: project.format ?? 'landscape',
      templateId: project.templateId ?? '',
      scenes: project.config?.scenes ?? [defaultScene()],
      musicTrackId: project.config?.music_track_id ?? null,
    }),
}));

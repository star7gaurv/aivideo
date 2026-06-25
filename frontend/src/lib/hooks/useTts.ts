import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';

export interface TtsScene {
  id: string;
  audioUrl: string | null;
  audioPath: string | null;
  durationSec: number;
  durationInFrames: number;
  error?: string;
}

export interface TtsResult {
  scenes: TtsScene[];
  totalFrames: number;
  fps: number;
}

export function useGenerateTts() {
  return useMutation({
    mutationFn: (data: {
      scenes: { id: string; narration: string }[];
      project_id?: number;
    }) => api.post('/v1/tts/generate', data).then((r) => r.data as TtsResult),
  });
}

export function useTtsVoices() {
  return useQuery({
    queryKey: ['tts-voices'],
    queryFn: () => api.get('/v1/tts/voices').then((r) => r.data),
    staleTime: Infinity,
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface MusicTrack {
  id: number;
  title: string;
  artist: string | null;
  mood: string;
  source: string;
  duration_seconds: number;
  stream_url: string;
  preview_url: string | null;
  is_ai_generated: boolean;
}

export function useMusicTracks(mood?: string) {
  return useQuery<MusicTrack[]>({
    queryKey: ['music', mood],
    queryFn: () =>
      api.get('/v1/music', { params: mood ? { mood } : {} }).then((r) => r.data),
  });
}

export function useGenerateMusic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { mood: string; duration_seconds: number }) =>
      api.post('/v1/music/generate', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['music'] }),
  });
}

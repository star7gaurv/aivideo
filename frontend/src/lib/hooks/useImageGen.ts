import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface GeneratedImage {
  id: number;
  url: string;
  prompt: string;
  provider: string;
  width: number;
  height: number;
}

export function useGenerateImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { prompt: string; provider?: string; project_id?: number; width?: number; height?: number }) =>
      api.post('/v1/images/generate', data).then((r) => r.data as GeneratedImage),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['images'] }),
  });
}

export function useImages(projectId?: number) {
  return useQuery<GeneratedImage[]>({
    queryKey: ['images', projectId],
    queryFn: () =>
      api.get('/v1/images', { params: projectId ? { project_id: projectId } : {} }).then((r) => r.data),
  });
}

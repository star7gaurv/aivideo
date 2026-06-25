import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';

export interface RenderStatus {
  id: number;
  status: 'queued' | 'processing' | 'done' | 'failed';
  progress: number;
  output_url: string | null;
  log: string | null;
  started_at: string | null;
  done_at: string | null;
}

export function useRenderStatus(jobId: number | null) {
  return useQuery<RenderStatus>({
    queryKey: ['render', jobId],
    queryFn: () => api.get(`/v1/video/render/${jobId}/status`).then((r) => r.data),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'queued' || status === 'processing' ? 2000 : false;
    },
  });
}

export function useTriggerRender() {
  return useMutation({
    mutationFn: (projectId: number) =>
      api.post('/v1/video/render', { project_id: projectId }).then((r) => r.data),
  });
}

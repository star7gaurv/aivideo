import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface SocialAccount {
  id: number;
  platform: 'youtube' | 'instagram' | 'tiktok';
  platform_username: string | null;
  platform_channel_id: string | null;
  token_expires_at: string | null;
  created_at: string;
}

export interface PublishJob {
  id: number;
  status: 'queued' | 'processing' | 'done' | 'failed';
  platform: string;
  platform_video_id: string | null;
  platform_url: string | null;
  published_at: string | null;
  log: string | null;
}

export function useSocialAccounts() {
  return useQuery({
    queryKey: ['social-accounts'],
    queryFn: () => api.get('/v1/social/accounts').then((r) => r.data as SocialAccount[]),
  });
}

export function useConnectPlatform() {
  return useMutation({
    mutationFn: (platform: string) =>
      api.get(`/v1/social/connect/${platform}`).then((r) => r.data as { url: string }),
  });
}

export function useDisconnectPlatform() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (platform: string) => api.delete(`/v1/social/${platform}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-accounts'] }),
  });
}

export function usePublishVideo() {
  return useMutation({
    mutationFn: (data: {
      project_id: number;
      platform: string;
      title?: string;
      description?: string;
    }) => api.post('/v1/publish', data).then((r) => r.data as { id: number; status: string }),
  });
}

export function usePublishStatus(jobId: number | null) {
  return useQuery({
    queryKey: ['publish-status', jobId],
    queryFn: () => api.get(`/v1/publish/${jobId}/status`).then((r) => r.data as PublishJob),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      return s === 'queued' || s === 'processing' ? 4000 : false;
    },
  });
}

export function useProjectPublishJobs(projectId: number | null) {
  return useQuery({
    queryKey: ['publish-jobs', projectId],
    queryFn: () =>
      api.get('/v1/publish', { params: { project_id: projectId } }).then((r) => r.data as PublishJob[]),
    enabled: !!projectId,
  });
}

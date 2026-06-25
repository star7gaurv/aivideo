import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface AvatarJob {
  id: number;
  status: 'queued' | 'processing' | 'done' | 'failed';
  videoUrl: string | null;
  durationSec: number | null;
  log?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface AvatarGenerateResponse {
  id: number;
  status: string;
  message: string;
  status_url: string;
}

export function useGenerateAvatar() {
  return useMutation({
    mutationFn: (data: {
      face_image: File;
      audio_path?: string;
      project_id?: number;
      scene_id?: string;
    }) => {
      const form = new FormData();
      form.append('face_image', data.face_image);
      if (data.audio_path) form.append('audio_path', data.audio_path);
      if (data.project_id) form.append('project_id', String(data.project_id));
      if (data.scene_id) form.append('scene_id', data.scene_id);
      return api.post('/v1/avatars', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data as AvatarGenerateResponse);
    },
  });
}

export function useAvatarStatus(jobId: number | null) {
  return useQuery({
    queryKey: ['avatar-status', jobId],
    queryFn: () => api.get(`/v1/avatars/${jobId}/status`).then((r) => r.data as AvatarJob),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'queued' || status === 'processing' ? 4000 : false;
    },
  });
}

export function useAvatarList() {
  return useQuery({
    queryKey: ['avatars'],
    queryFn: () => api.get('/v1/avatars').then((r) => r.data as AvatarJob[]),
  });
}

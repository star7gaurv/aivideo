import { useMutation } from '@tanstack/react-query';
import api from '../api';

export interface VideoIdea { title: string; hook: string; angle?: string; }

export interface ChannelPlan {
  niche: string;
  description: string;
  audience: string;
  why_it_works: string;
  video_ideas: { title: string; hook: string }[];
  schedule: string;
}

export interface ScriptScene { narration: string; overlayText: string; imagePrompt: string; }
export interface GeneratedScript {
  title: string;
  musicMood: string;
  style: string;
  format: 'landscape' | 'portrait' | 'ad';
  scenes: ScriptScene[];
}

export function useIdeas() {
  return useMutation({
    mutationFn: (interest?: string) =>
      api.post('/v1/assist/ideas', { interest }).then((r) => r.data.ideas as VideoIdea[]),
  });
}

export function useChannelPlan() {
  return useMutation({
    mutationFn: (passion?: string) =>
      api.post('/v1/assist/channel', { passion }).then((r) => r.data as ChannelPlan),
  });
}

export function useGenerateScript() {
  return useMutation({
    mutationFn: (data: { topic: string; format?: string; target_seconds?: number }) =>
      api.post('/v1/assist/script', data).then((r) => r.data as GeneratedScript),
  });
}

export function useRewrite() {
  return useMutation({
    mutationFn: (data: { text: string; instruction?: string }) =>
      api.post('/v1/assist/rewrite', data).then((r) => r.data.text as string),
  });
}

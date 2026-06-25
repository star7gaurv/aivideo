import { useQuery } from '@tanstack/react-query';
import api from '../api';

export interface Template {
  id: string;
  name: string;
  format: 'landscape' | 'portrait' | 'ad';
  width: number;
  height: number;
  duration_sec: number;
  description: string;
  thumbnail_url: string | null;
  scenes: string[];
}

export function useTemplates() {
  return useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: () => api.get('/v1/templates').then((r) => r.data),
    staleTime: Infinity,
  });
}

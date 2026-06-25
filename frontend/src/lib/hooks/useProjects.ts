import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export interface Project {
  id: number;
  title: string;
  format: 'landscape' | 'portrait' | 'ad';
  template_id: string;
  config: Record<string, unknown>;
  status: 'draft' | 'rendering' | 'done' | 'failed';
  output_path: string | null;
  updated_at: string;
}

export function useProjects() {
  return useQuery<{ data: Project[] }>({
    queryKey: ['projects'],
    queryFn: () => api.get('/v1/projects').then((r) => r.data),
  });
}

export function useProject(id: string | number) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: () => api.get(`/v1/projects/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => api.post('/v1/projects', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Project> & { id: number }) =>
      api.put(`/v1/projects/${id}`, data).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['projects', vars.id] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/v1/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

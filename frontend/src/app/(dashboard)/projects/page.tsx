'use client';
import Link from 'next/link';
import { useProjects, useDeleteProject } from '@/lib/hooks/useProjects';
import { Badge }    from '@/components/ui/Badge';
import { Button }   from '@/components/ui/Button';
import { Spinner }  from '@/components/ui/Spinner';
import {
  Plus, Trash2, Pencil, Download, Film, Clock, CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';

const STATUS_STYLES: Record<string, { color: string; icon: React.ReactNode }> = {
  draft:     { color: 'text-zinc-400',  icon: <Clock className="h-3 w-3" /> },
  rendering: { color: 'text-amber-400', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
  done:      { color: 'text-green-400', icon: <CheckCircle2 className="h-3 w-3" /> },
  failed:    { color: 'text-red-400',   icon: <AlertCircle className="h-3 w-3" /> },
};

const FORMAT_LABEL: Record<string, string> = {
  landscape: '16:9',
  portrait:  '9:16',
  ad:        '15s Ad',
};

export default function ProjectsPage() {
  const { data, isLoading }  = useProjects();
  const { mutate: del, isPending: isDeleting } = useDeleteProject();
  const projects = data?.data ?? [];

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">My Projects</h1>
        <Link href="/projects/new">
          <Button><Plus className="h-4 w-4" /> New Video</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <Film className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 mb-4">No projects yet. Create your first video!</p>
          <Link href="/projects/new">
            <Button><Plus className="h-4 w-4" /> Create Video</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const statusInfo = STATUS_STYLES[p.status] ?? STATUS_STYLES.draft;
            const sceneCount = (p.config?.scenes as unknown[])?.length ?? 0;

            return (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-colors">
                {/* Thumbnail / placeholder */}
                <div className="h-28 bg-zinc-800 relative flex items-center justify-center">
                  {p.output_path ? (
                    <video
                      src={`/storage/${p.output_path}`}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <Film className="h-8 w-8 text-zinc-700" />
                  )}
                  {/* Format pill */}
                  <span className="absolute top-2 left-2 text-[10px] font-medium bg-black/60 text-zinc-300 px-2 py-0.5 rounded-full">
                    {FORMAT_LABEL[p.format] ?? p.format}
                  </span>
                  {/* Status pill */}
                  <span className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium bg-black/60 px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                    {statusInfo.icon} {p.status}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-zinc-100 truncate text-sm leading-tight">
                      {p.title}
                    </h3>
                    <button
                      onClick={() => del(p.id)}
                      disabled={isDeleting}
                      className="text-zinc-600 hover:text-red-400 shrink-0 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{sceneCount} scene{sceneCount !== 1 ? 's' : ''}</span>
                    <span>·</span>
                    <span>{new Date(p.updated_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/projects/${p.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                    </Link>
                    {p.status === 'done' && p.output_path && (
                      <a href={`/storage/${p.output_path}`} download>
                        <Button size="sm" title="Download rendered video">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

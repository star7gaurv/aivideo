'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Clock, CheckCircle2, Download } from 'lucide-react';
import { useProject }      from '@/lib/hooks/useProjects';
import { useProjectStore } from '@/store/projectStore';
import { ProjectWizard }   from '@/components/dashboard/ProjectWizard';
import { Spinner }         from '@/components/ui/Spinner';
import { Badge }           from '@/components/ui/Badge';
import { Scene }           from '@/store/projectStore';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: PageProps) {
  const { id }             = use(params);
  const { data, isLoading, isError } = useProject(id);
  const loadFromApi        = useProjectStore((s) => s.loadFromApi);
  const [ready, setReady]  = useState(false);

  useEffect(() => {
    if (!data) return;
    loadFromApi({
      id:         String(data.id),
      title:      data.title,
      format:     data.format,
      templateId: data.template_id,
      config:     data.config as {
        scenes?: Scene[];
        music_track_id?: number;
      },
    });
    setReady(true);
  }, [data, loadFromApi]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
        <p className="text-zinc-300">Project not found or you don't have access.</p>
        <Link href="/dashboard/projects" className="text-violet-400 hover:text-violet-300 text-sm">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const statusIcon = {
    draft:     <Clock className="h-3.5 w-3.5" />,
    rendering: <Spinner size="sm" />,
    done:      <CheckCircle2 className="h-3.5 w-3.5" />,
    failed:    <AlertCircle className="h-3.5 w-3.5" />,
  }[data.status];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/projects"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-zinc-100 truncate">{data.title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge label={data.format} />
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              {statusIcon} {data.status}
            </span>
            <span className="text-xs text-zinc-600">
              Updated {new Date(data.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        {data.status === 'done' && data.output_path && (
          <a
            href={`/storage/${data.output_path}`}
            download
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 border border-violet-700 hover:border-violet-500 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        )}
      </div>

      {/* Wizard (starts at Content step since format/template already set) */}
      {ready ? (
        <ProjectWizard initialStep={2} />
      ) : (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Rocket, Download, Youtube, Instagram, CheckCircle2, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useCreateProject, useUpdateProject } from '@/lib/hooks/useProjects';
import { useTriggerRender } from '@/lib/hooks/useRenderStatus';
import { useSocialAccounts, usePublishVideo, usePublishStatus } from '@/lib/hooks/usePublish';
import { Button }        from '../ui/Button';
import { Badge }         from '../ui/Badge';
import { RenderStatus }  from './RenderStatus';
import { PlatformConnect } from './PlatformConnect';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube:   <Youtube className="h-4 w-4 text-red-400" />,
  instagram: <Instagram className="h-4 w-4 text-pink-400" />,
};

function PublishToButton({
  platform,
  projectId,
  title,
}: {
  platform: string;
  projectId: number;
  title: string;
}) {
  const [jobId, setJobId] = useState<number | null>(null);
  const { mutate: publish, isPending } = usePublishVideo();
  const { data: status } = usePublishStatus(jobId);

  const handlePublish = () => {
    publish({ project_id: projectId, platform, title }, { onSuccess: (r) => setJobId(r.id) });
  };

  if (status?.status === 'done') {
    return (
      <a
        href={status.platform_url ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Published <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  if (status?.status === 'failed') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-red-400" title={status.log ?? ''}>
        <AlertCircle className="h-3.5 w-3.5" /> Failed
      </span>
    );
  }

  if (jobId && (status?.status === 'queued' || status?.status === 'processing')) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {status.status === 'processing' ? 'Uploading…' : 'Queued…'}
      </span>
    );
  }

  return (
    <button
      onClick={handlePublish}
      disabled={isPending}
      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-violet-400 border border-zinc-700 hover:border-violet-500 rounded-md px-2.5 py-1 transition-colors"
    >
      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : PLATFORM_ICONS[platform]}
      Publish to {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </button>
  );
}

export function PublishPanel() {
  const store                              = useProjectStore();
  const [jobId, setJobId]                  = useState<number | null>(null);
  const [renderDone, setRenderDone]        = useState(store.id !== null);
  const createProject                      = useCreateProject();
  const updateProject                      = useUpdateProject();
  const triggerRender                      = useTriggerRender();
  const isRendering                        = triggerRender.isPending || createProject.isPending || updateProject.isPending;
  const { data: socialAccounts = [] }      = useSocialAccounts();
  const connectedPlatforms                 = socialAccounts.map((a) => a.platform);

  const handleRender = async () => {
    const config = {
      scenes:         store.scenes,
      music_track_id: store.musicTrackId,
    };

    let projectId = store.id ? parseInt(store.id) : null;

    if (!projectId) {
      const project = await createProject.mutateAsync({
        title:       store.title,
        format:      store.format,
        template_id: store.templateId,
        config,
      } as never);
      projectId = (project as { id: number }).id;
      store.setId(String(projectId));
    } else {
      await updateProject.mutateAsync({ id: projectId, config } as never);
    }

    const result = await triggerRender.mutateAsync(projectId!);
    setJobId(result.render_job_id);
  };

  const projectId = store.id ? parseInt(store.id) : null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-zinc-100">Publish</h2>

      {/* Summary */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-2">
        <p className="text-sm text-zinc-300">
          <span className="text-zinc-500">Title: </span>{store.title}
        </p>
        <div className="flex gap-2 flex-wrap items-center">
          <Badge label={store.format} />
          <span className="text-xs text-zinc-500">{store.templateId || '—'}</span>
          <span className="text-xs text-zinc-500">{store.scenes.length} scene{store.scenes.length !== 1 ? 's' : ''}</span>
          {store.musicTrackId && <span className="text-xs text-green-400">♪ Music</span>}
          {store.scenes.some((s) => s.avatarVideoUrl) && <span className="text-xs text-violet-400">👤 Avatar</span>}
        </div>
      </div>

      {/* Render */}
      <div className="space-y-3">
        {!jobId ? (
          <Button onClick={handleRender} loading={isRendering} size="lg" className="w-full">
            <Rocket className="h-5 w-5" /> Render Video
          </Button>
        ) : (
          <RenderStatus
            jobId={jobId}
            onDone={() => setRenderDone(true)}
          />
        )}
      </div>

      {/* Platform publishing — shown after render */}
      {(renderDone || (store.id && !jobId)) && projectId && (
        <div className="space-y-4 border-t border-zinc-800 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-200">Publish to platforms</h3>
          </div>

          {connectedPlatforms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {connectedPlatforms.map((platform) => (
                <PublishToButton
                  key={platform}
                  platform={platform}
                  projectId={projectId}
                  title={store.title}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500">
              No platforms connected yet. Connect below to publish directly.
            </p>
          )}

          {/* Platform connect / disconnect */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <PlatformConnect />
          </div>
        </div>
      )}
    </div>
  );
}

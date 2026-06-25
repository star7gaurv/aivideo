'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/store/projectStore';
import { useProject, useUpdateProject } from '@/lib/hooks/useProjects';
import { useTriggerRender, useRenderStatus } from '@/lib/hooks/useRenderStatus';
import { useGenerateTts } from '@/lib/hooks/useTts';
import { useGenerateImage } from '@/lib/hooks/useImageGen';
import api from '@/lib/api';
import { StudioTopBar } from './StudioTopBar';
import { SceneList }    from './SceneList';
import { SceneCanvas }  from './SceneCanvas';
import { SceneEditor }  from './SceneEditor';
import { MusicPicker }  from '@/components/dashboard/MusicPicker';
import { PublishPanel } from '@/components/dashboard/PublishPanel';
import { Loader2, Download, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props { projectId: string; }

export function StudioLayout({ projectId }: Props) {
  const params = useSearchParams();
  const { data: project, isLoading } = useProject(projectId);
  const { mutate: updateProject }    = useUpdateProject();
  const { mutate: triggerRender }    = useTriggerRender();
  const { mutateAsync: genTts }      = useGenerateTts();
  const { mutateAsync: genImage }    = useGenerateImage();

  const store = useProjectStore();
  const { title, format, scenes, musicTrackId, musicMood, setTitle, setFormat, addScene, removeScene, updateScene, setMusic, loadFromApi } = store;

  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [showMusic,    setShowMusic]       = useState(false);
  const [showPublish,  setShowPublish]     = useState(false);
  const [renderJobId,  setRenderJobId]     = useState<number | null>(null);
  const [renderError,  setRenderError]     = useState<string | null>(null);
  const [generating,   setGenerating]      = useState(false);
  const [genMsg,       setGenMsg]          = useState('');
  const autoRan = useRef(false);

  const { data: renderStatus } = useRenderStatus(renderJobId);

  /* Hydrate musicMood from project config */
  useEffect(() => {
    const cfg = (project?.config ?? {}) as { music_mood?: string };
    if (cfg.music_mood) store.setMeta({ musicMood: cfg.music_mood });
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Batch-generate voice + images + music for all scenes */
  const generateEverything = async () => {
    if (generating || !store.id) return;
    setGenerating(true);
    try {
      const pid = Number(store.id);
      const cur = useProjectStore.getState().scenes;

      // 1) Narration (one batch call for all scenes with text)
      const withText = cur.filter((s) => s.narration?.trim());
      if (withText.length) {
        setGenMsg('Generating voiceover…');
        const res = await genTts({ project_id: pid, scenes: withText.map((s) => ({ id: s.id, narration: s.narration })) });
        res.scenes?.forEach((r) => updateScene(r.id, {
          narrationAudioUrl:  r.audioUrl  ?? undefined,
          narrationAudioPath: r.audioPath ?? undefined,
          durationHint:       r.durationInFrames,
        }));
      }

      // 2) Images (parallel, for scenes that have a prompt but no image yet)
      const isPortrait = useProjectStore.getState().format !== 'landscape';
      const w = isPortrait ? 768 : 1280;
      const h = isPortrait ? 1280 : 720;
      const needImg = useProjectStore.getState().scenes.filter((s) => s.imagePrompt && !s.imageUrl);
      if (needImg.length) {
        setGenMsg(`Generating ${needImg.length} images…`);
        await Promise.all(needImg.map(async (s) => {
          try {
            const img = await genImage({ prompt: s.imagePrompt!, provider: 'pollinations', project_id: pid, width: w, height: h });
            updateScene(s.id, { imageUrl: img.url });
          } catch { /* skip failed image */ }
        }));
      }

      // 3) Auto-pick music by mood
      if (!useProjectStore.getState().musicTrackId && musicMood) {
        setGenMsg('Picking music…');
        try {
          const tracks = await api.get('/v1/music', { params: { mood: musicMood } }).then((r) => r.data);
          if (Array.isArray(tracks) && tracks.length) setMusic(tracks[0].id);
        } catch { /* ignore */ }
      }
    } finally {
      setGenerating(false);
      setGenMsg('');
    }
  };

  /* Auto-run generation once when arriving fresh from the create flow */
  useEffect(() => {
    if (autoRan.current) return;
    if (params.get('fresh') === '1' && store.id && scenes.length > 0) {
      autoRan.current = true;
      generateEverything();
    }
  }, [store.id, scenes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Hydrate store from API on mount */
  useEffect(() => {
    if (project) {
      loadFromApi(project as Parameters<typeof loadFromApi>[0]);
    }
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Auto-select first scene */
  useEffect(() => {
    if (scenes.length > 0 && !activeSceneId) {
      setActiveSceneId(scenes[0].id);
    }
  }, [scenes, activeSceneId]);

  /* Auto-save on changes (debounced) */
  useEffect(() => {
    if (!store.id) return;
    const t = setTimeout(() => {
      updateProject({
        id: Number(store.id),
        title,
        format,
        template_id: store.templateId || (format === 'ad' ? 'AdFilm' : 'ShortFilm'),
        config: { scenes, music_track_id: musicTrackId } as Record<string, unknown>,
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [title, format, scenes, musicTrackId]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeScene = scenes.find(s => s.id === activeSceneId) ?? null;
  const activeIdx   = scenes.findIndex(s => s.id === activeSceneId);

  const handleRender = () => {
    if (!store.id) return;
    setRenderError(null);
    triggerRender(Number(store.id), {
      onSuccess: (data) => setRenderJobId(data.render_job_id),
      onError:   ()     => setRenderError('Failed to start render. Check your scenes have content.'),
    });
  };

  const handleAddScene = () => {
    addScene();
    const newId = store.scenes[store.scenes.length - 1]?.id;
    if (newId) setTimeout(() => setActiveSceneId(newId), 50);
  };

  const handleDeleteScene = (id: string) => {
    if (scenes.length <= 1) return;
    const idx = scenes.findIndex(s => s.id === id);
    removeScene(id);
    const remaining = scenes.filter(s => s.id !== id);
    setActiveSceneId(remaining[Math.max(0, idx - 1)]?.id ?? null);
  };

  const rsStatus   = renderStatus?.status ?? 'idle';
  const hasOutput  = !!renderStatus?.output_url || project?.status === 'done';
  const outputUrl  = renderStatus?.output_url;

  const totalSec = scenes.reduce((acc, s) => acc + Math.round((s.durationHint ?? 90) / 30), 0);
  const music    = musicTrackId ? `Track #${musicTrackId}` : 'No music';

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      <StudioTopBar
        title={title}
        format={format}
        renderStatus={rsStatus}
        hasOutput={hasOutput}
        generating={generating}
        onTitleChange={setTitle}
        onFormatChange={setFormat}
        onGenerateAll={generateEverything}
        onMusicClick={() => setShowMusic(true)}
        onRenderClick={handleRender}
        onPublishClick={() => setShowPublish(true)}
      />

      {/* Generation banner */}
      {generating && (
        <div className="bg-violet-950/40 border-b border-violet-800/40 px-4 py-2 flex items-center gap-2 shrink-0">
          <Loader2 className="h-3.5 w-3.5 text-violet-400 animate-spin" />
          <span className="text-xs text-violet-200">{genMsg || 'Generating…'}</span>
        </div>
      )}

      {/* Main 3-panel area */}
      <div className="flex flex-1 overflow-hidden">
        <SceneList
          scenes={scenes}
          activeId={activeSceneId}
          onSelect={setActiveSceneId}
          onAdd={handleAddScene}
          onDelete={handleDeleteScene}
          onReorder={store.reorderScenes}
        />
        <SceneCanvas
          scene={activeScene}
          format={format}
          sceneIndex={Math.max(0, activeIdx)}
          totalScenes={scenes.length}
          onPrev={() => { if (activeIdx > 0) setActiveSceneId(scenes[activeIdx - 1].id); }}
          onNext={() => { if (activeIdx < scenes.length - 1) setActiveSceneId(scenes[activeIdx + 1].id); }}
        />
        <SceneEditor
          scene={activeScene}
          projectId={store.id}
          format={format}
        />
      </div>

      {/* Status bar */}
      <div className="h-8 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 gap-4 shrink-0">
        <span className="text-[11px] text-zinc-600">{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</span>
        <span className="text-[11px] text-zinc-600">~{totalSec}s total</span>
        <span className="text-[11px] text-zinc-600">{music}</span>
        {project?.status && (
          <span className={`text-[11px] font-medium ml-auto capitalize ${
            project.status === 'done' ? 'text-green-400' :
            project.status === 'rendering' ? 'text-amber-400' :
            project.status === 'failed' ? 'text-red-400' : 'text-zinc-600'
          }`}>
            {project.status}
          </span>
        )}
      </div>

      {/* Render progress overlay */}
      {renderJobId && (rsStatus === 'queued' || rsStatus === 'processing') && (
        <div className="fixed bottom-12 right-6 w-72 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-4 z-40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-zinc-200">Rendering…</span>
            <Loader2 className="h-4 w-4 text-violet-400 animate-spin" />
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${renderStatus?.progress ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">{renderStatus?.progress ?? 0}% complete</p>
        </div>
      )}

      {/* Render done toast */}
      {rsStatus === 'done' && outputUrl && (
        <div className="fixed bottom-12 right-6 w-72 bg-zinc-900 border border-green-700/60 rounded-2xl shadow-2xl p-4 z-40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Render complete!
            </span>
            <button onClick={() => setRenderJobId(null)} className="text-zinc-600 hover:text-zinc-400">
              <X className="h-4 w-4" />
            </button>
          </div>
          <a
            href={outputUrl} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-semibold bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download MP4
          </a>
        </div>
      )}

      {/* Render failed toast */}
      {(rsStatus === 'failed' || renderError) && (
        <div className="fixed bottom-12 right-6 w-72 bg-zinc-900 border border-red-700/60 rounded-2xl shadow-2xl p-4 z-40">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Render failed
            </span>
            <button onClick={() => { setRenderJobId(null); setRenderError(null); }} className="text-zinc-600 hover:text-zinc-400">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">{renderStatus?.log ?? renderError}</p>
        </div>
      )}

      {/* Music modal */}
      {showMusic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-base font-bold text-zinc-100">Choose Music</h2>
              <button onClick={() => setShowMusic(false)} className="text-zinc-500 hover:text-zinc-300"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <MusicPicker />
            </div>
          </div>
        </div>
      )}

      {/* Publish modal */}
      {showPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-base font-bold text-zinc-100">Publish Video</h2>
              <button onClick={() => setShowPublish(false)} className="text-zinc-500 hover:text-zinc-300"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <PublishPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

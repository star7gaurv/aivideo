'use client';
import { useState } from 'react';
import { Mic, Image as ImageIcon, Type, User, ChevronDown, ChevronRight, Loader2, Play } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useGenerateTts } from '@/lib/hooks/useTts';
import { ImageGenerator } from '@/components/dashboard/ImageGenerator';
import { AvatarCreator } from '@/components/dashboard/AvatarCreator';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import type { Scene } from '@/store/projectStore';

interface Props {
  scene: Scene | null;
  projectId: string | null;
  format: 'landscape' | 'portrait' | 'ad';
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
        </div>
        {open ? <ChevronDown className="h-3.5 w-3.5 text-zinc-600" /> : <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function SceneEditor({ scene, projectId, format }: Props) {
  const updateScene   = useProjectStore(s => s.updateScene);
  const scenes        = useProjectStore(s => s.scenes);
  const { mutate: generateTts, isPending: ttsLoading } = useGenerateTts();

  const [showImageGen, setShowImageGen]   = useState(false);
  const [showAvatar, setShowAvatar]       = useState(false);

  if (!scene) {
    return (
      <aside className="w-80 shrink-0 bg-zinc-900 border-l border-zinc-800 flex items-center justify-center">
        <p className="text-sm text-zinc-600 text-center px-6">Select a scene from<br />the left to edit it</p>
      </aside>
    );
  }

  const handleGenerateTts = () => {
    if (!projectId) return;
    generateTts(
      { projectId, scenes: scenes.map(s => ({ id: s.id, narration: s.narration })) },
      {
        onSuccess: (data) => {
          data.scenes?.forEach((r: { id: string; audioUrl: string; audioPath: string; durationInFrames: number }) => {
            updateScene(r.id, {
              narrationAudioUrl: r.audioUrl,
              narrationAudioPath: r.audioPath,
              durationHint: r.durationInFrames,
            });
          });
        },
      }
    );
  };

  return (
    <aside className="w-80 shrink-0 bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-10 flex items-center px-4 border-b border-zinc-800 shrink-0">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Scene Properties</span>
      </div>

      {/* Scrollable panels */}
      <div className="flex-1 overflow-y-auto">

        {/* Narration */}
        <Section title="Narration" icon={Mic} defaultOpen={true}>
          <textarea
            rows={4}
            value={scene.narration}
            onChange={e => updateScene(scene.id, { narration: e.target.value })}
            placeholder="Write what will be spoken in this scene…"
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 resize-none outline-none transition-colors"
          />
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleGenerateTts}
              disabled={ttsLoading || !scene.narration}
              className="flex items-center gap-1.5 text-xs font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {ttsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mic className="h-3.5 w-3.5" />}
              Generate Voice
            </button>
            {scene.narrationAudioUrl && (
              <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                <Play className="h-2.5 w-2.5" /> TTS ready
              </span>
            )}
          </div>
          {scene.narrationAudioUrl && (
            <div className="mt-2">
              <AudioPlayer src={scene.narrationAudioUrl} />
            </div>
          )}
        </Section>

        {/* Image */}
        <Section title="Scene Image" icon={ImageIcon} defaultOpen={false}>
          {scene.imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={scene.imageUrl} alt="" className="w-full rounded-xl mb-3 object-cover h-28" />
          )}
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 px-3 py-2 rounded-xl cursor-pointer transition-colors">
              <ImageIcon className="h-3.5 w-3.5" /> Upload
              <input
                type="file" accept="image/*" className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  updateScene(scene.id, { imageUrl: url });
                }}
              />
            </label>
            <button
              onClick={() => setShowImageGen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-violet-600/20 hover:bg-violet-600/30 border border-violet-700/50 text-violet-300 px-3 py-2 rounded-xl transition-colors"
            >
              ✨ Generate AI
            </button>
          </div>
          {showImageGen && (
            <div className="mt-3">
              <ImageGenerator
                onSelect={url => { updateScene(scene.id, { imageUrl: url }); setShowImageGen(false); }}
                onClose={() => setShowImageGen(false)}
              />
            </div>
          )}
        </Section>

        {/* Overlay text */}
        <Section title="Overlay Text" icon={Type} defaultOpen={false}>
          <input
            type="text"
            value={scene.overlayText ?? ''}
            onChange={e => updateScene(scene.id, { overlayText: e.target.value })}
            placeholder="Text shown over the scene…"
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
          />
          <p className="text-[10px] text-zinc-600 mt-1.5">Appears as a heading overlay on the video frame.</p>
        </Section>

        {/* Avatar (portrait/ad only) */}
        {(format === 'portrait' || format === 'ad') && (
          <Section title="Talking Avatar" icon={User} defaultOpen={false}>
            {scene.avatarVideoUrl && (
              <div className="flex items-center gap-2 mb-3 bg-green-950/30 border border-green-700/40 rounded-xl px-3 py-2">
                <User className="h-4 w-4 text-green-400 shrink-0" />
                <span className="text-xs text-green-400">Avatar generated — will appear bottom-right</span>
              </div>
            )}
            <button
              onClick={() => setShowAvatar(true)}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium border border-zinc-700 hover:border-violet-500 text-zinc-400 hover:text-violet-300 px-3 py-2.5 rounded-xl transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              {scene.avatarVideoUrl ? 'Replace Avatar' : 'Upload Face → Generate Avatar'}
            </button>
            {showAvatar && (
              <div className="mt-3">
                <AvatarCreator
                  sceneId={scene.id}
                  narrationAudioPath={scene.narrationAudioPath}
                  projectId={projectId ? Number(projectId) : undefined}
                  onSelect={(videoUrl, storagePath) => {
                    updateScene(scene.id, { avatarVideoUrl: videoUrl, avatarVideoPath: storagePath });
                    setShowAvatar(false);
                  }}
                  onClose={() => setShowAvatar(false)}
                />
              </div>
            )}
          </Section>
        )}
      </div>
    </aside>
  );
}

'use client';
import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Mic, CheckCircle2, User, Video } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { Button } from '../ui/Button';
import { ImageGenerator } from './ImageGenerator';
import { AvatarCreator } from './AvatarCreator';
import { AudioPlayer } from '../ui/AudioPlayer';
import { useGenerateTts } from '@/lib/hooks/useTts';

export function ContentEditor() {
  const {
    title, setTitle,
    scenes, addScene, updateScene, removeScene,
    id: projectId,
  } = useProjectStore();

  const [imageSceneId, setImageSceneId]   = useState<string | null>(null);
  const [avatarSceneId, setAvatarSceneId] = useState<string | null>(null);

  const { mutate: generateTts, isPending: isGeneratingTts } = useGenerateTts();

  const handleGenerateNarration = () => {
    const scenesToGenerate = scenes.filter((s) => s.narration?.trim());
    if (!scenesToGenerate.length) return;

    generateTts(
      {
        scenes: scenesToGenerate.map((s) => ({ id: s.id, narration: s.narration })),
        project_id: projectId ? parseInt(projectId) : undefined,
      },
      {
        onSuccess: (data) => {
          data.scenes.forEach((ttsScene) => {
            if (!ttsScene.audioUrl) return;
            updateScene(ttsScene.id, {
              narrationAudioUrl:  ttsScene.audioUrl,
              // Derive storage-relative path from the URL: strip origin + /storage/
              narrationAudioPath: ttsScene.audioUrl.replace(/^https?:\/\/[^/]+\/storage\//, ''),
              durationHint:       ttsScene.durationInFrames,
            });
          });
        },
      }
    );
  };

  const hasNarration    = scenes.some((s) => s.narration?.trim());
  const generatedCount  = scenes.filter((s) => s.narrationAudioUrl).length;
  const avatarSceneObj  = avatarSceneId ? scenes.find((s) => s.id === avatarSceneId) : null;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Edit content</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerateNarration}
          loading={isGeneratingTts}
          disabled={!hasNarration}
          title="Generate AI narration audio for all scenes"
        >
          <Mic className="h-4 w-4" />
          {isGeneratingTts
            ? 'Generating…'
            : generatedCount > 0
            ? `Regenerate narration (${generatedCount})`
            : 'Generate narration'}
        </Button>
      </div>

      {generatedCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950/30 border border-green-900 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Narration ready for {generatedCount} scene{generatedCount !== 1 ? 's' : ''}. Audio mixes into the final render.
        </div>
      )}

      {/* Video title */}
      <div>
        <label className="text-sm text-zinc-400 mb-1 block">Video title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          placeholder="My Awesome Video"
        />
      </div>

      {/* Scene list */}
      <div className="space-y-3">
        {scenes.map((scene, i) => (
          <div key={scene.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            {/* Scene header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono">Scene {i + 1}</span>
                {scene.narrationAudioUrl && (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle2 className="h-3 w-3" /> narrated
                  </span>
                )}
                {scene.avatarVideoUrl && (
                  <span className="flex items-center gap-1 text-xs text-violet-400">
                    <User className="h-3 w-3" /> avatar
                  </span>
                )}
              </div>
              {scenes.length > 1 && (
                <button
                  onClick={() => removeScene(scene.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Narration textarea */}
            <textarea
              value={scene.narration}
              onChange={(e) => updateScene(scene.id, { narration: e.target.value })}
              rows={3}
              placeholder="Narration / script for this scene…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-500"
            />

            {/* Narration audio preview */}
            {scene.narrationAudioUrl && (
              <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                <Mic className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                <AudioPlayer src={scene.narrationAudioUrl} label="Preview narration" />
                {scene.durationHint && (
                  <span className="text-xs text-zinc-500 ml-auto">
                    {(scene.durationHint / 30).toFixed(1)}s
                  </span>
                )}
              </div>
            )}

            {/* Avatar video preview */}
            {scene.avatarVideoUrl && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-violet-400">
                  <User className="h-3 w-3" /> Talking avatar (PIP overlay in video)
                  <button
                    className="ml-auto text-zinc-500 hover:text-red-400 text-xs"
                    onClick={() => updateScene(scene.id, { avatarVideoUrl: undefined, avatarVideoPath: undefined })}
                  >
                    Remove
                  </button>
                </div>
                <video
                  src={scene.avatarVideoUrl}
                  autoPlay muted loop
                  className="h-24 w-24 rounded-full object-cover border-2 border-violet-500"
                />
              </div>
            )}

            {/* Toolbar: image + avatar buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Background image */}
              {scene.imageUrl ? (
                <div className="flex items-center gap-2">
                  <img src={scene.imageUrl} alt="" className="h-10 w-16 object-cover rounded-md" />
                  <button
                    onClick={() => setImageSceneId(scene.id)}
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => updateScene(scene.id, { imageUrl: undefined })}
                    className="text-xs text-zinc-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setImageSceneId(scene.id)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors border border-dashed border-zinc-700 hover:border-violet-500 rounded-md px-3 py-1.5"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Add image
                </button>
              )}

              {/* Avatar */}
              <button
                onClick={() => setAvatarSceneId(scene.id)}
                className={`flex items-center gap-1.5 text-xs transition-colors border border-dashed rounded-md px-3 py-1.5 ${
                  scene.avatarVideoUrl
                    ? 'text-violet-400 border-violet-600 hover:border-violet-400'
                    : 'text-zinc-500 border-zinc-700 hover:text-violet-400 hover:border-violet-500'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                {scene.avatarVideoUrl ? 'Change avatar' : 'Add talking avatar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" size="sm" onClick={addScene}>
        <Plus className="h-4 w-4" /> Add scene
      </Button>

      {/* Modals */}
      {imageSceneId && (
        <ImageGenerator
          onSelect={(url) => {
            updateScene(imageSceneId, { imageUrl: url });
            setImageSceneId(null);
          }}
          onClose={() => setImageSceneId(null)}
        />
      )}

      {avatarSceneId && avatarSceneObj !== undefined && (
        <AvatarCreator
          sceneId={avatarSceneId}
          sceneNarration={avatarSceneObj?.narration}
          narrationAudioPath={avatarSceneObj?.narrationAudioPath}
          projectId={projectId ? parseInt(projectId) : undefined}
          onSelect={(videoUrl, storagePath) => {
            updateScene(avatarSceneId, {
              avatarVideoUrl:  videoUrl,
              avatarVideoPath: storagePath,
            });
          }}
          onClose={() => setAvatarSceneId(null)}
        />
      )}
    </div>
  );
}

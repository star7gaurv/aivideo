'use client';
import { useState } from 'react';
import { Monitor, Smartphone, Megaphone, Music, Palette, Rocket, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import type { GeneratedScript } from '@/lib/hooks/useAssist';

const FORMATS = [
  { id: 'portrait'  as const, icon: Smartphone, label: '9:16' },
  { id: 'landscape' as const, icon: Monitor,    label: '16:9' },
  { id: 'ad'        as const, icon: Megaphone,  label: '15s Ad' },
];
const STYLES = ['bold', 'minimal', 'cinematic', 'playful', 'professional'];
const MOODS  = ['upbeat', 'calm', 'dramatic', 'corporate', 'chill', 'inspirational'];

export function StepReview({
  script, onBuild, building,
}: {
  script: GeneratedScript;
  onBuild: (s: GeneratedScript) => void;
  building: boolean;
}) {
  const [draft, setDraft] = useState<GeneratedScript>(script);

  const patchScene = (i: number, patch: Partial<GeneratedScript['scenes'][0]>) =>
    setDraft((d) => ({ ...d, scenes: d.scenes.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));

  const removeScene = (i: number) =>
    setDraft((d) => ({ ...d, scenes: d.scenes.filter((_, idx) => idx !== i) }));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pb-32">
      {/* Title */}
      <input
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        className="w-full bg-transparent text-3xl font-black text-zinc-100 outline-none mb-2 border-b border-transparent focus:border-zinc-700 transition-colors pb-1"
      />
      <p className="text-sm text-zinc-500 mb-6">{draft.scenes.length} scenes · review and tweak, then build. Everything stays editable in the studio.</p>

      {/* Settings row */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Format */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setDraft({ ...draft, format: f.id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                draft.format === f.id ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <f.icon className="h-3.5 w-3.5" /> {f.label}
            </button>
          ))}
        </div>
        {/* Style */}
        <label className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
          <Palette className="h-3.5 w-3.5 text-violet-400" />
          <select
            value={draft.style}
            onChange={(e) => setDraft({ ...draft, style: e.target.value })}
            className="bg-transparent text-xs text-zinc-300 outline-none capitalize"
          >
            {STYLES.map((s) => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
          </select>
        </label>
        {/* Music mood */}
        <label className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
          <Music className="h-3.5 w-3.5 text-violet-400" />
          <select
            value={draft.musicMood}
            onChange={(e) => setDraft({ ...draft, musicMood: e.target.value })}
            className="bg-transparent text-xs text-zinc-300 outline-none capitalize"
          >
            {MOODS.map((m) => <option key={m} value={m} className="bg-zinc-900">{m}</option>)}
          </select>
        </label>
      </div>

      {/* Scenes */}
      <div className="space-y-3">
        {draft.scenes.map((scene, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 group">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 pt-1">
                <span className="h-6 w-6 rounded-lg bg-violet-600/20 text-violet-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <GripVertical className="h-4 w-4 text-zinc-700" />
              </div>
              <div className="flex-1 space-y-2.5">
                {/* Narration */}
                <textarea
                  value={scene.narration}
                  onChange={(e) => patchScene(i, { narration: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none resize-none transition-colors"
                  placeholder="Narration…"
                />
                {/* Overlay + image prompt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={scene.overlayText}
                    onChange={(e) => patchScene(i, { overlayText: e.target.value })}
                    placeholder="On-screen caption"
                    className="bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg px-3 py-1.5 text-xs text-zinc-300 outline-none transition-colors"
                  />
                  <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5">
                    <ImageIcon className="h-3 w-3 text-zinc-600 shrink-0" />
                    <input
                      value={scene.imagePrompt}
                      onChange={(e) => patchScene(i, { imagePrompt: e.target.value })}
                      placeholder="Visual idea"
                      className="bg-transparent text-xs text-zinc-400 outline-none w-full"
                    />
                  </div>
                </div>
              </div>
              {draft.scenes.length > 1 && (
                <button
                  onClick={() => removeScene(i)}
                  className="text-zinc-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Build CTA — fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pt-8 pb-5 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xs text-zinc-500">Voice, images & music are generated in the next step.</p>
          <button
            onClick={() => onBuild(draft)}
            disabled={building}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold px-7 py-3 rounded-xl transition-colors"
          >
            {building ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
            {building ? 'Building…' : 'Build my video'}
          </button>
        </div>
      </div>
    </div>
  );
}

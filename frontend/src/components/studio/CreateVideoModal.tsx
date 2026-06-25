'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Monitor, Smartphone, Megaphone, Loader2 } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useCreateProject } from '@/lib/hooks/useProjects';

interface Props { onClose: () => void; defaultFormat?: 'landscape' | 'portrait' | 'ad'; }

const FORMATS = [
  { id: 'landscape' as const, icon: Monitor,    label: '16:9 Explainer', desc: 'YouTube · Educational · Long-form', color: 'border-blue-500 bg-blue-950/30 text-blue-300' },
  { id: 'portrait'  as const, icon: Smartphone, label: '9:16 Short Reel', desc: 'Instagram Reels · YouTube Shorts',  color: 'border-violet-500 bg-violet-950/30 text-violet-300' },
  { id: 'ad'        as const, icon: Megaphone,  label: '15s Ad Film',     desc: 'Product ads · Brand showcase',      color: 'border-orange-500 bg-orange-950/30 text-orange-300' },
];

const TEMPLATE_MAP: Record<string, { id: string; label: string; desc: string }[]> = {
  landscape: [
    { id: 'DreamFilm',     label: 'Dream Film',       desc: '6 pre-built scenes about dreams' },
    { id: 'SolarFilm',     label: 'Solar Explainer',  desc: '6 scenes about solar energy' },
    { id: 'ShortFilm',     label: 'Blank Landscape',  desc: 'Start with 1 empty scene' },
  ],
  portrait: [
    { id: 'ShortFilm',     label: 'Short Reel',       desc: 'Dynamic scenes with TTS + avatar' },
  ],
  ad: [
    { id: 'AdFilm',        label: '15s Ad',           desc: 'Intro · Product · CTA (pre-built)' },
  ],
};

export function CreateVideoModal({ onClose, defaultFormat = 'portrait' }: Props) {
  const router  = useRouter();
  const reset   = useProjectStore(s => s.reset);
  const { mutate: createProject, isPending } = useCreateProject();

  const [title,    setTitle]    = useState('');
  const [format,   setFormat]   = useState<'landscape' | 'portrait' | 'ad'>(defaultFormat);
  const [template, setTemplate] = useState(TEMPLATE_MAP[defaultFormat][0].id);

  const handleFormatChange = (f: typeof format) => {
    setFormat(f);
    setTemplate(TEMPLATE_MAP[f][0].id);
  };

  const handleCreate = () => {
    const finalTitle = title.trim() || 'My Video';
    createProject(
      { title: finalTitle, format, template_id: template, config: { scenes: [] } },
      {
        onSuccess: (data) => {
          reset();
          router.push(`/projects/${data.id}`);
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-bold text-zinc-100">Create New Video</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. Why do we dream?"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {FORMATS.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFormatChange(f.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    format === f.id ? f.color : 'border-zinc-800 hover:border-zinc-700 text-zinc-500'
                  }`}
                >
                  <f.icon className="h-5 w-5" />
                  <span className="text-[11px] font-semibold leading-tight text-center">{f.label}</span>
                  <span className="text-[9px] opacity-70 text-center leading-tight">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Template */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Start with</label>
            <div className="space-y-2">
              {TEMPLATE_MAP[format].map(t => (
                <label
                  key={t.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    template === t.id ? 'border-violet-500 bg-violet-950/30' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="radio" name="template" value={t.id} checked={template === t.id}
                    onChange={() => setTemplate(t.id)} className="accent-violet-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{t.label}</p>
                    <p className="text-xs text-zinc-500">{t.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <button onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-300 px-4 py-2 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="flex items-center gap-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-5 py-2 rounded-xl transition-colors"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isPending ? 'Creating…' : 'Open Studio →'}
          </button>
        </div>
      </div>
    </div>
  );
}

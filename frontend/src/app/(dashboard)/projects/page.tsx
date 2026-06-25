'use client';
import { useState } from 'react';
import { Monitor, Smartphone, Megaphone, Plus, Loader2, Pencil, AlertCircle, CheckCircle2, Clock, Film } from 'lucide-react';
import { useProjects, useDeleteProject } from '@/lib/hooks/useProjects';
import { CreateVideoModal } from '@/components/studio/CreateVideoModal';
import Link from 'next/link';

const FORMAT_ICON  = { landscape: Monitor, portrait: Smartphone, ad: Megaphone };
const FORMAT_COLOR = {
  landscape: 'bg-blue-950/40 border-blue-700/40 text-blue-400',
  portrait:  'bg-violet-950/40 border-violet-700/40 text-violet-400',
  ad:        'bg-orange-950/40 border-orange-700/40 text-orange-400',
};
const FORMAT_LABEL = { landscape: '16:9', portrait: '9:16', ad: '15s Ad' };
const STATUS_COLOR = {
  draft:     'text-zinc-500',
  rendering: 'text-amber-400',
  done:      'text-green-400',
  failed:    'text-red-400',
};
const STATUS_ICON = {
  draft:     Clock,
  rendering: Loader2,
  done:      CheckCircle2,
  failed:    AlertCircle,
};

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const [showCreate, setShowCreate] = useState(false);
  const [defaultFmt, setDefaultFmt] = useState<'landscape' | 'portrait' | 'ad'>('portrait');

  const projects = data?.data ?? [];
  const total     = projects.length;
  const rendering = projects.filter(p => p.status === 'rendering').length;
  const done      = projects.filter(p => p.status === 'done').length;

  const openCreate = (fmt: 'landscape' | 'portrait' | 'ad' = 'portrait') => {
    setDefaultFmt(fmt);
    setShowCreate(true);
  };

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">My Videos</h1>
          {total > 0 && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-zinc-600">{total} total</span>
              {rendering > 0 && <span className="text-xs text-amber-400">{rendering} rendering</span>}
              {done > 0 && <span className="text-xs text-green-400">{done} done</span>}
            </div>
          )}
        </div>
        <button
          onClick={() => openCreate()}
          className="flex items-center gap-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="h-4 w-4" /> New Video
        </button>
      </div>

      {/* Quick-start cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {([
          { fmt: 'portrait'  as const, icon: Smartphone, label: 'New Short Reel', desc: '9:16 · TTS + Avatar · Reels/Shorts',  border: 'hover:border-violet-500/60', iconColor: 'text-violet-400', iconBg: 'bg-violet-500/10 border-violet-500/20' },
          { fmt: 'ad'        as const, icon: Megaphone,  label: 'New 15s Ad',     desc: '15 sec · Product + CTA',              border: 'hover:border-orange-500/60', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10 border-orange-500/20' },
          { fmt: 'landscape' as const, icon: Monitor,    label: 'New Explainer',  desc: '16:9 · YouTube · Long-form',          border: 'hover:border-blue-500/60',   iconColor: 'text-blue-400',   iconBg: 'bg-blue-500/10 border-blue-500/20' },
        ]).map(q => (
          <button
            key={q.fmt}
            onClick={() => openCreate(q.fmt)}
            className={`card-lift flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-left transition-all ${q.border}`}
          >
            <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${q.iconBg}`}>
              <q.icon className={`h-5 w-5 ${q.iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">{q.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{q.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <Film className="h-7 w-7 text-zinc-700" />
          </div>
          <h3 className="text-base font-semibold text-zinc-400 mb-1">No videos yet</h3>
          <p className="text-sm text-zinc-600 mb-6">Pick a format above to create your first video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => {
            const FmtIcon   = FORMAT_ICON[p.format] ?? Film;
            const StatusIcon = STATUS_ICON[p.status] ?? Clock;
            const isPortrait = p.format !== 'landscape';
            return (
              <div key={p.id} className={`bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all card-lift border-l-2 ${
                p.format === 'portrait' ? 'border-l-violet-500/60' :
                p.format === 'ad'      ? 'border-l-orange-500/60' : 'border-l-blue-500/60'
              }`}>
                {/* Thumbnail */}
                <div className={`relative bg-zinc-950 ${isPortrait ? 'h-40' : 'h-28'} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
                  <FmtIcon className={`h-10 w-10 ${FORMAT_COLOR[p.format].split(' ')[2]} opacity-20 relative z-10`} />
                  <div className="absolute inset-0 flex items-end p-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${FORMAT_COLOR[p.format]}`}>
                      {FORMAT_LABEL[p.format]}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-zinc-200 truncate mb-1">{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1 text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                      <StatusIcon className={`h-3 w-3 ${p.status === 'rendering' ? 'animate-spin' : ''}`} />
                      {p.status}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/projects/${p.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-2 rounded-xl transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Open Studio
                    </Link>
                    {p.status === 'done' && (
                      <a
                        href={`/storage/${p.output_path}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-green-400 border border-green-700/50 hover:border-green-500 px-3 py-2 rounded-xl transition-colors"
                      >
                        ↓ MP4
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && <CreateVideoModal onClose={() => setShowCreate(false)} defaultFormat={defaultFmt} />}
    </div>
  );
}

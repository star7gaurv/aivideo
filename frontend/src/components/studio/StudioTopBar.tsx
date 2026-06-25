'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Music, Play, Upload, Check, Loader2, ChevronDown, Sparkles } from 'lucide-react';

interface Props {
  title: string;
  format: 'landscape' | 'portrait' | 'ad';
  renderStatus: 'idle' | 'queued' | 'processing' | 'done' | 'failed';
  hasOutput: boolean;
  generating: boolean;
  onTitleChange: (t: string) => void;
  onFormatChange: (f: 'landscape' | 'portrait' | 'ad') => void;
  onGenerateAll: () => void;
  onMusicClick: () => void;
  onRenderClick: () => void;
  onPublishClick: () => void;
}

const FORMAT_LABELS = { landscape: '16:9 Explainer', portrait: '9:16 Reel', ad: '15s Ad' };

export function StudioTopBar({
  title, format, renderStatus, hasOutput, generating,
  onTitleChange, onFormatChange, onGenerateAll, onMusicClick, onRenderClick, onPublishClick,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(title);
  const [fmtOpen, setFmtOpen] = useState(false);

  const commitTitle = () => {
    setEditing(false);
    onTitleChange(draft.trim() || 'Untitled Video');
  };

  const isRendering = renderStatus === 'queued' || renderStatus === 'processing';

  return (
    <header className="h-14 shrink-0 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-3 z-20">
      {/* Back */}
      <Link href="/projects" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm shrink-0">
        <ArrowLeft className="h-4 w-4" /> Projects
      </Link>

      <div className="h-4 w-px bg-zinc-800 shrink-0" />

      {/* Editable title */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={e => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditing(false); }}
            className="bg-zinc-800 text-zinc-100 text-sm font-semibold rounded-lg px-3 py-1.5 outline-none border border-violet-500 w-full max-w-xs"
          />
        ) : (
          <button
            onClick={() => { setDraft(title); setEditing(true); }}
            className="text-sm font-semibold text-zinc-100 hover:text-violet-300 transition-colors truncate max-w-xs text-left"
            title="Click to rename"
          >
            {title || 'Untitled Video'}
          </button>
        )}
      </div>

      {/* Format selector */}
      <div className="relative shrink-0">
        <button
          onClick={() => setFmtOpen(v => !v)}
          className="flex items-center gap-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          {FORMAT_LABELS[format]} <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
        </button>
        {fmtOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-30">
            {(Object.entries(FORMAT_LABELS) as [typeof format, string][]).map(([k, v]) => (
              <button
                key={k}
                onClick={() => { onFormatChange(k); setFmtOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between hover:bg-zinc-800 transition-colors ${format === k ? 'text-violet-400' : 'text-zinc-300'}`}
              >
                {v} {format === k && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Generate Everything */}
      <button
        onClick={onGenerateAll}
        disabled={generating}
        className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-colors shrink-0"
      >
        {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {generating ? 'Generating…' : 'Generate All'}
      </button>

      {/* Music */}
      <button
        onClick={onMusicClick}
        className="flex items-center gap-1.5 text-xs font-medium border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg transition-colors shrink-0"
      >
        <Music className="h-3.5 w-3.5" /> Music
      </button>

      {/* Render */}
      <button
        onClick={onRenderClick}
        disabled={isRendering}
        className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg transition-colors shrink-0"
      >
        {isRendering
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Rendering…</>
          : renderStatus === 'done'
          ? <><Check className="h-3.5 w-3.5" /> Re-render</>
          : <><Play className="h-3.5 w-3.5" /> Render</>}
      </button>

      {/* Publish */}
      <button
        onClick={onPublishClick}
        disabled={!hasOutput}
        className="flex items-center gap-1.5 text-xs font-semibold border border-zinc-700 hover:border-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 hover:text-violet-300 px-3 py-1.5 rounded-lg transition-colors shrink-0"
      >
        <Upload className="h-3.5 w-3.5" /> Publish
      </button>
    </header>
  );
}

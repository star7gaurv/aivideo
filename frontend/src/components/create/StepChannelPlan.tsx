'use client';
import { useEffect } from 'react';
import { Loader2, Users, Calendar, Sparkles, ArrowRight, Target, TrendingUp } from 'lucide-react';
import { useChannelPlan } from '@/lib/hooks/useAssist';

export function StepChannelPlan({ passion, onPick }: { passion: string; onPick: (ideaTitle: string) => void }) {
  const { mutate: plan, data, isPending, isError } = useChannelPlan();

  useEffect(() => {
    plan(passion || undefined);
  }, [passion]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <Loader2 className="h-10 w-10 text-violet-500 animate-spin mx-auto mb-5" />
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Designing your channel…</h2>
        <p className="text-zinc-500 text-sm">Finding a niche, audience, and your first video ideas.</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="text-zinc-400 mb-4">Couldn&apos;t build a plan. Try again.</p>
        <button onClick={() => plan(passion || undefined)} className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Niche header */}
      <div className="bg-gradient-to-br from-violet-600/20 to-violet-600/5 border border-violet-500/30 rounded-2xl p-6 mb-6">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Your channel niche</p>
        <h1 className="text-2xl font-black text-zinc-100 mb-2">{data.niche}</h1>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">{data.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
            <div><p className="text-[10px] text-zinc-500 uppercase">Audience</p><p className="text-xs text-zinc-300">{data.audience}</p></div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
            <div><p className="text-[10px] text-zinc-500 uppercase">Why it works</p><p className="text-xs text-zinc-300">{data.why_it_works}</p></div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
            <div><p className="text-[10px] text-zinc-500 uppercase">Schedule</p><p className="text-xs text-zinc-300">{data.schedule}</p></div>
          </div>
        </div>
      </div>

      {/* Video ideas */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-4 w-4 text-violet-400" />
        <h2 className="text-base font-bold text-zinc-100">Pick your first video</h2>
        <span className="text-xs text-zinc-600">— we&apos;ll make it now</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(data.video_ideas ?? []).map((idea, i) => (
          <button
            key={i}
            onClick={() => onPick(idea.title)}
            className="card-lift group text-left bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 rounded-xl p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="h-6 w-6 rounded-lg bg-violet-600/20 text-violet-400 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <Sparkles className="h-3.5 w-3.5 text-zinc-700 group-hover:text-violet-400 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-zinc-100 mb-1 leading-snug">{idea.title}</p>
            {idea.hook && <p className="text-xs text-zinc-500 leading-relaxed">{idea.hook}</p>}
            <p className="flex items-center gap-1 text-[11px] font-medium text-violet-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Make this video <ArrowRight className="h-3 w-3" />
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

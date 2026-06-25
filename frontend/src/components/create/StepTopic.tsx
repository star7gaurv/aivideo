'use client';
import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { useIdeas, type VideoIdea } from '@/lib/hooks/useAssist';
import type { Goal } from './StepGoal';

const COPY: Record<Goal, { title: string; sub: string; placeholder: string; suggestLabel: string }> = {
  channel: { title: "What are you passionate about?", sub: "Tell us your interest and we'll design a channel around it. Not sure? Hit suggest.", placeholder: 'e.g. home cooking, personal finance, retro games…', suggestLabel: 'Suggest niches for me' },
  video:   { title: "What's your video about?", sub: "Describe your idea, or get AI suggestions to spark one.", placeholder: 'e.g. why the sky is blue, 5 productivity hacks…', suggestLabel: 'Suggest ideas for me' },
  ad:      { title: "What are you advertising?", sub: "Your product or service — we'll craft a 15-second ad.", placeholder: 'e.g. a vitamin C face wash, a fitness app…', suggestLabel: 'Suggest angles for me' },
  script:  { title: "Paste your script", sub: "Drop your script or topic — we'll structure it into scenes.", placeholder: 'Paste your full script here…', suggestLabel: 'Suggest ideas for me' },
};

export function StepTopic({ goal, onNext }: { goal: Goal; onNext: (topic: string) => void }) {
  const [value, setValue] = useState('');
  const { mutate: getIdeas, data: ideas, isPending } = useIdeas();
  const copy = COPY[goal];
  const isScript = goal === 'script';

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-zinc-100 mb-3">{copy.title}</h1>
        <p className="text-zinc-400">{copy.sub}</p>
      </div>

      {isScript ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={copy.placeholder}
          rows={8}
          className="w-full bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-2xl px-5 py-4 text-zinc-100 placeholder-zinc-600 outline-none transition-colors resize-none"
        />
      ) : (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value.trim() && onNext(value.trim())}
          placeholder={copy.placeholder}
          className="w-full bg-zinc-900 border border-zinc-700 focus:border-violet-500 rounded-2xl px-5 py-4 text-zinc-100 placeholder-zinc-600 outline-none transition-colors text-lg"
        />
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => value.trim() && onNext(value.trim())}
          disabled={!value.trim()}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
        {!isScript && (
          <button
            onClick={() => getIdeas(value.trim() || undefined)}
            disabled={isPending}
            className="flex items-center gap-2 border border-zinc-700 hover:border-violet-500 text-zinc-300 hover:text-violet-300 font-medium px-5 py-3 rounded-xl transition-colors"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-violet-400" />}
            {copy.suggestLabel}
          </button>
        )}
      </div>

      {/* Idea suggestions */}
      {ideas && ideas.length > 0 && (
        <div className="mt-8 space-y-2.5">
          <p className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> Tap one to use it
          </p>
          {ideas.map((idea: VideoIdea, i: number) => (
            <button
              key={i}
              onClick={() => onNext(idea.title)}
              className="card-lift w-full text-left bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 rounded-xl p-4 transition-all group"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100 mb-0.5">{idea.title}</p>
                  {idea.hook && <p className="text-xs text-zinc-500">{idea.hook}</p>}
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-violet-400 shrink-0 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

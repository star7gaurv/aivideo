'use client';
import { Youtube, Film, Megaphone, FileText, ArrowRight } from 'lucide-react';

export type Goal = 'channel' | 'video' | 'ad' | 'script';

const GOALS: { id: Goal; icon: React.ElementType; title: string; desc: string; accent: string }[] = [
  { id: 'channel', icon: Youtube,   title: 'Start a YouTube channel', desc: "Don't know what to post? We'll plan your whole channel and make the first video.", accent: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400' },
  { id: 'video',   icon: Film,      title: 'Make one video',          desc: 'Have a topic in mind? We write the script, pick visuals, voice and music.',        accent: 'from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400' },
  { id: 'ad',      icon: Megaphone, title: 'Create a 15s ad',         desc: 'A punchy product ad with hook, showcase and call-to-action.',                       accent: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400' },
  { id: 'script',  icon: FileText,  title: 'I already have a script',  desc: 'Paste your script and we turn it into scenes you can render.',                      accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400' },
];

export function StepGoal({ onPick }: { onPick: (g: Goal) => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 mb-3">What do you want to make?</h1>
        <p className="text-zinc-400">Pick a starting point — we handle the rest. You can change everything later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => onPick(g.id)}
            className={`card-lift group text-left bg-gradient-to-br ${g.accent} border rounded-2xl p-6 hover:border-opacity-60 transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-center">
                <g.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-1.5">{g.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{g.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

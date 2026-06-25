'use client';
import { useEffect, useState, useRef } from 'react';
import { Loader2, PenLine, Image as ImageIcon, Music, Wand2, Check } from 'lucide-react';
import { useGenerateScript, type GeneratedScript } from '@/lib/hooks/useAssist';

const STAGES = [
  { icon: PenLine,   label: 'Writing your script' },
  { icon: ImageIcon, label: 'Planning the visuals' },
  { icon: Music,     label: 'Choosing the music' },
  { icon: Wand2,     label: 'Polishing the structure' },
];

export function StepGenerating({
  topic, format, onReady, onError,
}: {
  topic: string;
  format: 'landscape' | 'portrait' | 'ad';
  onReady: (s: GeneratedScript) => void;
  onError: () => void;
}) {
  const { mutate: generate } = useGenerateScript();
  const [active, setActive] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const timer = setInterval(() => setActive((a) => Math.min(a + 1, STAGES.length - 1)), 1400);

    generate(
      { topic, format, target_seconds: format === 'ad' ? 15 : 40 },
      {
        onSuccess: (s) => { clearInterval(timer); onReady(s); },
        onError:   () => { clearInterval(timer); onError(); },
      }
    );

    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="text-center mb-10">
        <div className="inline-flex h-16 w-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 items-center justify-center mb-5">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
        </div>
        <h1 className="text-2xl font-black text-zinc-100 mb-2">Creating your video</h1>
        <p className="text-zinc-500 text-sm">&ldquo;{topic}&rdquo;</p>
      </div>

      <div className="space-y-2.5">
        {STAGES.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
              i < active ? 'border-green-700/40 bg-green-950/20' :
              i === active ? 'border-violet-500/50 bg-violet-950/30' :
              'border-zinc-800 bg-zinc-900/40'
            }`}
          >
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
              i < active ? 'bg-green-600/20 text-green-400' :
              i === active ? 'bg-violet-600/20 text-violet-400' :
              'bg-zinc-800 text-zinc-600'
            }`}>
              {i < active ? <Check className="h-4 w-4" /> :
               i === active ? <Loader2 className="h-4 w-4 animate-spin" /> :
               <s.icon className="h-4 w-4" />}
            </div>
            <span className={`text-sm ${i <= active ? 'text-zinc-200' : 'text-zinc-600'}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

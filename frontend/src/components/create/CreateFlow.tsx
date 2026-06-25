'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { useCreateProject } from '@/lib/hooks/useProjects';
import type { GeneratedScript } from '@/lib/hooks/useAssist';
import { StepGoal, type Goal } from './StepGoal';
import { StepTopic } from './StepTopic';
import { StepChannelPlan } from './StepChannelPlan';
import { StepGenerating } from './StepGenerating';
import { StepReview } from './StepReview';

type Step = 'goal' | 'topic' | 'channel' | 'generating' | 'review';

const formatForGoal: Record<Goal, 'landscape' | 'portrait' | 'ad'> = {
  channel: 'portrait',
  video:   'portrait',
  ad:      'ad',
  script:  'portrait',
};

const templateForFormat: Record<string, string> = {
  portrait:  'ShortFilm',
  landscape: 'ShortFilm',
  ad:        'AdFilm',
};

export function CreateFlow() {
  const router = useRouter();
  const reset  = useProjectStore((s) => s.reset);
  const { mutate: createProject, isPending: creating } = useCreateProject();

  const [step, setStep]       = useState<Step>('goal');
  const [goal, setGoal]       = useState<Goal>('video');
  const [topic, setTopic]     = useState('');
  const [format, setFormat]   = useState<'landscape' | 'portrait' | 'ad'>('portrait');
  const [script, setScript]   = useState<GeneratedScript | null>(null);

  const history: Step[] = ['goal', 'topic', 'channel', 'generating', 'review'];

  const goBack = () => {
    if (step === 'topic') setStep('goal');
    else if (step === 'channel') setStep('topic');
    else if (step === 'review') setStep(goal === 'channel' ? 'channel' : 'topic');
    else if (step === 'generating') setStep(goal === 'channel' ? 'channel' : 'topic');
  };

  const pickGoal = (g: Goal) => {
    setGoal(g);
    setFormat(formatForGoal[g]);
    setStep('topic');
  };

  // From topic step: channel goal → channel plan; others → generate script
  const afterTopic = (chosenTopic: string) => {
    setTopic(chosenTopic);
    if (goal === 'channel') setStep('channel');
    else setStep('generating');
  };

  // From channel plan: user picked a specific video idea
  const afterChannelPick = (ideaTitle: string) => {
    setTopic(ideaTitle);
    setStep('generating');
  };

  const onScriptReady = (s: GeneratedScript) => {
    setScript(s);
    setStep('review');
  };

  const buildVideo = (finalScript: GeneratedScript) => {
    reset();
    const tmpl = templateForFormat[finalScript.format] ?? 'ShortFilm';
    createProject(
      {
        title:       finalScript.title,
        format:      finalScript.format,
        template_id: tmpl,
        config: {
          scenes: finalScript.scenes.map((sc, i) => ({
            id:          `s${i + 1}_${Math.random().toString(36).slice(2, 7)}`,
            narration:   sc.narration,
            overlayText: sc.overlayText,
            imagePrompt: sc.imagePrompt,
          })),
          style:      finalScript.style,
          music_mood: finalScript.musicMood,
        },
      } as never,
      {
        onSuccess: (data: { id: number }) => router.push(`/projects/${data.id}?fresh=1`),
      }
    );
  };

  const startBlank = () => {
    reset();
    createProject(
      { title: 'Untitled Video', format: 'portrait', template_id: 'ShortFilm', config: { scenes: [] } } as never,
      { onSuccess: (data: { id: number }) => router.push(`/projects/${data.id}`) }
    );
  };

  const stepIndex = history.indexOf(step);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-zinc-800 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          {step !== 'goal' && (
            <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}
          <button onClick={() => router.push('/projects')} className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
            Cancel
          </button>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {['Goal', 'Topic', goal === 'channel' ? 'Plan' : null, 'Generate', 'Review'].filter(Boolean).map((label, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= stepIndex ? 'w-8 bg-violet-500' : 'w-4 bg-zinc-800'}`} />
          ))}
        </div>
        <button
          onClick={startBlank}
          disabled={creating}
          className="text-xs text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-1.5"
        >
          {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          Skip — start blank
        </button>
      </header>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        {step === 'goal'       && <StepGoal onPick={pickGoal} />}
        {step === 'topic'      && <StepTopic goal={goal} onNext={afterTopic} />}
        {step === 'channel'    && <StepChannelPlan passion={topic} onPick={afterChannelPick} />}
        {step === 'generating' && <StepGenerating topic={topic} format={format} onReady={onScriptReady} onError={goBack} />}
        {step === 'review'     && script && <StepReview script={script} onBuild={buildVideo} building={creating} />}
      </div>
    </div>
  );
}

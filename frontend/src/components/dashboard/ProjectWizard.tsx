'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormatPicker }    from './FormatPicker';
import { TemplateBrowser } from './TemplateBrowser';
import { ContentEditor }   from './ContentEditor';
import { MusicPicker }     from './MusicPicker';
import { PublishPanel }    from './PublishPanel';
import { Button }          from '../ui/Button';
import { useProjectStore } from '@/store/projectStore';

const STEPS = [
  { label: 'Format',   component: FormatPicker },
  { label: 'Template', component: TemplateBrowser },
  { label: 'Content',  component: ContentEditor },
  { label: 'Music',    component: MusicPicker },
  { label: 'Publish',  component: PublishPanel },
] as const;

interface Props {
  initialStep?: number;
}

export function ProjectWizard({ initialStep = 0 }: Props) {
  const [step, setStep]         = useState(initialStep);
  const { format, templateId }  = useProjectStore();
  const StepComponent           = STEPS[step].component;

  const canProceed = () => {
    if (step === 0) return !!format;
    if (step === 1) return !!templateId;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-1 flex-wrap">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${
                i === step
                  ? 'bg-violet-600 text-white font-medium'
                  : i < step
                  ? 'text-violet-400 hover:text-violet-300 cursor-pointer'
                  : 'text-zinc-600 cursor-default'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i <= step ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {i + 1}
              </span>
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-4 ${i < step ? 'bg-violet-500' : 'bg-zinc-800'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <StepComponent />
      </div>

      {/* Navigation */}
      {step < STEPS.length - 1 && (
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

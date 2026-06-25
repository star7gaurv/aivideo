'use client';
import { useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import { useGenerateImage } from '@/lib/hooks/useImageGen';
import { Button } from '../ui/Button';

const providers = [
  { id: 'pollinations', label: 'Pollinations' },
  { id: 'gemini',       label: 'Gemini' },
  { id: 'cloudflare',   label: 'Cloudflare' },
  { id: 'huggingface',  label: 'HuggingFace' },
];

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
  projectId?: number;
}

export function ImageGenerator({ onSelect, onClose, projectId }: Props) {
  const [prompt, setPrompt]     = useState('');
  const [provider, setProvider] = useState('pollinations');
  const [result, setResult]     = useState<string | null>(null);
  const { mutate, isPending }   = useGenerateImage();

  const generate = () => {
    if (!prompt.trim()) return;
    mutate({ prompt, provider, project_id: projectId }, {
      onSuccess: (data) => setResult(data.url),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-100">Generate Image</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X className="h-5 w-5" /></button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Describe the image you want..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-500"
        />

        <div className="flex flex-wrap gap-2">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${provider === p.id ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {result && (
          <img src={result} alt="Generated" className="w-full rounded-lg object-cover max-h-64" />
        )}

        <div className="flex gap-2">
          <Button onClick={generate} loading={isPending} className="flex-1">
            <Wand2 className="h-4 w-4" />
            {isPending ? 'Generating...' : 'Generate'}
          </Button>
          {result && (
            <Button variant="secondary" onClick={() => onSelect(result)}>
              Use this
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  label?: string;
}

export function AudioPlayer({ src, label }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    return () => { howlRef.current?.unload(); };
  }, []);

  const toggle = async () => {
    if (!howlRef.current) {
      const { Howl } = await import('howler');
      howlRef.current = new Howl({ src: [src], html5: true, onend: () => setPlaying(false) });
    }
    if (playing) {
      howlRef.current.stop();
      setPlaying(false);
    } else {
      howlRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={playing ? 'Stop preview' : 'Preview track'}
      className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
    >
      {playing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      {label ?? (playing ? 'Stop' : 'Preview')}
    </button>
  );
}

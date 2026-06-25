'use client';
import { useState } from 'react';
import { Music, Sparkles, Check } from 'lucide-react';
import { useMusicTracks, useGenerateMusic } from '@/lib/hooks/useMusicTracks';
import { useProjectStore } from '@/store/projectStore';
import { AudioPlayer } from '../ui/AudioPlayer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

const moods = ['upbeat', 'calm', 'dramatic', 'corporate', 'chill', 'inspirational'] as const;

export function MusicPicker() {
  const { musicTrackId, setMusic } = useProjectStore();
  const [mood, setMood]           = useState<typeof moods[number]>('upbeat');
  const { data: tracks, isLoading } = useMusicTracks(mood);
  const { mutate: generate, isPending: isGenerating } = useGenerateMusic();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Choose background music</h2>

      {/* Mood tabs */}
      <div className="flex flex-wrap gap-2">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium capitalize transition-colors ${mood === m ? 'border-violet-500 bg-violet-500/20 text-violet-300' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Track list */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {tracks?.map((track) => (
            <div
              key={track.id}
              onClick={() => setMusic(musicTrackId === track.id ? null : track.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${musicTrackId === track.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}
            >
              <Music className={`h-4 w-4 shrink-0 ${musicTrackId === track.id ? 'text-violet-400' : 'text-zinc-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{track.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-zinc-500">{track.artist}</span>
                  <span className="text-xs text-zinc-600">·</span>
                  <span className="text-xs text-zinc-500">{track.duration_seconds}s</span>
                  {track.is_ai_generated && <Badge label="AI" />}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <AudioPlayer src={track.stream_url} />
                {musicTrackId === track.id && <Check className="h-4 w-4 text-violet-400" />}
              </div>
            </div>
          ))}
          {tracks?.length === 0 && (
            <p className="text-zinc-500 text-sm py-4 text-center">No tracks yet — generate one below.</p>
          )}
        </div>
      )}

      {/* AI Generate */}
      <div className="border-t border-zinc-800 pt-4">
        <Button
          variant="secondary"
          size="sm"
          loading={isGenerating}
          onClick={() => generate({ mood, duration_seconds: 60 })}
        >
          <Sparkles className="h-4 w-4" />
          Generate AI track — {mood} (60s)
        </Button>
        <p className="text-xs text-zinc-600 mt-1">Uses Mubert or MusicGen · takes ~30s</p>
      </div>
    </div>
  );
}

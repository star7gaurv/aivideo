'use client';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import type { Scene } from '@/store/projectStore';

interface Props {
  scene: Scene | null;
  format: 'landscape' | 'portrait' | 'ad';
  sceneIndex: number;
  totalScenes: number;
  onPrev: () => void;
  onNext: () => void;
}

export function SceneCanvas({ scene, format, sceneIndex, totalScenes, onPrev, onNext }: Props) {
  const isPortrait = format === 'portrait' || format === 'ad';

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col items-center justify-center overflow-auto py-8 px-4 gap-5">
      {/* Canvas frame */}
      <div className={`relative overflow-hidden rounded-2xl border border-zinc-700 shadow-2xl shadow-black/60 ${
        isPortrait ? 'aspect-[9/16] h-[72vh] max-h-[560px]' : 'aspect-video w-full max-w-2xl'
      }`}>
        {scene ? (
          <>
            {/* Background */}
            {scene.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={scene.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-zinc-900 to-zinc-950" />
            )}

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Narration text strip */}
            {scene.narration && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pb-6">
                <div className="border-l-4 border-violet-500 pl-3">
                  <p className="text-white text-sm leading-relaxed line-clamp-3">
                    {scene.narration}
                  </p>
                </div>
              </div>
            )}

            {/* Overlay text */}
            {scene.overlayText && (
              <div className="absolute top-4 left-4 right-4">
                <p className="text-white font-bold text-base bg-black/50 rounded-lg px-3 py-2 backdrop-blur-sm inline-block">
                  {scene.overlayText}
                </p>
              </div>
            )}

            {/* Avatar placeholder (portrait only) */}
            {isPortrait && scene.avatarVideoPath && (
              <div className="absolute bottom-20 right-4 h-20 w-20 rounded-full border-2 border-violet-500 bg-zinc-800 flex items-center justify-center overflow-hidden shadow-lg">
                <User className="h-8 w-8 text-zinc-600" />
              </div>
            )}

            {/* Format watermark */}
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-[9px] text-zinc-400 px-2 py-1 rounded-md font-mono">
              {format === 'landscape' ? '1920×1080' : '1080×1920'}
            </div>
          </>
        ) : (
          /* No scene selected */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 gap-3">
            <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center">
              <span className="text-2xl text-zinc-600">🎬</span>
            </div>
            <p className="text-sm text-zinc-600">Select a scene to preview</p>
          </div>
        )}
      </div>

      {/* Navigator */}
      {totalScenes > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={onPrev}
            disabled={sceneIndex === 0}
            className="h-8 w-8 rounded-lg border border-zinc-800 hover:border-zinc-600 flex items-center justify-center text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-zinc-500 font-medium min-w-[80px] text-center">
            Scene {sceneIndex + 1} / {totalScenes}
          </span>
          <button
            onClick={onNext}
            disabled={sceneIndex >= totalScenes - 1}
            className="h-8 w-8 rounded-lg border border-zinc-800 hover:border-zinc-600 flex items-center justify-center text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

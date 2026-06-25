'use client';
import { Plus, Trash2, GripVertical, Mic, Image as ImageIcon, Video } from 'lucide-react';
import type { Scene } from '@/store/projectStore';

interface Props {
  scenes: Scene[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

export function SceneList({ scenes, activeId, onSelect, onAdd, onDelete, onReorder }: Props) {
  return (
    <aside className="w-60 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-zinc-800 shrink-0">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Scenes</span>
        <span className="text-xs text-zinc-600">{scenes.length}</span>
      </div>

      {/* Scene cards */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5">
        {scenes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-zinc-600">No scenes yet</p>
          </div>
        )}
        {scenes.map((scene, i) => (
          <div
            key={scene.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = Number(e.dataTransfer.getData('text/plain'));
              if (!Number.isNaN(from) && from !== i) onReorder(from, i);
            }}
            onClick={() => onSelect(scene.id)}
            className={`group relative rounded-xl border cursor-pointer transition-all ${
              activeId === scene.id
                ? 'border-violet-500 bg-violet-950/40'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/60'
            }`}
          >
            {/* Thumbnail / placeholder */}
            <div className="h-16 rounded-t-xl overflow-hidden relative">
              {scene.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={scene.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-lg font-black ${
                  activeId === scene.id ? 'bg-violet-950/60 text-violet-500' : 'bg-zinc-800 text-zinc-600'
                }`}>
                  {i + 1}
                </div>
              )}
              {/* Delete on hover */}
              <button
                onClick={e => { e.stopPropagation(); onDelete(scene.id); }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-red-400 rounded-md p-0.5 transition-all"
                title="Delete scene"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              {/* Drag handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 text-zinc-600 cursor-grab">
                <GripVertical className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Info */}
            <div className="p-2">
              <p className="text-xs font-medium text-zinc-300 mb-1 truncate">
                Scene {i + 1}
              </p>
              {scene.narration ? (
                <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                  {scene.narration.slice(0, 60)}{scene.narration.length > 60 ? '…' : ''}
                </p>
              ) : (
                <p className="text-[10px] text-zinc-700 italic">No narration yet</p>
              )}

              {/* Indicators */}
              <div className="flex items-center gap-1.5 mt-1.5">
                {scene.narrationAudioPath && (
                  <span title="TTS generated" className="text-green-500"><Mic className="h-2.5 w-2.5" /></span>
                )}
                {scene.imageUrl && (
                  <span title="Image added" className="text-blue-500"><ImageIcon className="h-2.5 w-2.5" /></span>
                )}
                {scene.avatarVideoPath && (
                  <span title="Avatar added" className="text-purple-500"><Video className="h-2.5 w-2.5" /></span>
                )}
                {scene.durationHint && (
                  <span className="text-[9px] text-zinc-600 ml-auto">{Math.round(scene.durationHint / 30)}s</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add scene */}
      <div className="p-2 border-t border-zinc-800 shrink-0">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 hover:text-violet-300 border border-zinc-800 hover:border-violet-700 rounded-xl py-2.5 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Scene
        </button>
      </div>
    </aside>
  );
}

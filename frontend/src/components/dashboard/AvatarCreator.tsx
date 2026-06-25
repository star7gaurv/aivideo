'use client';
import { useRef, useState } from 'react';
import { X, Upload, User, Clock, CheckCircle2, AlertCircle, Loader2, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGenerateAvatar, useAvatarStatus } from '@/lib/hooks/useAvatar';

interface AvatarCreatorProps {
  sceneId: string;
  sceneNarration?: string;
  narrationAudioPath?: string;
  projectId?: number;
  onSelect: (videoUrl: string, storagePath: string) => void;
  onClose: () => void;
}

export function AvatarCreator({
  sceneId,
  sceneNarration,
  narrationAudioPath,
  projectId,
  onSelect,
  onClose,
}: AvatarCreatorProps) {
  const fileRef               = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile]       = useState<File | null>(null);
  const [jobId, setJobId]     = useState<number | null>(null);

  const { mutate: generate, isPending } = useGenerateAvatar();
  const { data: status } = useAvatarStatus(jobId);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) handleFile(f);
  };

  const handleGenerate = () => {
    if (!file) return;
    generate(
      {
        face_image:   file,
        audio_path:   narrationAudioPath,
        project_id:   projectId,
        scene_id:     sceneId,
      },
      {
        onSuccess: (data) => setJobId(data.id),
      }
    );
  };

  const done    = status?.status === 'done';
  const failed  = status?.status === 'failed';
  const working = status?.status === 'queued' || status?.status === 'processing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-violet-400" />
            <h2 className="text-base font-semibold text-zinc-100">Talking Avatar</h2>
            <span className="text-xs bg-violet-900/40 text-violet-300 border border-violet-700 px-2 py-0.5 rounded-full">
              SadTalker · free
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* How it works */}
          <p className="text-xs text-zinc-500">
            Upload a face photo. SadTalker will animate it to match this scene's narration audio.
            Generation takes <strong className="text-zinc-300">3–10 minutes</strong> via the free HuggingFace queue.
          </p>

          {/* Narration status */}
          {narrationAudioPath ? (
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950/30 border border-green-900 rounded-lg px-3 py-2">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Narration audio ready — avatar will speak this scene's text.
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-900 rounded-lg px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              No narration audio for this scene yet.
              {sceneNarration?.trim() && ' Generate narration first for lip-sync.'}
            </div>
          )}

          {/* Face upload */}
          {!jobId && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-violet-500 rounded-xl p-6 cursor-pointer transition-colors text-center group"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />

              {preview ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={preview}
                    alt="Face preview"
                    className="h-32 w-32 object-cover rounded-full border-4 border-violet-500 shadow-lg"
                  />
                  <span className="text-xs text-zinc-400">Click to change photo</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <Upload className="h-8 w-8" />
                  <span className="text-sm font-medium">Drop a face photo here</span>
                  <span className="text-xs">JPG / PNG · front-facing works best</span>
                </div>
              )}
            </div>
          )}

          {/* Job in progress */}
          {jobId && !done && !failed && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                {working ? (
                  <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                ) : (
                  <Clock className="h-4 w-4 text-zinc-500" />
                )}
                <span>
                  {status?.status === 'queued'     ? 'Waiting in HuggingFace queue…' :
                   status?.status === 'processing'  ? 'SadTalker is animating your avatar…' :
                   'Submitting to queue…'}
                </span>
              </div>

              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 transition-all duration-1000 rounded-full"
                  style={{
                    width: status?.status === 'processing' ? '60%' : status?.status === 'queued' ? '15%' : '5%',
                  }}
                />
              </div>

              <p className="text-xs text-zinc-500">
                You can close this and come back — the job keeps running in the background.
              </p>
            </div>
          )}

          {/* Done */}
          {done && status?.videoUrl && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Avatar ready!
                {status.durationSec && <span className="text-zinc-500">({status.durationSec.toFixed(1)}s)</span>}
              </div>

              <video
                src={status.videoUrl}
                controls
                autoPlay
                muted
                loop
                className="w-full rounded-xl border border-zinc-700 max-h-64 object-cover"
              />
            </div>
          )}

          {/* Error */}
          {failed && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-3 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Generation failed</p>
                {status?.log && <p className="text-xs text-red-300 mt-1 font-mono">{status.log}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <div className="flex items-center gap-2">
            {done && status?.videoUrl && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Pass both the public URL and a storage-relative path
                  const storagePath = status.videoUrl!.replace(/.*\/storage\//, '');
                  onSelect(status.videoUrl!, storagePath);
                  onClose();
                }}
              >
                <Video className="h-4 w-4" /> Use this avatar
              </Button>
            )}
            {!jobId && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerate}
                loading={isPending}
                disabled={!file || isPending}
              >
                <User className="h-4 w-4" />
                {isPending ? 'Queuing…' : 'Generate Avatar'}
              </Button>
            )}
            {failed && (
              <Button variant="primary" size="sm" onClick={() => { setJobId(null); }}>
                Try again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

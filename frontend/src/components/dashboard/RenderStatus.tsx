'use client';
import { useEffect } from 'react';
import { useRenderStatus } from '@/lib/hooks/useRenderStatus';
import { Spinner } from '../ui/Spinner';
import { CheckCircle, XCircle, Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  jobId: number;
  onDone?: () => void;
}

export function RenderStatus({ jobId, onDone }: Props) {
  const { data, isLoading } = useRenderStatus(jobId);

  useEffect(() => {
    if (data?.status === 'done') onDone?.();
  }, [data?.status, onDone]);

  if (isLoading || !data) {
    return <div className="flex justify-center py-4"><Spinner /></div>;
  }

  const pct = data.progress ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {data.status === 'done'       && <CheckCircle className="h-5 w-5 text-green-400" />}
        {data.status === 'failed'     && <XCircle className="h-5 w-5 text-red-400" />}
        {(data.status === 'queued' || data.status === 'processing') && <Spinner size="sm" />}
        <span className="text-sm font-medium text-zinc-200 capitalize">{data.status}</span>
        {data.status === 'processing' && <span className="text-xs text-zinc-500">{pct}%</span>}
      </div>

      {(data.status === 'queued' || data.status === 'processing') && (
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div
            className="bg-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(pct, data.status === 'queued' ? 2 : 5)}%` }}
          />
        </div>
      )}

      {data.status === 'done' && data.output_url && (
        <a href={data.output_url} download>
          <Button size="sm">
            <Download className="h-4 w-4" /> Download MP4
          </Button>
        </a>
      )}

      {data.status === 'failed' && data.log && (
        <pre className="text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg p-3 overflow-auto max-h-32">
          {data.log}
        </pre>
      )}
    </div>
  );
}

'use client';
import { useTemplates } from '@/lib/hooks/useTemplates';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Film } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function TemplatesPage() {
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-zinc-100">Templates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((t) => (
          <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5 text-violet-400" />
              <h3 className="font-medium text-zinc-100">{t.name}</h3>
            </div>
            <p className="text-sm text-zinc-400">{t.description}</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge label={t.format} />
              <span className="text-xs text-zinc-500">{t.width}×{t.height}</span>
              <span className="text-xs text-zinc-500">{t.duration_sec}s</span>
            </div>
            <p className="text-xs text-zinc-600">Scenes: {t.scenes.join(' · ')}</p>
            <Link href={`/dashboard/projects/new`}>
              <Button size="sm" variant="secondary" className="w-full">Use template</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

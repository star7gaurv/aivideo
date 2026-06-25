'use client';
import { useTemplates } from '@/lib/hooks/useTemplates';
import { useProjectStore } from '@/store/projectStore';
import { Card, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { Film } from 'lucide-react';

export function TemplateBrowser() {
  const { templateId, format, setTemplate } = useProjectStore();
  const { data: templates, isLoading } = useTemplates();

  const filtered = templates?.filter((t) => t.format === format) ?? [];

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Choose a template</h2>
      {filtered.length === 0 && (
        <p className="text-zinc-500 text-sm">No templates available for this format yet.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} selected={templateId === t.id} onClick={() => setTemplate(t.id)} className="cursor-pointer space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <Film className="h-5 w-5 text-violet-400 shrink-0" />
              <CardTitle>{t.name}</CardTitle>
            </div>
            <CardDescription>{t.description}</CardDescription>
            <div className="flex flex-wrap gap-1 pt-1">
              <Badge label={t.format} />
              <span className="text-xs text-zinc-500">{t.duration_sec}s</span>
            </div>
            <p className="text-xs text-zinc-600">Scenes: {t.scenes.join(' · ')}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

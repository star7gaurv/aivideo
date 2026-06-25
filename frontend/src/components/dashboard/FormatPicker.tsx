'use client';
import { Monitor, Smartphone, Megaphone } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '../ui/Card';
import { useProjectStore } from '@/store/projectStore';

const formats = [
  { id: 'landscape' as const, label: 'Long Format', sub: '16:9 · 1920×1080', icon: Monitor,    hint: 'YouTube, educational, documentary' },
  { id: 'portrait'  as const, label: 'Short / Reel', sub: '9:16 · 1080×1920', icon: Smartphone, hint: 'Instagram Reels, YouTube Shorts, TikTok' },
  { id: 'ad'        as const, label: 'Product Ad',   sub: '15 sec · 9:16',     icon: Megaphone,  hint: 'Product showcase with CTA' },
];

export function FormatPicker() {
  const { format, setFormat } = useProjectStore();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Choose video format</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {formats.map(({ id, label, sub, icon: Icon, hint }) => (
          <Card key={id} selected={format === id} onClick={() => setFormat(id)} className="cursor-pointer">
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <Icon className={`h-8 w-8 ${format === id ? 'text-violet-400' : 'text-zinc-500'}`} />
              <div>
                <CardTitle>{label}</CardTitle>
                <p className="text-xs text-violet-400 font-mono mb-1">{sub}</p>
                <CardDescription>{hint}</CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

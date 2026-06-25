'use client';
import { use } from 'react';
import { StudioLayout } from '@/components/studio/StudioLayout';

export default function ProjectStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <StudioLayout projectId={id} />;
}

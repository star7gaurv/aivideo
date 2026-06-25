'use client';
import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { ProjectWizard }   from '@/components/dashboard/ProjectWizard';

export default function NewProjectPage() {
  const reset = useProjectStore((s) => s.reset);
  useEffect(() => { reset(); }, [reset]);
  return (
    <div className="max-w-3xl mx-auto">
      <ProjectWizard />
    </div>
  );
}

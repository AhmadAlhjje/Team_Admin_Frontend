import type { Metadata } from 'next';

import { AchievementForm } from '@/components/achievements/achievement-form';
import { PageHeader } from '@/components/shared/page-header';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'إضافة إنجاز' };

export default async function NewAchievementPage() {
  const projects = await loadOrRedirect(api.projects.list());
  return (
    <>
      <PageHeader title="إضافة إنجاز" back={{ href: '/achievements', label: 'الإنجازات' }} />
      <AchievementForm projects={projects.map((project) => ({ id: project.id, title: project.title }))} />
    </>
  );
}

import type { Metadata } from 'next';

import { AchievementForm } from '@/components/achievements/achievement-form';
import { PageHeader } from '@/components/shared/page-header';
import { loadOrRedirect } from '@/lib/api/client';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'تعديل إنجاز' };

export default async function EditAchievementPage({ params }: PageProps<'/achievements/[id]'>) {
  const [achievement, projects] = await Promise.all([
    loadEntity((await params).id, api.achievements.get),
    loadOrRedirect(api.projects.list()),
  ]);
  return (
    <>
      <PageHeader title={achievement.title} back={{ href: '/achievements', label: 'الإنجازات' }} />
      <AchievementForm
        achievement={achievement}
        projects={projects.map((project) => ({ id: project.id, title: project.title }))}
      />
    </>
  );
}

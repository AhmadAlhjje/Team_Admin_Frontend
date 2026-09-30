import type { Metadata } from 'next';

import { ProjectForm } from '@/components/projects/project-form';
import { PageHeader } from '@/components/shared/page-header';

import { loadProjectFormOptions } from '../options';

export const metadata: Metadata = { title: 'إضافة مشروع' };

export default async function NewProjectPage() {
  const options = await loadProjectFormOptions();
  return (
    <>
      <PageHeader title="إضافة مشروع" back={{ href: '/projects', label: 'المشاريع' }} />
      <ProjectForm options={options} />
    </>
  );
}

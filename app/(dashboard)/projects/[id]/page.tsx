import { ExternalLinkIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { ProjectForm } from '@/components/projects/project-form';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';
import { websiteUrl } from '@/lib/constants/env';

import { loadProjectFormOptions } from '../options';

export const metadata: Metadata = { title: 'تعديل مشروع' };

export default async function EditProjectPage({ params }: PageProps<'/projects/[id]'>) {
  const [project, options] = await Promise.all([
    loadEntity((await params).id, api.projects.get),
    loadProjectFormOptions(),
  ]);

  return (
    <>
      <PageHeader
        title={project.title}
        back={{ href: '/projects', label: 'المشاريع' }}
        actions={
          <>
            <StatusBadge status={project.status} />
            {websiteUrl && project.status === 'PUBLISHED' ? (
              <Button variant="outline" size="sm" asChild>
                <a href={`${websiteUrl}/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
                  عرض في الموقع
                  <ExternalLinkIcon aria-hidden="true" />
                </a>
              </Button>
            ) : null}
          </>
        }
      />
      <ProjectForm project={project} options={options} />
    </>
  );
}

import { PlusIcon, StarIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { EmptyState } from '@/components/shared/empty-state';
import { Forbidden } from '@/components/shared/forbidden';
import { ManagedTable } from '@/components/shared/managed-table';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { contentStatusTabs, parseContentStatus, StatusTabs } from '@/components/shared/status-tabs';
import { Thumbnail } from '@/components/shared/thumbnail';
import { Button } from '@/components/ui/button';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import { projectPhaseLabels } from '@/lib/constants/labels';

import { deleteProject, reorderProjects } from './actions';

export const metadata: Metadata = { title: 'المشاريع' };

export default async function ProjectsPage({ searchParams }: PageProps<'/projects'>) {
  if (!can(await getCurrentUser(), Permission.ContentManage)) return <Forbidden />;

  const status = parseContentStatus((await searchParams).status);
  const projects = await loadOrRedirect(api.projects.list(status));

  return (
    <>
      <PageHeader
        title="المشاريع"
        description="كل مشروع منشور له صفحة خاصة قابلة للفهرسة في محركات البحث. الترتيب هنا هو ترتيب الظهور في الموقع."
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <PlusIcon aria-hidden="true" />
              إضافة مشروع
            </Link>
          </Button>
        }
      />
      <StatusTabs basePath="/projects" tabs={contentStatusTabs} current={status} />

      {projects.length === 0 ? (
        <EmptyState title="لا توجد مشاريع" description="أضف مشاريع الفريق الحقيقية ليبدأ الزوار بالتعرف على أعمالكم." />
      ) : (
        <ManagedTable
          columns={['المشروع', 'المرحلة', 'الفريق', 'الحالة']}
          reorderAction={status ? undefined : reorderProjects}
          deleteAction={deleteProject}
          deleteHint="سيتم حذف المشروع وصوره وميزاته نهائياً، ويُفك ربطه بالإنجازات وآراء العملاء. للإخفاء فقط استخدم «مؤرشف»."
          rows={projects.map((project) => ({
            id: project.id,
            label: project.title,
            editHref: `/projects/${project.id}`,
            cells: [
              <div key="title" className="flex items-center gap-3">
                <Thumbnail src={project.coverImageUrl} alt="" />
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    {project.title}
                    {project.isFeatured ? (
                      <StarIcon className="size-3.5 fill-amber-400 text-amber-400" aria-label="مميز" />
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    /projects/{project.slug}
                  </p>
                </div>
              </div>,
              projectPhaseLabels[project.phase],
              project.members.length,
              <StatusBadge key="status" status={project.status} />,
            ],
          }))}
        />
      )}
    </>
  );
}

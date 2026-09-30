import { PlusIcon } from 'lucide-react';
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

import { deleteTeamMember, reorderTeam } from './actions';

export const metadata: Metadata = { title: 'الفريق' };

export default async function TeamPage({ searchParams }: PageProps<'/team'>) {
  if (!can(await getCurrentUser(), Permission.ContentManage)) return <Forbidden />;

  const status = parseContentStatus((await searchParams).status);
  const members = await loadOrRedirect(api.team.list(status));

  return (
    <>
      <PageHeader
        title="الفريق"
        description="أعضاء الفريق الظاهرون في صفحة الفريق وصفحات المشاريع. الترتيب هنا هو ترتيب الظهور في الموقع."
        actions={
          <Button asChild>
            <Link href="/team/new">
              <PlusIcon aria-hidden="true" />
              إضافة عضو
            </Link>
          </Button>
        }
      />
      <StatusTabs basePath="/team" tabs={contentStatusTabs} current={status} />

      {members.length === 0 ? (
        <EmptyState
          title="لا يوجد أعضاء"
          description={status ? 'لا يوجد أعضاء بهذه الحالة.' : 'أضف أعضاء الفريق ليظهروا في الموقع.'}
        />
      ) : (
        <ManagedTable
          columns={['العضو', 'الدور', 'المشاريع', 'الحالة']}
          reorderAction={status ? undefined : reorderTeam}
          deleteAction={deleteTeamMember}
          deleteHint="لا يمكن حذف عضو مرتبط بمشاريع. في هذه الحالة غيّر حالته إلى «مؤرشف» ليختفي من الموقع."
          rows={members.map((member) => ({
            id: member.id,
            label: member.name,
            editHref: `/team/${member.id}`,
            cells: [
              <div key="name" className="flex items-center gap-3">
                <Thumbnail src={member.avatarUrl} alt="" shape="circle" />
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  {member.specialization ? (
                    <p className="text-xs text-muted-foreground">{member.specialization}</p>
                  ) : null}
                </div>
              </div>,
              member.role,
              member.projects.length,
              <StatusBadge key="status" status={member.status} />,
            ],
          }))}
        />
      )}
    </>
  );
}

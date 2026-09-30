import { PlusIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { EmptyState } from '@/components/shared/empty-state';
import { Forbidden } from '@/components/shared/forbidden';
import { ManagedTable } from '@/components/shared/managed-table';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { contentStatusTabs, parseContentStatus, StatusTabs } from '@/components/shared/status-tabs';
import { Button } from '@/components/ui/button';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';
import { can, Permission } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import { achievementTypeLabels } from '@/lib/constants/labels';
import { formatDate } from '@/lib/format';

import { deleteAchievement, reorderAchievements } from './actions';

export const metadata: Metadata = { title: 'الإنجازات' };

export default async function AchievementsPage({ searchParams }: PageProps<'/achievements'>) {
  if (!can(await getCurrentUser(), Permission.ContentManage)) return <Forbidden />;

  const status = parseContentStatus((await searchParams).status);
  const achievements = await loadOrRedirect(api.achievements.list(status));

  return (
    <>
      <PageHeader
        title="الإنجازات"
        description="مسابقات وجوائز وشهادات ومحطات حقيقية يمكن إثباتها. أضف رابط المصدر عند توفره."
        actions={
          <Button asChild>
            <Link href="/achievements/new">
              <PlusIcon aria-hidden="true" />
              إضافة إنجاز
            </Link>
          </Button>
        }
      />
      <StatusTabs basePath="/achievements" tabs={contentStatusTabs} current={status} />

      {achievements.length === 0 ? (
        <EmptyState title="لا توجد إنجازات" />
      ) : (
        <ManagedTable
          columns={['الإنجاز', 'النوع', 'التاريخ', 'الحالة']}
          reorderAction={status ? undefined : reorderAchievements}
          deleteAction={deleteAchievement}
          rows={achievements.map((achievement) => ({
            id: achievement.id,
            label: achievement.title,
            editHref: `/achievements/${achievement.id}`,
            cells: [
              <div key="title">
                <p className="font-medium text-foreground">{achievement.title}</p>
                {achievement.highlight ? (
                  <p className="text-xs text-muted-foreground">{achievement.highlight}</p>
                ) : null}
              </div>,
              achievementTypeLabels[achievement.type],
              achievement.date ? formatDate(achievement.date) : '—',
              <StatusBadge key="status" status={achievement.status} />,
            ],
          }))}
        />
      )}
    </>
  );
}

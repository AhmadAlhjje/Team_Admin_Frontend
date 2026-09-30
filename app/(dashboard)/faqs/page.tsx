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

import { deleteFaq, reorderFaqs } from './actions';

export const metadata: Metadata = { title: 'الأسئلة الشائعة' };

export default async function FaqsPage({ searchParams }: PageProps<'/faqs'>) {
  if (!can(await getCurrentUser(), Permission.ContentManage)) return <Forbidden />;

  const status = parseContentStatus((await searchParams).status);
  const faqs = await loadOrRedirect(api.faqs.list(status));

  return (
    <>
      <PageHeader
        title="الأسئلة الشائعة"
        description="تظهر في صفحتي الخدمات والتواصل. راجع الأسئلة المقترحة قبل نشرها."
        actions={
          <Button asChild>
            <Link href="/faqs/new">
              <PlusIcon aria-hidden="true" />
              إضافة سؤال
            </Link>
          </Button>
        }
      />
      <StatusTabs basePath="/faqs" tabs={contentStatusTabs} current={status} />

      {faqs.length === 0 ? (
        <EmptyState title="لا توجد أسئلة" />
      ) : (
        <ManagedTable
          columns={['السؤال', 'الحالة']}
          reorderAction={status ? undefined : reorderFaqs}
          deleteAction={deleteFaq}
          rows={faqs.map((faq) => ({
            id: faq.id,
            label: faq.question,
            editHref: `/faqs/${faq.id}`,
            cells: [
              <div key="q">
                <p className="font-medium text-foreground">{faq.question}</p>
                <p className="line-clamp-1 max-w-xl text-xs text-muted-foreground">{faq.answer}</p>
              </div>,
              <StatusBadge key="status" status={faq.status} />,
            ],
          }))}
        />
      )}
    </>
  );
}

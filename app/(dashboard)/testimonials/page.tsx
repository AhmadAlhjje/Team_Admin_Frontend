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

import { deleteTestimonial, reorderTestimonials } from './actions';

export const metadata: Metadata = { title: 'آراء العملاء' };

export default async function TestimonialsPage({ searchParams }: PageProps<'/testimonials'>) {
  if (!can(await getCurrentUser(), Permission.ContentManage)) return <Forbidden />;

  const status = parseContentStatus((await searchParams).status);
  const testimonials = await loadOrRedirect(api.testimonials.list(status));

  return (
    <>
      <PageHeader
        title="آراء العملاء"
        description="آراء حقيقية فقط، وبموافقة أصحابها. لا يمكن نشر رأي بدون تسجيل الموافقة."
        actions={
          <Button asChild>
            <Link href="/testimonials/new">
              <PlusIcon aria-hidden="true" />
              إضافة رأي
            </Link>
          </Button>
        }
      />
      <StatusTabs basePath="/testimonials" tabs={contentStatusTabs} current={status} />

      {testimonials.length === 0 ? (
        <EmptyState title="لا توجد آراء" description="يُخفى قسم آراء العملاء في الموقع حتى تنشر أول رأي." />
      ) : (
        <ManagedTable
          columns={['صاحب الرأي', 'المشروع', 'الحالة']}
          reorderAction={status ? undefined : reorderTestimonials}
          deleteAction={deleteTestimonial}
          rows={testimonials.map((testimonial) => ({
            id: testimonial.id,
            label: testimonial.authorName,
            editHref: `/testimonials/${testimonial.id}`,
            cells: [
              <div key="author">
                <p className="font-medium text-foreground">{testimonial.authorName}</p>
                <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">{testimonial.content}</p>
              </div>,
              testimonial.project?.title ?? '—',
              <StatusBadge key="status" status={testimonial.status} />,
            ],
          }))}
        />
      )}
    </>
  );
}

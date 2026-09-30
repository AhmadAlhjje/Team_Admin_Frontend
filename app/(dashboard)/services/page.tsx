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

import { deleteService, reorderServices } from './actions';

export const metadata: Metadata = { title: 'الخدمات' };

export default async function ServicesPage({ searchParams }: PageProps<'/services'>) {
  if (!can(await getCurrentUser(), Permission.ContentManage)) return <Forbidden />;

  const status = parseContentStatus((await searchParams).status);
  const services = await loadOrRedirect(api.services.list(status));

  return (
    <>
      <PageHeader
        title="الخدمات"
        description="ما يقدمه الفريق للعملاء. اكتب الخدمة كنتيجة يحصل عليها العميل، والتقنيات داخل تفاصيلها."
        actions={
          <Button asChild>
            <Link href="/services/new">
              <PlusIcon aria-hidden="true" />
              إضافة خدمة
            </Link>
          </Button>
        }
      />
      <StatusTabs basePath="/services" tabs={contentStatusTabs} current={status} />

      {services.length === 0 ? (
        <EmptyState title="لا توجد خدمات" description="أضف الخدمات التي يقدمها الفريق." />
      ) : (
        <ManagedTable
          columns={['الخدمة', 'التقنيات', 'المشاريع', 'الحالة']}
          reorderAction={status ? undefined : reorderServices}
          deleteAction={deleteService}
          deleteHint="سيتم حذف الخدمة وإزالة ربطها بالمشاريع (المشاريع نفسها لن تُحذف)."
          rows={services.map((service) => ({
            id: service.id,
            label: service.title,
            editHref: `/services/${service.id}`,
            cells: [
              <div key="title">
                <p className="font-medium text-foreground">{service.title}</p>
                <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">{service.summary}</p>
              </div>,
              <span key="tech" className="text-xs text-muted-foreground">
                {service.technologies.map((technology) => technology.name).join('، ') || '—'}
              </span>,
              service.projectCount,
              <StatusBadge key="status" status={service.status} />,
            ],
          }))}
        />
      )}
    </>
  );
}

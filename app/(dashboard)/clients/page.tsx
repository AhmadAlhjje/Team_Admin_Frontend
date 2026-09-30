import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
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

import { deleteClient, reorderClients } from './actions';

export const metadata: Metadata = { title: 'العملاء' };

export default async function ClientsPage({ searchParams }: PageProps<'/clients'>) {
  if (!can(await getCurrentUser(), Permission.ContentManage)) return <Forbidden />;

  const status = parseContentStatus((await searchParams).status);
  const clients = await loadOrRedirect(api.clients.list(status));

  return (
    <>
      <PageHeader
        title="العملاء"
        description="الجهات التي عمل معها الفريق. لا يظهر العميل في الموقع إلا بعد تسجيل موافقته."
        actions={
          <Button asChild>
            <Link href="/clients/new">
              <PlusIcon aria-hidden="true" />
              إضافة عميل
            </Link>
          </Button>
        }
      />
      <StatusTabs basePath="/clients" tabs={contentStatusTabs} current={status} />

      {clients.length === 0 ? (
        <EmptyState title="لا يوجد عملاء" description="يمكن ربط العملاء بالمشاريع وعرض شعاراتهم بعد موافقتهم." />
      ) : (
        <ManagedTable
          columns={['العميل', 'موافقة العرض', 'المشاريع', 'الحالة']}
          reorderAction={status ? undefined : reorderClients}
          deleteAction={deleteClient}
          deleteHint="لا يمكن حذف عميل مرتبط بمشاريع. أرشفه أو ألغِ ربطه من المشاريع أولاً."
          rows={clients.map((client) => ({
            id: client.id,
            label: client.name,
            editHref: `/clients/${client.id}`,
            cells: [
              <div key="name" className="flex items-center gap-3">
                <Thumbnail src={client.logoUrl} alt="" />
                <div>
                  <p className="font-medium text-foreground">{client.name}</p>
                  {client.industry ? <p className="text-xs text-muted-foreground">{client.industry}</p> : null}
                </div>
              </div>,
              client.hasDisplayConsent ? (
                <span key="consent" className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckIcon className="size-4" aria-hidden="true" /> موجودة
                </span>
              ) : (
                <span key="consent" className="inline-flex items-center gap-1 text-muted-foreground">
                  <XIcon className="size-4" aria-hidden="true" /> غير موجودة
                </span>
              ),
              client.projectCount,
              <StatusBadge key="status" status={client.status} />,
            ],
          }))}
        />
      )}
    </>
  );
}

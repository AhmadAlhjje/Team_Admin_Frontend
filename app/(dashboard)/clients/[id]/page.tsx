import type { Metadata } from 'next';

import { ClientForm } from '@/components/clients/client-form';
import { PageHeader } from '@/components/shared/page-header';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'تعديل عميل' };

export default async function EditClientPage({ params }: PageProps<'/clients/[id]'>) {
  const client = await loadEntity((await params).id, api.clients.get);
  return (
    <>
      <PageHeader title={client.name} back={{ href: '/clients', label: 'العملاء' }} />
      <ClientForm client={client} />
    </>
  );
}

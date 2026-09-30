import type { Metadata } from 'next';

import { ClientForm } from '@/components/clients/client-form';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'إضافة عميل' };

export default function NewClientPage() {
  return (
    <>
      <PageHeader title="إضافة عميل" back={{ href: '/clients', label: 'العملاء' }} />
      <ClientForm />
    </>
  );
}

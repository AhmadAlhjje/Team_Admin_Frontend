import type { Metadata } from 'next';

import { ServiceForm } from '@/components/services/service-form';
import { PageHeader } from '@/components/shared/page-header';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'إضافة خدمة' };

export default async function NewServicePage() {
  const technologies = await loadOrRedirect(api.technologies());
  return (
    <>
      <PageHeader title="إضافة خدمة" back={{ href: '/services', label: 'الخدمات' }} />
      <ServiceForm technologySuggestions={technologies.map((technology) => technology.name)} />
    </>
  );
}

import type { Metadata } from 'next';

import { ServiceForm } from '@/components/services/service-form';
import { PageHeader } from '@/components/shared/page-header';
import { loadOrRedirect } from '@/lib/api/client';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'تعديل خدمة' };

export default async function EditServicePage({ params }: PageProps<'/services/[id]'>) {
  const [service, technologies] = await Promise.all([
    loadEntity((await params).id, api.services.get),
    loadOrRedirect(api.technologies()),
  ]);

  return (
    <>
      <PageHeader title={service.title} back={{ href: '/services', label: 'الخدمات' }} />
      <ServiceForm service={service} technologySuggestions={technologies.map((technology) => technology.name)} />
    </>
  );
}

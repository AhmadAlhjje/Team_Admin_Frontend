import type { Metadata } from 'next';

import { FaqForm } from '@/components/faqs/faq-form';
import { PageHeader } from '@/components/shared/page-header';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'تعديل سؤال' };

export default async function EditFaqPage({ params }: PageProps<'/faqs/[id]'>) {
  const faq = await loadEntity((await params).id, api.faqs.get);
  return (
    <>
      <PageHeader title="تعديل سؤال" back={{ href: '/faqs', label: 'الأسئلة الشائعة' }} />
      <FaqForm faq={faq} />
    </>
  );
}

import type { Metadata } from 'next';

import { FaqForm } from '@/components/faqs/faq-form';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = { title: 'إضافة سؤال' };

export default function NewFaqPage() {
  return (
    <>
      <PageHeader title="إضافة سؤال" back={{ href: '/faqs', label: 'الأسئلة الشائعة' }} />
      <FaqForm />
    </>
  );
}

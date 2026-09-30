import type { Metadata } from 'next';

import { PageHeader } from '@/components/shared/page-header';
import { TestimonialForm } from '@/components/testimonials/testimonial-form';
import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'إضافة رأي' };

export default async function NewTestimonialPage() {
  const projects = await loadOrRedirect(api.projects.list());
  return (
    <>
      <PageHeader title="إضافة رأي عميل" back={{ href: '/testimonials', label: 'آراء العملاء' }} />
      <TestimonialForm projects={projects.map((project) => ({ id: project.id, title: project.title }))} />
    </>
  );
}

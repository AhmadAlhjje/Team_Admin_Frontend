import type { Metadata } from 'next';

import { PageHeader } from '@/components/shared/page-header';
import { TestimonialForm } from '@/components/testimonials/testimonial-form';
import { loadOrRedirect } from '@/lib/api/client';
import { loadEntity } from '@/lib/api/load';
import { api } from '@/lib/api/resources';

export const metadata: Metadata = { title: 'تعديل رأي' };

export default async function EditTestimonialPage({ params }: PageProps<'/testimonials/[id]'>) {
  const [testimonial, projects] = await Promise.all([
    loadEntity((await params).id, api.testimonials.get),
    loadOrRedirect(api.projects.list()),
  ]);
  return (
    <>
      <PageHeader title={testimonial.authorName} back={{ href: '/testimonials', label: 'آراء العملاء' }} />
      <TestimonialForm
        testimonial={testimonial}
        projects={projects.map((project) => ({ id: project.id, title: project.title }))}
      />
    </>
  );
}

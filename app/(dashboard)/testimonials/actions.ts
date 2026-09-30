'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { TestimonialPayload } from '@/lib/validation/schemas';

const testimonials = contentActions<TestimonialPayload>(api.testimonials, '/testimonials');

export async function createTestimonial(payload: TestimonialPayload) {
  return testimonials.create(payload);
}

export async function updateTestimonial(id: number, payload: TestimonialPayload) {
  return testimonials.update(id, payload);
}

export async function deleteTestimonial(id: number) {
  return testimonials.remove(id);
}

export async function reorderTestimonials(ids: number[]) {
  return testimonials.reorder(ids);
}

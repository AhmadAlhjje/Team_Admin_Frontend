'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { FaqPayload } from '@/lib/validation/schemas';

const faqs = contentActions<FaqPayload>(api.faqs, '/faqs');

export async function createFaq(payload: FaqPayload) {
  return faqs.create(payload);
}

export async function updateFaq(id: number, payload: FaqPayload) {
  return faqs.update(id, payload);
}

export async function deleteFaq(id: number) {
  return faqs.remove(id);
}

export async function reorderFaqs(ids: number[]) {
  return faqs.reorder(ids);
}

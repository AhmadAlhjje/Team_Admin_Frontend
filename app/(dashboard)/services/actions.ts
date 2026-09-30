'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { ServicePayload } from '@/lib/validation/schemas';

const services = contentActions<ServicePayload>(api.services, '/services');

export async function createService(payload: ServicePayload) {
  return services.create(payload);
}

export async function updateService(id: number, payload: ServicePayload) {
  return services.update(id, payload);
}

export async function deleteService(id: number) {
  return services.remove(id);
}

export async function reorderServices(ids: number[]) {
  return services.reorder(ids);
}

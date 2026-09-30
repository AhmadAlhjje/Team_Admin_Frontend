'use server';

import { contentActions } from '@/lib/actions/content-actions';
import { api } from '@/lib/api/resources';
import type { ClientPayload } from '@/lib/validation/schemas';

const clients = contentActions<ClientPayload>(api.clients, '/clients');

export async function createClient(payload: ClientPayload) {
  return clients.create(payload);
}

export async function updateClient(id: number, payload: ClientPayload) {
  return clients.update(id, payload);
}

export async function deleteClient(id: number) {
  return clients.remove(id);
}

export async function reorderClients(ids: number[]) {
  return clients.reorder(ids);
}

import 'server-only';

import { notFound } from 'next/navigation';

import { parseId } from '@/lib/slug';

import { loadOrRedirect } from './client';
import { ApiError } from './errors';

/** Loads an entity for an edit page: invalid IDs and 404s render the not-found page. */
export async function loadEntity<T>(rawId: string, load: (id: number) => Promise<T>): Promise<T> {
  const id = parseId(rawId);
  if (!id) notFound();
  try {
    return await loadOrRedirect(load(id));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

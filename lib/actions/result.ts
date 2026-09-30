import 'server-only';

import { redirect, unstable_rethrow } from 'next/navigation';

import { ApiError, errorMessage, fieldErrors } from '@/lib/api/errors';

/** Result returned by every Server Action (never throws for expected errors). */
export type ActionResult<T = null> =
  { ok: true; data: T } | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function runAction<T>(action: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await action() };
  } catch (error) {
    // Let Next.js handle redirect()/notFound() thrown inside the action.
    unstable_rethrow(error);

    if (error instanceof ApiError) {
      if (error.status === 401) redirect('/login');
      return { ok: false, message: errorMessage(error), fieldErrors: fieldErrors(error) };
    }

    console.error(JSON.stringify({ level: 'error', message: 'Server action failed', error: String(error) }));
    return { ok: false, message: 'حدث خطأ غير متوقع. حاول مرة أخرى.' };
  }
}

/** Server Actions are public endpoints: never trust IDs coming from the client. */
export function assertId(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new ApiError(400, { code: 'BAD_REQUEST', message: 'Invalid id' });
  }
  return value;
}

export function assertIds(values: unknown): number[] {
  if (!Array.isArray(values)) throw new ApiError(400, { code: 'BAD_REQUEST', message: 'Invalid ids' });
  return values.map(assertId);
}

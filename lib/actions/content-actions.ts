import 'server-only';

import { revalidatePath } from 'next/cache';

import type { ContentResource } from '@/lib/api/resources';

import { type ActionResult, assertId, assertIds, runAction } from './result';

/**
 * Implements the standard create/update/delete/reorder Server Actions for a
 * content resource. Each `actions.ts` file exposes thin, explicit wrappers
 * around these so every exported action stays easy to find and audit.
 */
export function contentActions<TPayload extends object>(resource: ContentResource<TPayload>, listPath: string) {
  const refresh = () => revalidatePath(listPath, 'layout');

  return {
    create: (payload: TPayload): Promise<ActionResult<{ id: number }>> =>
      runAction(async () => {
        const created = await resource.create(payload);
        refresh();
        return { id: created.id };
      }),

    update: (id: number, payload: Partial<TPayload>): Promise<ActionResult> =>
      runAction(async () => {
        await resource.update(assertId(id), payload);
        refresh();
        return null;
      }),

    remove: (id: number): Promise<ActionResult> =>
      runAction(async () => {
        await resource.remove(assertId(id));
        refresh();
        return null;
      }),

    reorder: (ids: number[]): Promise<ActionResult> =>
      runAction(async () => {
        await resource.reorder(assertIds(ids));
        refresh();
        return null;
      }),
  };
}

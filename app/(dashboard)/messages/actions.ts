'use server';

import { revalidatePath } from 'next/cache';

import { assertId, runAction } from '@/lib/actions/result';
import { api } from '@/lib/api/resources';
import type { MessageStatus } from '@/types/api';

const STATUSES = new Set<MessageStatus>(['UNREAD', 'READ', 'ARCHIVED']);

export async function setMessageStatus(id: number, status: MessageStatus) {
  return runAction(async () => {
    if (!STATUSES.has(status)) throw new Error('Invalid status');
    await api.messages.setStatus(assertId(id), status);
    revalidatePath('/', 'layout');
    return null;
  });
}

export async function deleteMessage(id: number) {
  return runAction(async () => {
    await api.messages.remove(assertId(id));
    revalidatePath('/', 'layout');
    return null;
  });
}

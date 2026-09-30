'use server';

import { revalidatePath } from 'next/cache';

import { assertId, runAction } from '@/lib/actions/result';
import { api } from '@/lib/api/resources';
import type { CreateUserPayload } from '@/lib/validation/schemas';

export async function createUser(payload: CreateUserPayload) {
  return runAction(async () => {
    const user = await api.users.create(payload);
    revalidatePath('/users');
    return { id: user.id };
  });
}

export async function updateUser(
  id: number,
  payload: { name: string; role: 'ADMIN' | 'SUPER_ADMIN'; isActive: boolean; password?: string },
) {
  return runAction(async () => {
    const body: Record<string, unknown> = { name: payload.name, role: payload.role, isActive: payload.isActive };
    if (payload.password) body.password = payload.password;
    await api.users.update(assertId(id), body);
    revalidatePath('/users');
    return null;
  });
}

export async function deleteUser(id: number) {
  return runAction(async () => {
    await api.users.remove(assertId(id));
    revalidatePath('/users');
    return null;
  });
}

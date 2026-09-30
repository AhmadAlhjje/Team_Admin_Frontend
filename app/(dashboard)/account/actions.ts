'use server';

import { cookies } from 'next/headers';

import { runAction } from '@/lib/actions/result';
import { api } from '@/lib/api/resources';
import { writeSessionCookies } from '@/lib/auth/tokens';

/** Changes the password; the backend ends other sessions and returns a new one for this device. */
export async function changePassword(currentPassword: string, newPassword: string) {
  return runAction(async () => {
    const session = await api.auth.changePassword(currentPassword, newPassword);
    writeSessionCookies(await cookies(), session);
    return null;
  });
}

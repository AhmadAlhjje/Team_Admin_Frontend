'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ApiError, errorMessage } from '@/lib/api/errors';
import { api } from '@/lib/api/resources';
import { safeRedirectPath } from '@/lib/auth/redirect';
import { clearSessionCookies, REFRESH_TOKEN_COOKIE, writeSessionCookies } from '@/lib/auth/tokens';

export interface LoginState {
  error?: string;
  email?: string;
}

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = safeRedirectPath(formData.get('next'));

  if (!email || !password) return { error: 'أدخل البريد الإلكتروني وكلمة المرور.', email };

  try {
    const session = await api.auth.login(email, password);
    writeSessionCookies(await cookies(), session);
  } catch (error) {
    if (error instanceof ApiError) return { error: errorMessage(error), email };
    throw error;
  }

  redirect(next);
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    // Revoke server-side too; a failure must not keep the user signed in locally.
    await api.auth.logout(refreshToken).catch(() => undefined);
  }
  clearSessionCookies(cookieStore);
  redirect('/login');
}

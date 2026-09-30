import 'server-only';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCESS_TOKEN_COOKIE } from '@/lib/auth/tokens';
import { serverApiUrl } from '@/lib/constants/env';
import type { ApiErrorBody } from '@/types/api';

import { ApiError } from './errors';

const REQUEST_TIMEOUT_MS = 15_000;

type Body = FormData | object;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: Body;
  /** Skip the session token (login/refresh). */
  anonymous?: boolean;
}

/** Forwards the visitor's IP so the backend can rate limit per person (TRUST_PROXY). */
async function forwardedFor(): Promise<string | null> {
  const incoming = await headers();
  return incoming.get('x-forwarded-for')?.split(',')[0]?.trim() || incoming.get('x-real-ip');
}

/**
 * Server-side API client (Backend-for-Frontend). Runs only on the admin
 * server: the access token is read from the httpOnly cookie and never reaches
 * browser JavaScript.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const requestHeaders: Record<string, string> = { Accept: 'application/json' };

  if (!options.anonymous) {
    const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const ip = await forwardedFor();
  if (ip) requestHeaders['X-Forwarded-For'] = ip;

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    body = JSON.stringify(options.body);
    requestHeaders['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    response = await fetch(`${serverApiUrl}/api/v1${path}`, {
      method: options.method ?? 'GET',
      headers: requestHeaders,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError(0, null);
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data as Partial<ApiErrorBody> | null);
  return data as T;
}

/**
 * For Server Component data loading: an expired session sends the user to the
 * login page instead of rendering an error.
 */
export async function loadOrRedirect<T>(request: Promise<T>): Promise<T> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect('/login');
    throw error;
  }
}

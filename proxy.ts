import { type NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  clearSessionCookies,
  isTokenFresh,
  REFRESH_TOKEN_COOKIE,
  type SessionTokens,
  writeSessionCookies,
} from '@/lib/auth/tokens';
import { serverApiUrl } from '@/lib/constants/env';

const PUBLIC_PATHS = new Set(['/login']);

async function refreshSession(refreshToken: string, request: NextRequest): Promise<SessionTokens | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': request.headers.get('user-agent') ?? 'admin',
  };
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) headers['X-Forwarded-For'] = forwardedFor;

  try {
    const response = await fetch(`${serverApiUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? ((await response.json()) as SessionTokens) : null;
  } catch {
    return null;
  }
}

/**
 * Session gate for every admin page:
 * - fresh access token → continue
 * - expired access token + refresh token → rotate the session transparently
 * - no valid session → redirect to /login?next=...
 *
 * Every Server Action and page still relies on the backend to verify the token;
 * this proxy only keeps the session alive and the UX smooth.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.has(pathname);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (isTokenFresh(accessToken)) {
    return isPublic ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next();
  }

  if (refreshToken) {
    const session = await refreshSession(refreshToken, request);
    if (session) {
      // Make the new tokens visible to this request's Server Components...
      request.cookies.set(ACCESS_TOKEN_COOKIE, session.accessToken);
      request.cookies.set(REFRESH_TOKEN_COOKIE, session.refreshToken);
      const response = isPublic
        ? NextResponse.redirect(new URL('/', request.url))
        : NextResponse.next({ request: { headers: request.headers } });
      // ...and persist them in the browser.
      writeSessionCookies(response.cookies, session);
      return response;
    }
  }

  if (isPublic) {
    const response = NextResponse.next();
    if (accessToken || refreshToken) clearSessionCookies(response.cookies);
    return response;
  }

  const loginUrl = new URL('/login', request.url);
  if (pathname !== '/') loginUrl.searchParams.set('next', `${pathname}${search}`);
  const response = NextResponse.redirect(loginUrl);
  clearSessionCookies(response.cookies);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt).*)'],
};

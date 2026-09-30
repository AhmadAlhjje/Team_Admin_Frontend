/**
 * Session cookie conventions shared by the proxy (edge of the request) and
 * server code. Tokens live only in httpOnly cookies on the admin domain:
 * browser JavaScript never sees them.
 */

export const ACCESS_TOKEN_COOKIE = 'tp_admin_at';
export const REFRESH_TOKEN_COOKIE = 'tp_admin_rt';

/** Refresh a little before expiry to avoid failing requests mid-flight. */
export const EXPIRY_SKEW_SECONDS = 30;

export interface SessionTokens {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface CookieWriter {
  set(name: string, value: string, options: Record<string, unknown>): unknown;
  delete(name: string): unknown;
}

function cookieOptions(expiresAt: string) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires: new Date(expiresAt),
  };
}

export function writeSessionCookies(cookies: CookieWriter, session: SessionTokens): void {
  cookies.set(ACCESS_TOKEN_COOKIE, session.accessToken, cookieOptions(session.accessTokenExpiresAt));
  cookies.set(REFRESH_TOKEN_COOKIE, session.refreshToken, cookieOptions(session.refreshTokenExpiresAt));
}

export function clearSessionCookies(cookies: CookieWriter): void {
  cookies.delete(ACCESS_TOKEN_COOKIE);
  cookies.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Reads the `exp` claim of a JWT without verifying it. Only used to decide
 * when to refresh — the backend verifies every token.
 */
export function readTokenExpiry(token: string): number | null {
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: unknown };
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

export function isTokenFresh(token: string | undefined, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  if (!token) return false;
  const expiry = readTokenExpiry(token);
  return expiry !== null && expiry - EXPIRY_SKEW_SECONDS > nowSeconds;
}

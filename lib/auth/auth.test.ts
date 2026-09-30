import { describe, expect, it } from 'vitest';

import { can, Permission } from './permissions';
import { safeRedirectPath } from './redirect';
import { EXPIRY_SKEW_SECONDS, isTokenFresh, readTokenExpiry } from './tokens';

function jwtWithExp(exp: unknown): string {
  const encode = (value: object) =>
    btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${encode({ alg: 'HS256' })}.${encode({ sub: 1, exp })}.signature`;
}

describe('token expiry', () => {
  const now = 1_800_000_000;

  it('reads the exp claim of a JWT', () => {
    expect(readTokenExpiry(jwtWithExp(now))).toBe(now);
  });

  it('treats malformed tokens as expired', () => {
    expect(readTokenExpiry('not-a-jwt')).toBeNull();
    expect(readTokenExpiry(jwtWithExp('soon'))).toBeNull();
    expect(isTokenFresh(undefined, now)).toBe(false);
    expect(isTokenFresh('garbage.garbage.garbage', now)).toBe(false);
  });

  it('refreshes slightly before the real expiry', () => {
    expect(isTokenFresh(jwtWithExp(now + EXPIRY_SKEW_SECONDS + 60), now)).toBe(true);
    expect(isTokenFresh(jwtWithExp(now + EXPIRY_SKEW_SECONDS - 1), now)).toBe(false);
  });
});

describe('safeRedirectPath (open redirect protection)', () => {
  it.each([
    ['/projects/3', '/projects/3'],
    ['/messages?status=UNREAD', '/messages?status=UNREAD'],
    ['https://evil.example', '/'],
    ['//evil.example', '/'],
    ['/\\evil.example', '/'],
    ['javascript:alert(1)', '/'],
    [null, '/'],
  ])('%s → %s', (input, expected) => {
    expect(safeRedirectPath(input)).toBe(expected);
  });
});

describe('can', () => {
  it('checks permissions granted by the backend', () => {
    const user = { permissions: [Permission.ContentManage] };
    expect(can(user, Permission.ContentManage)).toBe(true);
    expect(can(user, Permission.UsersManage)).toBe(false);
    expect(can(null, Permission.ContentManage)).toBe(false);
  });
});

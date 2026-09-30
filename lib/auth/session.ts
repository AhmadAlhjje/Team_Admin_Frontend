import 'server-only';

import { cache } from 'react';

import { loadOrRedirect } from '@/lib/api/client';
import { api } from '@/lib/api/resources';
import type { AuthUser } from '@/types/api';

/**
 * The signed-in admin, loaded once per request (deduplicated with React cache).
 * Redirects to /login when the session is no longer valid.
 */
export const getCurrentUser = cache((): Promise<AuthUser> => loadOrRedirect(api.auth.me()));

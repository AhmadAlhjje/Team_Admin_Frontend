import type { AuthUser } from '@/types/api';

/**
 * Permission names granted by the backend (backend/src/common/auth/permissions.ts).
 * The UI uses them only to hide what the user cannot do — the backend enforces them.
 */
export const Permission = {
  ContentManage: 'content:manage',
  MessagesManage: 'messages:manage',
  MediaUpload: 'media:upload',
  SettingsManage: 'settings:manage',
  UsersManage: 'users:manage',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export function can(user: Pick<AuthUser, 'permissions'> | null | undefined, permission: Permission): boolean {
  return Boolean(user?.permissions.includes(permission));
}

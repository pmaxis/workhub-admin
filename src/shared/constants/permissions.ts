/** Ключі дозволів — мають збігатися з бекендом (ability.constants PERMISSIONS). */
export const PERMISSIONS = {
  MANAGE_ALL: 'manage.all',
  USERS_READ: 'users.read',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

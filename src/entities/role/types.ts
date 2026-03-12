import type { Permission } from '@/entities/permission/types';

export interface Role {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  /** При include з бекенду: permissions: [{ permission: Permission }] */
  permissions?: { permission: Permission }[];
}

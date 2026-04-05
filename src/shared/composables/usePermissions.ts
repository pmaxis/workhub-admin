import { computed } from 'vue';
import { useAuth } from '@/features/auth';
import type { PermissionName } from '@/shared/constants/permissions';

export function usePermissions() {
  const auth = useAuth();

  const permissions = computed(() => auth.user?.permissions ?? []);

  function can(permission: PermissionName): boolean {
    const list = permissions.value;
    if (list.includes('manage.all')) return true;
    return list.includes(permission);
  }

  return { permissions, can };
}

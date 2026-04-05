<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div v-if="!canRead" class="text-zinc-500 text-sm">
        You do not have access to the permissions list.
      </div>
      <template v-else>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-medium text-zinc-200">Permissions</h2>
          <Button v-if="canCreate" :to="{ name: 'permissionCreate' }" variant="secondary">
            Add permission
          </Button>
        </div>

        <ErrorMessage :message="error" class="mb-4" />

        <div v-if="loading" class="text-zinc-400 text-sm">Loading…</div>
        <div v-else-if="permissions.length === 0" class="text-zinc-500 text-sm">
          No permissions yet.
        </div>
        <Table v-else :items="permissions" key-field="id">
          <template #head>
            <TableTh>Key</TableTh>
            <TableTh v-if="canUpdate || canDelete" align="end">Actions</TableTh>
          </template>
          <template #row="{ item: perm }">
            <TableTd>
              <router-link
                v-if="canUpdate"
                :to="{ name: 'permissionEdit', params: { id: perm.id } }"
                class="font-mono text-sm font-medium text-zinc-200 hover:text-amber-400 hover:underline"
              >
                {{ perm.key }}
              </router-link>
              <span v-else class="font-mono text-sm font-medium text-zinc-200">{{ perm.key }}</span>
              <span v-if="perm.description" class="ml-2 text-sm text-zinc-500">
                — {{ perm.description }}
              </span>
            </TableTd>
            <TableTd v-if="canUpdate || canDelete" align="end">
              <Dropdown>
                <DropdownItem :to="{ name: 'permissionEdit', params: { id: perm.id } }">
                  Edit
                </DropdownItem>
                <DropdownItem v-if="canDelete" danger @click="confirmDelete(perm)">
                  Delete
                </DropdownItem>
              </Dropdown>
            </TableTd>
          </template>
        </Table>
      </template>
    </div>

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="handleDelete">
      <template #message>
        permission <span class="font-mono">{{ deleteTarget?.key }}</span>
      </template>
    </ConfirmDeleteModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Button,
  ErrorMessage,
  Table,
  TableTh,
  TableTd,
  Dropdown,
  DropdownItem,
  ConfirmDeleteModal,
} from '@/shared/ui';
import { useToast } from '@/shared/ui/Toast';
import { usePermissionsStore } from '@/features/permissions';
import { usePermissions } from '@/shared/composables/usePermissions';
import { PERMISSIONS } from '@/shared/constants/permissions';
import type { Permission } from '@/entities/permission/types';

const { can } = usePermissions();
const canRead = computed(() => can(PERMISSIONS.PERMISSIONS_READ));
const canCreate = computed(() => can(PERMISSIONS.PERMISSIONS_CREATE));
const canUpdate = computed(() => can(PERMISSIONS.PERMISSIONS_UPDATE));
const canDelete = computed(() => can(PERMISSIONS.PERMISSIONS_DELETE));

const { successWithUndo, error: showError } = useToast();
const permissionsStore = usePermissionsStore();
const { permissions, loading, error } = storeToRefs(permissionsStore);

const deleteTarget = ref<Permission | null>(null);

async function load() {
  if (!canRead.value) return;
  try {
    await permissionsStore.fetchAll();
  } catch (e: unknown) {
    showError(e instanceof Error ? e.message : 'Could not load permissions');
  }
}

function handleDelete() {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value.id;
  const key = deleteTarget.value.key;
  const removed = permissionsStore.removeFromList(id);
  deleteTarget.value = null;
  permissionsStore.clearError();

  if (!removed) return;

  const timeoutId = setTimeout(async () => {
    try {
      await permissionsStore.remove(id);
    } catch (e: unknown) {
      showError(e instanceof Error ? e.message : 'Delete failed');
      permissionsStore.restoreAt(removed.item, removed.index);
    }
  }, 5000);

  successWithUndo(`Permission ${key} deleted`, () => {
    clearTimeout(timeoutId);
    permissionsStore.restoreAt(removed.item, removed.index);
  });
}

function confirmDelete(perm: Permission) {
  deleteTarget.value = perm;
}

onMounted(load);
</script>

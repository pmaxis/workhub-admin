<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-medium text-zinc-200">Дозволи (permissions)</h2>
        <Button :to="{ name: 'permissionCreate' }" variant="secondary"> Додати дозвіл </Button>
      </div>

      <ErrorMessage :message="error" class="mb-4" />

      <div v-if="loading" class="text-zinc-400 text-sm">Завантаження…</div>
      <div v-else-if="permissions.length === 0" class="text-zinc-500 text-sm">
        Дозволів поки немає.
      </div>
      <Table v-else :items="permissions" key-field="id">
        <template #head>
          <TableTh>Ключ</TableTh>
          <TableTh align="end">Дії</TableTh>
        </template>
        <template #row="{ item: perm }">
          <TableTd>
            <span class="font-mono text-sm font-medium text-zinc-200">{{ perm.key }}</span>
            <span v-if="perm.description" class="ml-2 text-sm text-zinc-500">
              — {{ perm.description }}
            </span>
          </TableTd>
          <TableTd align="end">
            <Dropdown>
              <DropdownItem :to="{ name: 'permissionEdit', params: { id: perm.id } }">
                Редагувати
              </DropdownItem>
              <DropdownItem danger @click="confirmDelete(perm)"> Видалити </DropdownItem>
            </Dropdown>
          </TableTd>
        </template>
      </Table>
    </div>

    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      @click.self="deleteTarget = null"
    >
      <div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6">
        <p class="text-zinc-200">
          Видалити дозвіл <strong class="font-mono">{{ deleteTarget.key }}</strong
          >?
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" @click="deleteTarget = null"> Ні </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            :disabled="deleteLoading"
            @click="handleDelete"
          >
            {{ deleteLoading ? '…' : 'Так, видалити' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, ErrorMessage, Table, TableTh, TableTd, Dropdown, DropdownItem } from '@/shared/ui';
import { usePermissionsStore } from '@/features/permissions';
import type { Permission } from '@/entities/permission/types';

const permissionsStore = usePermissionsStore();
const { permissions, loading, error } = storeToRefs(permissionsStore);

const deleteLoading = ref(false);
const deleteTarget = ref<Permission | null>(null);

async function load() {
  await permissionsStore.fetchAll();
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  permissionsStore.clearError();
  try {
    await permissionsStore.remove(deleteTarget.value.id);
    deleteTarget.value = null;
  } catch (e: unknown) {
    permissionsStore.setError(e instanceof Error ? e.message : 'Помилка видалення');
  } finally {
    deleteLoading.value = false;
  }
}

function confirmDelete(perm: Permission) {
  deleteTarget.value = perm;
}

onMounted(load);
</script>

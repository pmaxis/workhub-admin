<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-medium text-zinc-200">Ролі</h2>
        <Button :to="{ name: 'roleCreate' }" variant="secondary"> Додати роль </Button>
      </div>

      <ErrorMessage :message="error" class="mb-4" />

      <div v-if="loading" class="text-zinc-400 text-sm">Завантаження…</div>
      <div v-else-if="roles.length === 0" class="text-zinc-500 text-sm">Ролей поки немає.</div>
      <Table v-else :items="roles" key-field="id">
        <template #head>
          <TableTh>Slug</TableTh>
          <TableTh>Назва</TableTh>
          <TableTh align="end">Дії</TableTh>
        </template>
        <template #row="{ item: role }">
          <TableTd>
            <span class="font-mono text-sm text-zinc-300">{{ role.slug }}</span>
          </TableTd>
          <TableTd>
            <span class="font-medium text-zinc-200">{{ role.name }}</span>
          </TableTd>
          <TableTd align="end">
            <Dropdown>
              <DropdownItem :to="{ name: 'roleEdit', params: { id: role.id } }">
                Редагувати
              </DropdownItem>
              <DropdownItem danger @click="confirmDelete(role)"> Видалити </DropdownItem>
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
          Видалити роль <strong>{{ deleteTarget.name }}</strong
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
import { useRolesStore } from '@/features/roles';
import type { Role } from '@/entities/role/types';

const rolesStore = useRolesStore();
const { roles, loading, error } = storeToRefs(rolesStore);

const deleteLoading = ref(false);
const deleteTarget = ref<Role | null>(null);

async function load() {
  await rolesStore.fetchAll();
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  rolesStore.clearError();
  try {
    await rolesStore.remove(deleteTarget.value.id);
    deleteTarget.value = null;
  } catch (e: unknown) {
    rolesStore.setError(e instanceof Error ? e.message : 'Помилка видалення');
  } finally {
    deleteLoading.value = false;
  }
}

function confirmDelete(role: Role) {
  deleteTarget.value = role;
}

onMounted(load);
</script>

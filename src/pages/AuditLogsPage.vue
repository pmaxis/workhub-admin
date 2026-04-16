<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 class="text-base font-medium text-zinc-200 mb-4">Audit logs</h2>
      <p class="text-zinc-500 text-sm mb-4">
        Application events stored for administrators (sign-ins and other recorded actions).
      </p>

      <ErrorMessage :message="error" class="mb-4" />

      <div class="flex flex-wrap items-end gap-3 mb-4">
        <FormField label="Level" class="min-w-[140px]">
          <select
            v-model="filters.level"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
          >
            <option value="">Any</option>
            <option value="DEBUG">DEBUG</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </FormField>
        <FormField label="Source contains" class="min-w-[180px] flex-1">
          <Input v-model="filters.source" placeholder="e.g. auth" @keyup.enter="applyFilters" />
        </FormField>
        <Button variant="secondary" type="button" @click="applyFilters">Apply</Button>
      </div>

      <div v-if="loading" class="text-zinc-400 text-sm">Loading…</div>
      <div v-else-if="rows.length === 0" class="text-zinc-500 text-sm">No log entries yet.</div>
      <Table v-else :items="rows" key-field="id">
        <template #head>
          <TableTh>Time (UTC)</TableTh>
          <TableTh>Level</TableTh>
          <TableTh>Source</TableTh>
          <TableTh>Message</TableTh>
          <TableTh>Actor</TableTh>
          <TableTh>Context</TableTh>
        </template>
        <template #row="{ item: row }">
          <TableTd class="whitespace-nowrap text-zinc-400 text-xs font-mono">
            {{ formatTime(row.createdAt) }}
          </TableTd>
          <TableTd>
            <span
              class="rounded px-1.5 py-0.5 text-xs font-medium"
              :class="levelClass(row.level)"
            >
              {{ row.level }}
            </span>
          </TableTd>
          <TableTd class="text-zinc-300 text-sm">{{ row.source }}</TableTd>
          <TableTd class="text-zinc-200 text-sm max-w-md">{{ row.message }}</TableTd>
          <TableTd class="text-zinc-400 text-sm">
            {{ row.actor ? row.actor.email : '—' }}
          </TableTd>
          <TableTd class="text-zinc-500 text-xs font-mono max-w-xs truncate" :title="contextTitle(row.context)">
            {{ formatContext(row.context) }}
          </TableTd>
        </template>
      </Table>

      <div v-if="total > 0" class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-400">
        <span>
          Page {{ page }} of {{ totalPages }} · {{ total }} entries
        </span>
        <div class="flex gap-2">
          <Button variant="secondary" type="button" :disabled="page <= 1 || loading" @click="goPrev">
            Previous
          </Button>
          <Button variant="secondary" type="button" :disabled="page >= totalPages || loading" @click="goNext">
            Next
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Button, ErrorMessage, Table, TableTh, TableTd, Input, FormField } from '@/shared/ui';
import { useToast } from '@/shared/ui/Toast';
import { adminAuditLogsApi } from '@/features/admin-audit-logs';
import type { AdminAuditLog, AdminAuditLogLevel } from '@/features/admin-audit-logs';

const { error: showError } = useToast();

const loading = ref(false);
const error = ref<string | null>(null);
const rows = ref<AdminAuditLog[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(50);

const filters = ref<{ level: '' | AdminAuditLogLevel; source: string }>({
  level: '',
  source: '',
});

const applied = ref<{ level?: AdminAuditLogLevel; source?: string }>({});

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));

function levelClass(level: AdminAuditLogLevel): string {
  switch (level) {
    case 'ERROR':
      return 'bg-red-950/80 text-red-300';
    case 'WARN':
      return 'bg-amber-950/60 text-amber-200';
    case 'INFO':
      return 'bg-zinc-800 text-zinc-200';
    default:
      return 'bg-zinc-800/80 text-zinc-400';
  }
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toISOString().replace('T', ' ').slice(0, 19);
  } catch {
    return iso;
  }
}

function formatContext(ctx: Record<string, unknown> | null): string {
  if (!ctx || Object.keys(ctx).length === 0) return '—';
  try {
    const s = JSON.stringify(ctx);
    return s.length > 80 ? `${s.slice(0, 80)}…` : s;
  } catch {
    return '—';
  }
}

function contextTitle(ctx: Record<string, unknown> | null): string {
  if (!ctx) return '';
  try {
    return JSON.stringify(ctx, null, 2);
  } catch {
    return '';
  }
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await adminAuditLogsApi.getPage({
      page: page.value,
      limit: limit.value,
      ...applied.value,
    });
    rows.value = res.data;
    total.value = res.total;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Could not load audit logs';
    error.value = msg;
    showError(msg);
    rows.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  page.value = 1;
  applied.value = {};
  if (filters.value.level) {
    applied.value.level = filters.value.level;
  }
  if (filters.value.source.trim()) {
    applied.value.source = filters.value.source.trim();
  }
  void load();
}

function goPrev() {
  if (page.value <= 1) return;
  page.value -= 1;
  void load();
}

function goNext() {
  if (page.value >= totalPages.value) return;
  page.value += 1;
  void load();
}

onMounted(() => {
  void load();
});
</script>

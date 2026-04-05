<template>
  <div
    v-if="modelValue"
    class="workhub-confirm-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    @click.self="$emit('update:modelValue', null)"
  >
    <div class="workhub-confirm-modal w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
      <p class="text-base font-semibold text-zinc-100">
        Are you sure you want to delete <slot name="message" />?
      </p>
      <p class="mt-2 text-xs text-zinc-500">
        This action cannot be undone. The item will be permanently removed.
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" @click="$emit('update:modelValue', null)">
          No
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          {{ loading ? '…' : 'Yes, delete' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/shared/ui';

withDefaults(
  defineProps<{
    modelValue: unknown;
    loading?: boolean;
  }>(),
  { loading: false },
);

defineEmits<{
  (e: 'update:modelValue', value: null): void;
  (e: 'confirm'): void;
}>();
</script>

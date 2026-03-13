<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    @click.self="$emit('update:modelValue', null)"
  >
    <div class="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6">
      <p class="text-zinc-200">
        <slot />
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" @click="$emit('update:modelValue', null)">
          Ні
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          {{ loading ? '…' : 'Так, видалити' }}
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

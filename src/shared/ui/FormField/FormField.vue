<template>
  <div>
    <label v-if="label" :for="fieldId" :class="labelClass">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    fieldId?: string;
    size?: 'sm' | 'md';
  }>(),
  { size: 'md' }
);

provide('formFieldId', props.fieldId);

const labelClass = computed(() => [
  'block font-medium text-zinc-400',
  props.size === 'sm' ? 'mb-1 text-xs' : 'mb-1.5 text-sm text-zinc-300',
]);
</script>

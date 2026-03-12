<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="to"
    :disabled="disabled"
    :class="buttonClass"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'dangerGhost'
  | 'link'
  | 'sidebar'
  | 'sidebarDanger';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    type?: 'button' | 'submit';
    disabled?: boolean;
    to?: RouteLocationRaw;
    size?: 'sm' | 'md' | 'full';
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    size: 'md',
  }
);

const tag = computed(() => (props.to ? 'router-link' : 'button'));

const baseClass =
  'workhub-btn inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-amber-600 text-zinc-950 hover:bg-amber-500',
  secondary:
    'border border-amber-500/70 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30',
  ghost:
    'border border-zinc-600 text-zinc-300 hover:bg-zinc-700',
  danger:
    'bg-red-600/80 text-white hover:bg-red-600',
  dangerGhost:
    'text-red-400 hover:bg-red-500/20',
  link:
    'rounded px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/20',
  sidebar:
    'flex w-full items-center justify-start gap-3 rounded-lg border border-zinc-700 px-3 py-2 text-sm font-normal text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-100',
  sidebarDanger:
    'flex w-full items-center justify-start gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-normal text-zinc-400 hover:bg-zinc-800/80 hover:text-red-400',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  full: 'w-full px-4 py-2.5',
};

const isSmallVariant = computed(
  () => props.variant === 'dangerGhost' || props.variant === 'link'
);

const isSidebarVariant = computed(
  () => props.variant === 'sidebar' || props.variant === 'sidebarDanger'
);

const buttonClass = computed(() => [
  baseClass,
  variantClasses[props.variant],
  isSmallVariant.value ? 'rounded px-2 py-1 text-xs' : isSidebarVariant.value ? '' : sizeClasses[props.size],
]);
</script>

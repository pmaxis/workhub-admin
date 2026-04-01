<template>
  <div class="shrink-0 border-t border-zinc-800 p-3">
    <div class="flex items-center">
      <button
        ref="buttonRef"
        type="button"
        class="rounded-full p-0.5 focus:outline-none"
        aria-haspopup="true"
        :aria-expanded="isUserMenuOpen"
        @click="$emit('toggle-menu')"
      >
        <Avatar :initials="userInitials" :is-light-theme="isLightTheme" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Avatar } from '@/shared/ui';

defineProps<{
  userInitials: string;
  isLightTheme: boolean;
  isUserMenuOpen: boolean;
}>();

defineEmits<{
  'toggle-menu': [];
}>();

const buttonRef = ref<HTMLElement | null>(null);

defineExpose({ buttonRef });
</script>

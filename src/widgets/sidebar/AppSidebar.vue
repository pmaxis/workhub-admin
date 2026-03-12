<template>
  <div class="relative flex shrink-0">
    <aside
      class="flex w-64 shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900/60"
    >
      <router-link to="/" class="flex shrink-0 items-center border-b border-zinc-800 px-3 py-3">
        <span class="font-semibold text-zinc-100">WorkHub</span>
      </router-link>
      <!-- Область меню: панель відкривається тільки в межах цієї області -->
      <div class="relative min-h-0 flex-1 flex flex-col overflow-hidden">
        <nav
          class="min-h-0 flex-1 overflow-y-auto p-3 space-y-1"
          :class="{ invisible: openFlyoutGroup }"
        >
          <template v-for="item in navStructure" :key="item.type === 'link' ? item.name : item.id">
            <router-link
              v-if="item.type === 'link'"
              :to="item.to"
              :class="[
                'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus:outline-none',
                isActive(item.name) ? activeNavClass : inactiveNavClass,
              ]"
            >
              <span class="truncate min-w-0">{{ item.label }}</span>
            </router-link>
            <button
              v-else
              type="button"
              :aria-expanded="openFlyoutId === item.id"
              :aria-haspopup="true"
              :class="[
                'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus:outline-none',
                isGroupActive(item) || openFlyoutId === item.id ? activeNavClass : inactiveNavClass,
              ]"
              @click="toggleGroup(item)"
            >
              <span class="truncate min-w-0">{{ item.label }}</span>
              <span class="shrink-0 ml-2 text-zinc-500" aria-hidden="true">›</span>
            </button>
          </template>
        </nav>

        <!-- Панель у межах області під меню (поверх списку пунктів) -->
        <div
          v-if="openFlyoutGroup"
          class="absolute inset-0 flex flex-col rounded-lg m-2 shadow-xl z-10"
          :class="
            isLightTheme ? 'bg-white border border-zinc-200' : 'bg-zinc-900 border border-zinc-800'
          "
          role="dialog"
          :aria-label="openFlyoutGroup.label"
        >
          <div
            class="flex shrink-0 items-center px-3 py-2.5"
            :class="isLightTheme ? 'border-b border-zinc-200' : 'border-b border-zinc-800'"
          >
            <button
              type="button"
              class="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg focus:outline-none"
              :class="
                isLightTheme
                  ? 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              "
              aria-label="Назад"
              @click="closeFlyoutAndGoToFirst"
            >
              <span aria-hidden="true">←</span>
            </button>
            <h2
              class="min-w-0 truncate text-sm font-medium"
              :class="isLightTheme ? 'text-zinc-800' : 'text-zinc-200'"
            >
              {{ openFlyoutGroup.label }}
            </h2>
          </div>
          <nav class="min-h-0 flex-1 overflow-y-auto p-2 space-y-1">
            <router-link
              v-for="child in openFlyoutGroup.children"
              :key="child.name"
              :to="child.to"
              class="flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus:outline-none"
              :class="isChildActive(child) ? activeNavClass : inactiveNavClass"
            >
              <span class="truncate min-w-0">{{ child.label }}</span>
            </router-link>
          </nav>
        </div>
      </div>
      <div class="shrink-0 border-t border-zinc-800 p-3">
        <div class="flex items-center justify-between">
          <button
            ref="menuButtonRef"
            type="button"
            class="rounded-full p-0.5 focus:outline-none"
            aria-haspopup="true"
            :aria-expanded="isUserMenuOpen"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold"
              :class="
                isLightTheme
                  ? 'border border-amber-300 bg-amber-100 text-amber-800'
                  : 'border border-zinc-600 bg-amber-500/20 text-amber-300'
              "
            >
              {{ userInitials }}
            </div>
          </button>

          <div class="flex items-center">
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus:outline-none"
              :class="
                isLightTheme
                  ? 'border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
              "
              aria-label="Вийти"
              @click="handleLogout"
            >
              <span aria-hidden="true">⎋</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
    <Teleport to="body">
      <div
        v-if="isUserMenuOpen && auth.user"
        ref="menuPanelRef"
        class="fixed z-50 w-[calc(100vw-3rem)] max-w-80 overflow-hidden rounded-xl border shadow-2xl"
        :class="isLightTheme ? 'border-zinc-300 bg-white' : 'border-zinc-700 bg-zinc-900'"
        :style="userMenuStyle"
      >
        <div
          class="flex items-center gap-3 border-b p-3"
          :class="isLightTheme ? 'border-zinc-200' : 'border-zinc-800'"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold"
            :class="
              isLightTheme
                ? 'border border-amber-300 bg-amber-100 text-amber-800'
                : 'border border-zinc-600 bg-amber-500/20 text-amber-300'
            "
          >
            {{ userInitials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold" :class="isLightTheme ? 'text-zinc-900' : 'text-zinc-100'">
              {{ userPib || auth.user.email }}
            </p>
            <p class="truncate text-xs" :class="isLightTheme ? 'text-zinc-600' : 'text-zinc-400'">
              {{ auth.user.email }}
            </p>
          </div>
          <span
            class="rounded-md border px-2 py-0.5 text-[11px]"
            :class="
              isLightTheme
                ? 'border-blue-400/50 bg-blue-50 text-blue-700'
                : 'border-blue-500/40 bg-blue-500/10 text-blue-300'
            "
          >
            Admin
          </span>
        </div>

        <div class="space-y-1 p-2">
          <button
            type="button"
            class="w-full rounded-lg px-3 py-2 text-left text-sm focus:outline-none"
            :class="
              isLightTheme
                ? 'text-zinc-700 hover:bg-zinc-100'
                : 'text-zinc-200 hover:bg-zinc-800'
            "
            @click="goToMyAccount"
          >
            My Account
          </button>
        </div>

        <div class="border-t p-3" :class="isLightTheme ? 'border-zinc-200' : 'border-zinc-800'">
          <button
            type="button"
            class="mb-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm focus:outline-none"
            :class="
              isLightTheme
                ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                : 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
            "
            @click="themeStore.toggleTheme()"
          >
            <span>Dark Mode</span>
            <span :class="isLightTheme ? 'text-zinc-500' : 'text-zinc-400'">
              {{ themeStore.theme === 'dark' ? 'ON' : 'OFF' }}
            </span>
          </button>
          <button
            type="button"
            class="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
            :class="
              isLightTheme
                ? 'border-red-200 text-red-700 hover:bg-red-50'
                : 'border-zinc-700 text-zinc-100 hover:bg-zinc-800'
            "
            @click="handleLogout"
          >
            Log out
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { useAuth } from '@/features/auth';
import { useThemeStore } from '@/features/theme/store';
import { usePermissions } from '@/shared/composables/usePermissions';
import { PERMISSIONS } from '@/shared/constants/permissions';

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const themeStore = useThemeStore();
const { can } = usePermissions();
const menuButtonRef = ref<HTMLElement | null>(null);
const menuPanelRef = ref<HTMLElement | null>(null);
const isUserMenuOpen = ref(false);
const userMenuStyle = ref<Record<string, string>>({});

const userPib = computed(() => {
  const u = auth.user;
  if (!u) return '';
  const parts = [u.lastName, u.firstName, u.thirdName].filter(Boolean);
  return parts.length ? parts.join(' ') : '';
});

const userInitials = computed(() => {
  const u = auth.user;
  if (!u) return 'U';
  const initials = `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.trim();
  if (initials) return initials.toUpperCase();
  return u.email.slice(0, 1).toUpperCase();
});

type NavLink = {
  type: 'link';
  name: string;
  label: string;
  to: RouteLocationRaw;
};
type NavGroup = {
  type: 'group';
  id: string;
  label: string;
  children: Array<{
    name: string;
    label: string;
    to: RouteLocationRaw;
    routeNames: string[];
  }>;
};

const navStructureRaw: (NavLink | NavGroup)[] = [
  { type: 'link', name: 'dashboard', label: 'Головна', to: { name: 'dashboard' } },
  { type: 'link', name: 'users', label: 'Користувачі', to: { name: 'users' } },
  {
    type: 'group',
    id: 'roles-permissions',
    label: 'Ролі та дозволи',
    children: [
      {
        name: 'roles',
        label: 'Ролі',
        to: { name: 'roles' },
        routeNames: ['roles', 'roleCreate', 'roleEdit'],
      },
      {
        name: 'permissions',
        label: 'Дозволи',
        to: { name: 'permissions' },
        routeNames: ['permissions', 'permissionCreate', 'permissionEdit'],
      },
    ],
  },
];

/** Меню з урахуванням пермішенів: пункт «Користувачі» тільки при users.read */
const navStructure = computed(() => {
  return navStructureRaw.filter((item) => {
    if (item.type === 'link' && item.name === 'users') {
      return can(PERMISSIONS.USERS_READ);
    }
    return true;
  });
});

const openFlyoutId = ref<string | null>(null);

const openFlyoutGroup = computed(() => {
  if (!openFlyoutId.value) return null;
  const found = navStructure.value.find((i) => i.type === 'group' && i.id === openFlyoutId.value);
  return found && found.type === 'group' ? found : null;
});

const isLightTheme = computed(() => themeStore.theme === 'light');

const activeNavClass = computed(() =>
  isLightTheme.value
    ? 'border border-amber-400 bg-amber-100 text-amber-800 shadow-sm'
    : 'border border-amber-500/70 bg-amber-500/15 text-amber-300 shadow-sm',
);

const inactiveNavClass = computed(() =>
  isLightTheme.value
    ? 'border border-transparent text-zinc-700 hover:border-amber-300 hover:bg-amber-100 hover:text-zinc-900'
    : 'border border-transparent text-zinc-400 hover:border-zinc-600/70 hover:bg-zinc-800/70 hover:text-zinc-50',
);

function isActive(name: string): boolean {
  return route.name === name;
}

function isChildActive(child: { routeNames: string[] }): boolean {
  const name = route.name as string;
  return Boolean(name && child.routeNames.includes(name));
}

function isGroupActive(group: NavGroup): boolean {
  return group.children.some((child) => isChildActive(child));
}

function toggleGroup(group: NavGroup) {
  const firstChild = group.children[0];
  if (openFlyoutId.value === group.id) {
    openFlyoutId.value = null;
  } else if (firstChild) {
    openFlyoutId.value = group.id;
    router.push(firstChild.to);
  }
}

function closeFlyoutAndGoToFirst() {
  const firstLink = navStructure.value.find((i) => i.type === 'link');
  if (firstLink?.type === 'link') {
    router.push(firstLink.to);
  }
  openFlyoutId.value = null;
}

// При перезавантаженні або переході: якщо ми на сторінці з Контенту — панель відкрита
watch(
  () => route.name,
  (name) => {
    if (!name) return;
    for (const item of navStructure.value) {
      if (
        item.type === 'group' &&
        item.children.some((c) => c.routeNames.includes(name as string))
      ) {
        openFlyoutId.value = item.id;
        return;
      }
    }
  },
  { immediate: true },
);

async function handleLogout() {
  isUserMenuOpen.value = false;
  await auth.logout();
  router.replace({ name: 'login' });
}

function goToMyAccount() {
  isUserMenuOpen.value = false;
  router.push({ name: 'myAccount' });
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (menuButtonRef.value?.contains(target)) return;
  if (menuPanelRef.value?.contains(target)) return;
  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false;
  }
}

function updateUserMenuPosition() {
  if (!menuButtonRef.value) return;
  const rect = menuButtonRef.value.getBoundingClientRect();
  const margin = 12;
  const preferredWidth = 320;
  const left = Math.min(Math.max(rect.left, margin), window.innerWidth - preferredWidth - margin);
  userMenuStyle.value = {
    left: `${left}px`,
    bottom: `${window.innerHeight - rect.top + 8}px`,
  };
}

function handleViewportChange() {
  if (!isUserMenuOpen.value) return;
  updateUserMenuPosition();
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
  window.removeEventListener('resize', handleViewportChange);
  window.removeEventListener('scroll', handleViewportChange, true);
});

watch(isUserMenuOpen, async (open) => {
  if (!open) {
    window.removeEventListener('resize', handleViewportChange);
    window.removeEventListener('scroll', handleViewportChange, true);
    return;
  }
  await nextTick();
  updateUserMenuPosition();
  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('scroll', handleViewportChange, true);
});
</script>

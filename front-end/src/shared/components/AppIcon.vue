<script setup lang="ts">
import { APP_ICON_REGISTRY } from './app-icon.registry'
import type { AppIconName, AppIconSize } from '@/shared/types/app-icon'

withDefaults(
  defineProps<{
    name: AppIconName
    size?: AppIconSize
  }>(),
  { size: 'sm' },
)
</script>

<template>
  <component
    :is="APP_ICON_REGISTRY[name]"
    class="app-icon"
    :class="`app-icon--${size}`"
    aria-hidden="true"
    :data-icon="name"
  />
</template>

<style scoped>
@reference "@/styles/main.css";

.app-icon {
  @apply inline-block shrink-0;
}

.app-icon--xs {
  @apply size-3.5;
}

.app-icon--sm {
  @apply size-4;
}

.app-icon--md {
  @apply size-6;
}

.app-icon--lg {
  @apply size-10;
}
</style>

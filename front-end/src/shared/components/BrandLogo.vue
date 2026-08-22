<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="brand-logo" aria-label="POA — página inicial">
    <span class="brand-logo-mark" aria-hidden="true" />
    <span class="brand-logo-name">POA</span>
  </RouterLink>
</template>

<style scoped>
@reference "@/styles/main.css";

.brand-logo {
  @apply flex items-center gap-2 no-underline text-base-content;
}

.brand-logo-mark {
  @apply size-8 rounded-field bg-neutral;
}

.brand-logo-name {
  @apply text-lg font-bold;
}
</style>

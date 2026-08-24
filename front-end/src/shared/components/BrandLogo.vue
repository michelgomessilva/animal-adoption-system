<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="brand-logo" aria-label="POA — página inicial">
    <span class="brand-logo-mark" aria-hidden="true">
      <span class="brand-logo-ear" />
      <span class="brand-logo-face" />
    </span>
    <span class="brand-logo-name">POA</span>
  </RouterLink>
</template>

<style scoped>
@reference "@/styles/main.css";

.brand-logo {
  @apply flex items-center gap-2 no-underline text-base-content;
}

.brand-logo-mark {
  @apply relative size-9;
}

.brand-logo-ear {
  @apply absolute top-0 left-1 size-3.5 rotate-12 rounded-t-full bg-accent;
}

.brand-logo-face {
  @apply absolute right-0 bottom-0 size-7 rounded-[1.1rem] bg-primary;
  box-shadow: inset 0.45rem 0.2rem 0 0 color-mix(in oklch, var(--color-secondary) 88%, black);
}

.brand-logo-name {
  @apply font-serif text-xl font-bold tracking-tight;
}
</style>

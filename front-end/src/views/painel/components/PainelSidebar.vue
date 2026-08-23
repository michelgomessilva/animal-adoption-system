<script setup lang="ts">
import PainelNav from './PainelNav.vue'
</script>

<template>
  <aside class="painel-sidebar">
    <p class="painel-sidebar-label">Operação</p>
    <PainelNav />
  </aside>
</template>

<style scoped>
@reference "@/styles/main.css";

.painel-sidebar {
  @apply flex min-h-full w-72 flex-col bg-neutral p-5 text-neutral-content;
}

.painel-sidebar-label {
  @apply mb-3 px-2 text-xs font-semibold tracking-[0.18em] text-neutral-content/55 uppercase;
}
</style>

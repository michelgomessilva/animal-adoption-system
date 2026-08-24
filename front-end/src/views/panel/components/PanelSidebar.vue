<script setup lang="ts">
import PanelNav from './PanelNav.vue'
</script>

<template>
  <aside class="panel-sidebar">
    <p class="panel-sidebar-label">Operação</p>
    <PanelNav />
  </aside>
</template>

<style scoped>
@reference "@/styles/main.css";

.panel-sidebar {
  @apply flex min-h-full w-72 flex-col bg-neutral p-5 text-neutral-content;
}

.panel-sidebar-label {
  @apply mb-3 px-2 text-xs font-semibold tracking-[0.18em] text-neutral-content/55 uppercase;
}
</style>

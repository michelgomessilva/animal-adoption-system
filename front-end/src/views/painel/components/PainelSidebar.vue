<script setup lang="ts">
import PainelNav from './PainelNav.vue'
</script>

<template>
  <aside class="painel-sidebar">
    <PainelNav />
  </aside>
</template>

<style scoped>
@reference "@/styles/main.css";

.painel-sidebar {
  @apply flex min-h-full w-64 flex-col bg-base-200 p-4;
}
</style>

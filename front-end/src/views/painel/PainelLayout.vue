<script setup lang="ts">
import { RouterView } from 'vue-router'

import PainelHeader from '@/views/painel/components/PainelHeader.vue'
import PainelSidebar from '@/views/painel/components/PainelSidebar.vue'
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="painel-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content painel-content">
      <PainelHeader />
      <main class="painel-main">
        <RouterView />
      </main>
    </div>
    <div class="drawer-side">
      <label for="painel-drawer" class="drawer-overlay" aria-label="Fechar menu"></label>
      <PainelSidebar />
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.painel-content {
  @apply min-h-dvh bg-base-200;
}

.painel-main {
  @apply p-5 sm:p-8;
}
</style>

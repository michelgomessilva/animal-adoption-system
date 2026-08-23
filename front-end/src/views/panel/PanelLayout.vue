<script setup lang="ts">
import { RouterView } from 'vue-router'

import PanelHeader from '@/views/panel/components/PanelHeader.vue'
import PanelSidebar from '@/views/panel/components/PanelSidebar.vue'
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="panel-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content panel-content">
      <PanelHeader />
      <main class="panel-main">
        <RouterView />
      </main>
    </div>
    <div class="drawer-side">
      <label for="panel-drawer" class="drawer-overlay" aria-label="Fechar menu"></label>
      <PanelSidebar />
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.panel-content {
  @apply min-h-dvh bg-base-200;
}

.panel-main {
  @apply p-5 sm:p-8;
}
</style>

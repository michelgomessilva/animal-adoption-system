<script setup lang="ts">
import { RouterView } from 'vue-router'

import PublicHeader from '@/views/public/components/PublicHeader.vue'
</script>

<template>
  <div class="public-layout">
    <PublicHeader />
    <RouterView />
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.public-layout {
  @apply min-h-dvh;
}
</style>

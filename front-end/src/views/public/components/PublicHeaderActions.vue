<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="public-header-actions">
    <RouterLink :to="{ name: 'login' }" class="btn btn-primary">Área da ONG</RouterLink>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.public-header-actions {
  @apply flex items-center gap-2;
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import BrandLogo from '@/shared/components/BrandLogo.vue'
</script>

<template>
  <main class="not-found">
    <BrandLogo />
    <h1>Página não encontrada</h1>
    <p>O endereço que você abriu não existe no POA.</p>
    <RouterLink :to="{ name: 'home' }" class="btn">Voltar ao catálogo</RouterLink>
  </main>
</template>

<style scoped>
@reference "@/styles/main.css";

.not-found {
  @apply mx-auto flex min-h-dvh max-w-lg flex-col items-start justify-center gap-4 px-4;
}

.not-found h1 {
  @apply text-3xl font-bold;
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BrandLogo from '@/shared/components/BrandLogo.vue'
import { useAuthStore } from '@/shared/stores/auth.store'

const auth = useAuthStore()
const router = useRouter()

async function onLogout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar bg-base-200">
    <div class="navbar-start">
      <label for="painel-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Abrir menu">
        <span aria-hidden="true">☰</span>
      </label>
      <BrandLogo />
      <span class="painel-header-context">Painel</span>
    </div>
    <div class="navbar-end">
      <button type="button" class="btn btn-ghost" @click="onLogout">Sair</button>
    </div>
  </header>
</template>

<style scoped>
@reference "@/styles/main.css";

.painel-header-context {
  @apply ml-2 text-sm opacity-70;
}
</style>

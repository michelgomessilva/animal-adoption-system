<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppIcon from '@/shared/components/AppIcon.vue'
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
  <header class="panel-header">
    <div class="navbar-start">
      <label for="panel-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Abrir menu">
        <AppIcon name="menu" />
      </label>
      <BrandLogo />
      <span class="panel-header-context">Painel</span>
    </div>
    <div class="navbar-end">
      <button type="button" class="btn btn-ghost" @click="onLogout">
        <AppIcon name="log-out" />
        Sair
      </button>
    </div>
  </header>
</template>

<style scoped>
@reference "@/styles/main.css";

.panel-header {
  @apply navbar border-b border-base-300 bg-base-100;
}

.panel-header-context {
  @apply ml-2 rounded-selector bg-secondary/12 px-2 py-0.5 text-xs font-semibold tracking-wide text-secondary uppercase;
}
</style>

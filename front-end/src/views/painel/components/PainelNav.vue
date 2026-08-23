<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AppIcon from '@/shared/components/AppIcon.vue'
import ComingSoon from '@/views/painel/components/ComingSoon.vue'
</script>

<template>
  <ul class="menu w-full">
    <li>
      <RouterLink :to="{ name: 'painel-animais' }">
        <AppIcon name="paw-print" />
        Meus pets
      </RouterLink>
    </li>
    <li>
      <ComingSoon>
        <span class="painel-nav-item">
          <AppIcon name="inbox" />
          Pedidos de adoção
        </span>
      </ComingSoon>
    </li>
    <li>
      <ComingSoon>
        <span class="painel-nav-item">
          <AppIcon name="landmark" />
          Perfil da ONG
        </span>
      </ComingSoon>
    </li>
  </ul>
</template>

<style scoped>
@reference "@/styles/main.css";

.painel-nav-item {
  @apply flex items-center gap-2;
}
</style>

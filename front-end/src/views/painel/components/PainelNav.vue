<script setup lang="ts">
import { RouterLink } from 'vue-router'

import ComingSoon from '@/views/painel/components/ComingSoon.vue'
</script>

<template>
  <ul class="menu w-full">
    <li>
      <RouterLink :to="{ name: 'painel-animais' }">Meus pets</RouterLink>
    </li>
    <li>
      <ComingSoon>
        <span>Pedidos de adoção</span>
      </ComingSoon>
    </li>
    <li>
      <ComingSoon>
        <span>Perfil da ONG</span>
      </ComingSoon>
    </li>
  </ul>
</template>

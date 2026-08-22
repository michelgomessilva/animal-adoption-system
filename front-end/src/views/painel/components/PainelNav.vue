<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <ul class="menu w-full">
    <li>
      <RouterLink :to="{ name: 'painel-animais' }">Animais</RouterLink>
    </li>
  </ul>
</template>

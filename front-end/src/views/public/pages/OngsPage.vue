<script setup lang="ts">
import { RouterLink } from 'vue-router'

import PageContainer from '@/views/public/components/PageContainer.vue'
</script>

<template>
  <PageContainer>
    <article class="ongs-page">
      <h1>A ONG por trás do POA</h1>
      <p>
        O POA é o catálogo de uma única organização de proteção animal. Não somos uma vitrine de
        várias ONGs: os animais que você vê aqui vêm do mesmo abrigo, com as mesmas regras de adoção
        e o mesmo canal de contato.
      </p>
      <p>
        Se você quer conhecer um pet, comece pelo catálogo. Se você já é da equipe da ONG, entre no
        painel para manter os cadastros em dia.
      </p>
      <div class="ongs-page-actions">
        <RouterLink :to="{ name: 'home' }" class="btn">Ver animais</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="btn btn-ghost">Entrar no painel</RouterLink>
      </div>
    </article>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.ongs-page {
  @apply flex max-w-3xl flex-col gap-4;
}

.ongs-page h1 {
  @apply text-3xl font-bold;
}

.ongs-page-actions {
  @apply flex flex-wrap gap-2;
}
</style>

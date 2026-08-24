<script setup lang="ts">
import { RouterLink } from 'vue-router'

import PageContainer from '@/views/public/components/PageContainer.vue'
</script>

<template>
  <PageContainer>
    <article class="organization-page">
      <p class="organization-page-kicker">A organização</p>
      <h1>A ONG por trás do POA</h1>
      <p>
        O POA é o catálogo de uma única organização de proteção animal. Não somos uma vitrine de
        várias ONGs: os animais que você vê aqui vêm do mesmo abrigo, com as mesmas regras de adoção
        e o mesmo canal de contato.
      </p>
      <p>
        A conta administrativa é provisionada pela equipe — não há auto-cadastro de ONGs. Se você já
        recebeu as credenciais, entre no painel para manter os cadastros em dia.
      </p>
      <div class="organization-page-actions">
        <RouterLink :to="{ name: 'home' }" class="btn">Ver animais</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="btn btn-primary">Área da ONG</RouterLink>
      </div>
    </article>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.organization-page {
  @apply flex max-w-3xl flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8;
}

.organization-page-kicker {
  @apply text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.organization-page h1 {
  @apply font-serif text-4xl font-bold tracking-tight;
}

.organization-page-actions {
  @apply mt-2 flex flex-wrap gap-2;
}
</style>

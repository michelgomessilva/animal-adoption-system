<script setup lang="ts">
import { RouterLink } from 'vue-router'

import PageContainer from '@/views/public/components/PageContainer.vue'
</script>

<template>
  <PageContainer>
    <article class="register-ong">
      <h1>Cadastro de ONG</h1>
      <p>
        O POA atende uma única organização. A conta administrativa já existe e é provisionada pela
        equipe — não há auto-cadastro de ONGs nesta versão.
      </p>
      <p>Se você já recebeu as credenciais, entre no painel para gerenciar os animais.</p>
      <RouterLink :to="{ name: 'login' }" class="btn btn-primary">Ir para o login</RouterLink>
    </article>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.register-ong {
  @apply flex max-w-3xl flex-col gap-4;
}

.register-ong h1 {
  @apply text-3xl font-bold;
}
</style>

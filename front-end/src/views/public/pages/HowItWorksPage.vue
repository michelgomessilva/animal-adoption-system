<script setup lang="ts">
import { RouterLink } from 'vue-router'

import PageContainer from '@/views/public/components/PageContainer.vue'
</script>

<template>
  <PageContainer>
    <article class="how-it-works">
      <h1>Como funciona</h1>
      <ol class="how-it-works-steps">
        <li>
          <h2>1. Encontre um animal</h2>
          <p>
            O catálogo mostra apenas pets disponíveis para adoção, com foto e informações básicas.
          </p>
        </li>
        <li>
          <h2>2. Conheça o perfil</h2>
          <p>
            Veja espécie, porte, idade e cidade para avaliar se aquele animal combina com a sua
            casa.
          </p>
        </li>
        <li>
          <h2>3. Fale com a ONG</h2>
          <p>
            O interesse é tratado fora da plataforma, no canal da própria ONG. O POA não cadastra
            adotantes nem guarda pedidos de adoção.
          </p>
        </li>
      </ol>
      <RouterLink :to="{ name: 'home' }" class="btn">Ver o catálogo</RouterLink>
    </article>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.how-it-works {
  @apply flex max-w-3xl flex-col gap-6;
}

.how-it-works h1 {
  @apply text-3xl font-bold;
}

.how-it-works-steps {
  @apply flex list-none flex-col gap-4 p-0;
}

.how-it-works-steps h2 {
  @apply text-xl font-semibold;
}
</style>

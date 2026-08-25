<script setup lang="ts">
import { RouterLink } from 'vue-router'

import PageContainer from '@/views/public/components/PageContainer.vue'
</script>

<template>
  <PageContainer>
    <article class="how-it-works">
      <p class="how-it-works-kicker">O caminho</p>
      <h1>Como funciona</h1>
      <ol class="how-it-works-steps">
        <li>
          <h2>1. Encontre um animal</h2>
          <p>
            O catálogo mostra apenas pets disponíveis para adoção, com informações básicas e foto
            quando a ONG cadastrou uma URL.
          </p>
        </li>
        <li>
          <h2>2. Conheça o perfil</h2>
          <p>
            Abra o card no catálogo para ler a história do pet, a ficha (espécie, sexo, porte e
            idade), a localização e quando o perfil foi publicado.
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
      <RouterLink :to="{ name: 'home' }" class="btn btn-primary">Ver o catálogo</RouterLink>
    </article>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.how-it-works {
  @apply flex max-w-3xl flex-col gap-6;
}

.how-it-works-kicker {
  @apply text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.how-it-works h1 {
  @apply font-serif text-4xl font-bold tracking-tight;
}

.how-it-works-steps {
  @apply flex list-none flex-col gap-4 p-0;
}

.how-it-works-steps li {
  @apply rounded-box border border-base-300 bg-base-100 p-5 shadow-sm;
}

.how-it-works-steps h2 {
  @apply mb-1 font-serif text-xl font-semibold;
}
</style>

<script setup lang="ts">
import AppIcon from '@/shared/components/AppIcon.vue'
import { useAnimalsList } from '@/shared/composables/useAnimalsList'
import AnimalCard from '@/views/public/components/AnimalCard.vue'
import PageContainer from '@/views/public/components/PageContainer.vue'

const { animals, isLoading, hasError, reload } = useAnimalsList()
</script>

<template>
  <PageContainer>
    <section class="home-page">
      <header class="home-page-intro">
        <p class="home-page-kicker">Adoção em Porto Alegre</p>
        <h1>Encontre o próximo membro da casa</h1>
        <p class="home-page-lead">
          O catálogo da ONG mostra pets disponíveis agora. Cada perfil traz espécie, porte, idade e
          cidade — a foto aparece quando a equipe cadastra uma URL.
        </p>
      </header>

      <p v-if="isLoading" role="status" class="home-page-status">Carregando animais disponíveis…</p>
      <div v-else-if="hasError" role="alert" class="alert alert-error">
        <span>Não foi possível carregar o catálogo. Tente novamente mais tarde.</span>
        <button type="button" class="btn btn-sm" @click="reload">
          <AppIcon name="refresh-cw" />
          Tentar novamente
        </button>
      </div>
      <p v-else-if="animals.length === 0" class="home-page-status">
        Nenhum animal disponível no momento.
      </p>
      <ul v-else class="home-page-grid">
        <li v-for="animal in animals" :key="animal.id">
          <AnimalCard :animal="animal" />
        </li>
      </ul>
    </section>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.home-page {
  @apply flex flex-col gap-8;
}

.home-page-intro {
  @apply max-w-2xl;
}

.home-page-kicker {
  @apply mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.home-page-intro h1 {
  @apply font-serif text-4xl font-bold tracking-tight sm:text-5xl;
}

.home-page-lead {
  @apply mt-3 text-base-content/75;
}

.home-page-status {
  @apply text-base-content/70;
}

.home-page-grid {
  @apply grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3;
}
</style>

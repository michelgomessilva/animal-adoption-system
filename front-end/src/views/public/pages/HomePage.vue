<script setup lang="ts">
import { useAnimalsList } from '@/shared/composables/useAnimalsList'
import AnimalCard from '@/views/public/components/AnimalCard.vue'
import PageContainer from '@/views/public/components/PageContainer.vue'

const { animals, isLoading, hasError } = useAnimalsList()
</script>

<template>
  <PageContainer>
    <section class="home-page">
      <header class="home-page-header">
        <h1>Adote um animal</h1>
        <p>Conheça os pets disponíveis para adoção em Porto Alegre.</p>
      </header>

      <p v-if="isLoading" role="status">Carregando animais disponíveis…</p>
      <p v-else-if="hasError" role="alert">
        Não foi possível carregar o catálogo. Tente novamente mais tarde.
      </p>
      <p v-else-if="animals.length === 0">Nenhum animal disponível no momento.</p>
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
  @apply flex flex-col gap-6;
}

.home-page-header h1 {
  @apply text-3xl font-bold;
}

.home-page-grid {
  @apply grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3;
}
</style>

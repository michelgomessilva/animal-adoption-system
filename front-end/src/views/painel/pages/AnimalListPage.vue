<script setup lang="ts">
import { useAnimalsList } from '@/shared/composables/useAnimalsList'
import {
  animalSexLabel,
  animalSizeLabel,
  animalSpeciesLabel,
  animalStatusLabel,
} from '@/shared/types/animal-labels'

const { animals, isLoading, hasError } = useAnimalsList()
</script>

<template>
  <section class="animal-list">
    <h1>Animais</h1>
    <p v-if="isLoading" role="status">Carregando cadastros…</p>
    <p v-else-if="hasError" role="alert">Não foi possível carregar os animais.</p>
    <p v-else-if="animals.length === 0">Nenhum animal cadastrado.</p>
    <div v-else class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Sexo</th>
            <th>Porte</th>
            <th>Status</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animal in animals" :key="animal.id">
            <td>{{ animal.name }}</td>
            <td>{{ animalSpeciesLabel[animal.species] }}</td>
            <td>{{ animalSexLabel[animal.sex] }}</td>
            <td>{{ animalSizeLabel[animal.size] }}</td>
            <td>{{ animalStatusLabel[animal.status] }}</td>
            <td>{{ animal.city }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-list {
  @apply flex flex-col gap-4;
}

.animal-list h1 {
  @apply text-3xl font-bold;
}
</style>

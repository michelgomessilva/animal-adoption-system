<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import AnimalImage from '@/shared/components/AnimalImage.vue'
import AppIcon from '@/shared/components/AppIcon.vue'
import { useAnimalsList } from '@/shared/composables/useAnimalsList'
import {
  animalSexLabel,
  animalSizeLabel,
  animalSpeciesLabel,
  animalStatusLabel,
} from '@/shared/types/animal-labels'
import {
  animalSexBadgeClass,
  animalSizeBadgeClass,
  animalSpeciesBadgeClass,
} from '@/shared/types/animal-visual'
import { useAnimalListFilters } from '@/shared/composables/useAnimalListFilters'
import AnimalListFilters from '@/views/panel/components/AnimalListFilters.vue'

const { filters, hasNarrowingFilters, setFilter, clearFilters } = useAnimalListFilters()
const { animals, isLoading, hasError, reload } = useAnimalsList(() => filters.value)

const countLabel = computed(() => {
  const count = animals.value.length
  if (count === 1) {
    return '1 cadastro'
  }

  return `${count} cadastros`
})
</script>

<template>
  <section class="animal-list">
    <header class="animal-list-header">
      <div>
        <p class="animal-list-kicker">Catálogo interno</p>
        <h1>Meus pets</h1>
        <p v-if="!isLoading && !hasError" class="animal-list-count">{{ countLabel }}</p>
      </div>
      <RouterLink :to="{ name: 'panel-animals-new' }" class="btn btn-primary">
        <AppIcon name="plus" />
        Cadastrar pet
      </RouterLink>
    </header>

    <AnimalListFilters :filters="filters" @set-filter="setFilter" @clear="clearFilters" />

    <p v-if="isLoading" role="status">Carregando cadastros…</p>
    <div v-else-if="hasError" role="alert" class="alert alert-error">
      <span>Não foi possível carregar os animais.</span>
      <button type="button" class="btn btn-sm" @click="reload">
        <AppIcon name="refresh-cw" />
        Tentar novamente
      </button>
    </div>
    <p v-else-if="animals.length === 0 && hasNarrowingFilters">
      Nenhum animal encontrado com esses filtros.
    </p>
    <p v-else-if="animals.length === 0">Nenhum animal cadastrado.</p>
    <div v-else class="animal-list-table">
      <table class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Sexo</th>
            <th>Porte</th>
            <th>Situação</th>
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="animal in animals" :key="animal.id">
            <td>
              <div class="animal-list-name">
                <AnimalImage
                  :src="animal.image"
                  :name="animal.name"
                  :species="animal.species"
                  compact
                />
                <span>{{ animal.name }}</span>
              </div>
            </td>
            <td>
              <span class="badge" :class="animalSpeciesBadgeClass(animal.species)">
                {{ animalSpeciesLabel[animal.species] }}
              </span>
            </td>
            <td>
              <span class="badge" :class="animalSexBadgeClass(animal.sex)">
                {{ animalSexLabel[animal.sex] }}
              </span>
            </td>
            <td>
              <span class="badge" :class="animalSizeBadgeClass(animal.size)">
                {{ animalSizeLabel[animal.size] }}
              </span>
            </td>
            <td>
              <span
                class="badge"
                :class="animal.status === 'Available' ? 'badge-success' : 'badge-neutral'"
              >
                {{ animalStatusLabel[animal.status] }}
              </span>
            </td>
            <td>{{ animal.city }}</td>
            <td>
              <RouterLink
                :to="{ name: 'panel-animals-edit', params: { id: animal.id } }"
                class="btn btn-ghost btn-sm"
              >
                <AppIcon name="pencil" />
                Editar
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-list {
  @apply flex flex-col gap-5;
}

.animal-list-header {
  @apply flex flex-wrap items-end justify-between gap-4;
}

.animal-list-kicker {
  @apply mb-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.animal-list-header h1 {
  @apply font-serif text-4xl font-bold tracking-tight;
}

.animal-list-count {
  @apply mt-1 text-sm text-base-content/65;
}

.animal-list-table {
  @apply overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm;
}

.animal-list-name {
  @apply flex items-center gap-3 font-semibold;
}
</style>

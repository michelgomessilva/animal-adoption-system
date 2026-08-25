<script setup lang="ts">
import { computed } from 'vue'

import {
  ANIMAL_SEX_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  ANIMAL_SPECIES_OPTIONS,
  animalListQueryIsEmpty,
  type AnimalListQuery,
  type AnimalSex,
  type AnimalSize,
  type AnimalSpecies,
} from '@/shared/types/animal'
import { animalSexLabel, animalSizeLabel, animalSpeciesLabel } from '@/shared/types/animal-labels'

type CatalogFilterKey = 'species' | 'sex' | 'size'
type CatalogFilterValue = AnimalSpecies | AnimalSex | AnimalSize

const props = defineProps<{
  filters: AnimalListQuery
}>()

const emit = defineEmits<{
  setFilter: [key: CatalogFilterKey, value: CatalogFilterValue | undefined]
  clear: []
}>()

const hasClearableFilters = computed(() => !animalListQueryIsEmpty(props.filters))

function toggle(key: CatalogFilterKey, value: CatalogFilterValue): void {
  emit('setFilter', key, props.filters[key] === value ? undefined : value)
}
</script>

<template>
  <div class="animal-catalog-filters" role="group" aria-label="Filtros do catálogo">
    <div class="animal-catalog-filters-header">
      <h2 class="animal-catalog-filters-title">Filtros</h2>
      <button
        v-if="hasClearableFilters"
        type="button"
        class="btn btn-ghost btn-sm"
        @click="emit('clear')"
      >
        Limpar
      </button>
    </div>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Espécie</legend>
      <div class="join">
        <button
          v-for="species in ANIMAL_SPECIES_OPTIONS"
          :key="species"
          type="button"
          class="btn join-item btn-sm"
          :class="{ 'btn-active': filters.species === species }"
          :aria-pressed="filters.species === species"
          @click="toggle('species', species)"
        >
          {{ animalSpeciesLabel[species] }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Sexo</legend>
      <div class="join">
        <button
          v-for="sex in ANIMAL_SEX_OPTIONS"
          :key="sex"
          type="button"
          class="btn join-item btn-sm"
          :class="{ 'btn-active': filters.sex === sex }"
          :aria-pressed="filters.sex === sex"
          @click="toggle('sex', sex)"
        >
          {{ animalSexLabel[sex] }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Porte</legend>
      <div class="join">
        <button
          v-for="size in ANIMAL_SIZE_OPTIONS"
          :key="size"
          type="button"
          class="btn join-item btn-sm"
          :class="{ 'btn-active': filters.size === size }"
          :aria-pressed="filters.size === size"
          @click="toggle('size', size)"
        >
          {{ animalSizeLabel[size] }}
        </button>
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-catalog-filters {
  @apply flex flex-col gap-4;
}

.animal-catalog-filters-header {
  @apply flex items-center justify-between gap-2;
}

.animal-catalog-filters-title {
  @apply font-serif text-lg font-semibold;
}

.animal-catalog-filters .fieldset {
  @apply gap-2;
}

.animal-catalog-filters .join {
  @apply flex-wrap;
}
</style>

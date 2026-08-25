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

function optionClass(active: boolean): string {
  return active ? 'btn-secondary' : 'btn-soft'
}
</script>

<template>
  <div class="animal-catalog-filters" role="group" aria-label="Filtros do catálogo">
    <div class="animal-catalog-filters-header">
      <h2 class="animal-catalog-filters-title">Filtros</h2>
      <button
        v-if="hasClearableFilters"
        type="button"
        class="btn btn-ghost btn-xs animal-catalog-filters-clear"
        @click="emit('clear')"
      >
        Limpar
      </button>
    </div>

    <fieldset class="fieldset animal-catalog-filters-group">
      <legend class="fieldset-legend">Espécie</legend>
      <div class="animal-catalog-filters-options">
        <button
          v-for="species in ANIMAL_SPECIES_OPTIONS"
          :key="species"
          type="button"
          class="btn btn-sm"
          :class="optionClass(filters.species === species)"
          :aria-pressed="filters.species === species"
          @click="toggle('species', species)"
        >
          {{ animalSpeciesLabel[species] }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset animal-catalog-filters-group">
      <legend class="fieldset-legend">Sexo</legend>
      <div class="animal-catalog-filters-options">
        <button
          v-for="sex in ANIMAL_SEX_OPTIONS"
          :key="sex"
          type="button"
          class="btn btn-sm"
          :class="optionClass(filters.sex === sex)"
          :aria-pressed="filters.sex === sex"
          @click="toggle('sex', sex)"
        >
          {{ animalSexLabel[sex] }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset animal-catalog-filters-group">
      <legend class="fieldset-legend">Porte</legend>
      <div class="animal-catalog-filters-options">
        <button
          v-for="size in ANIMAL_SIZE_OPTIONS"
          :key="size"
          type="button"
          class="btn btn-sm"
          :class="optionClass(filters.size === size)"
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
  @apply flex flex-col gap-5;
}

.animal-catalog-filters-header {
  @apply flex items-baseline justify-between gap-3;
}

.animal-catalog-filters-title {
  @apply font-serif text-lg font-semibold tracking-tight text-base-content;
}

.animal-catalog-filters-clear {
  @apply font-medium text-base-content/55;
}

.animal-catalog-filters-group {
  @apply gap-2.5 p-0;
}

.animal-catalog-filters-group .fieldset-legend {
  @apply mb-0 px-0 text-[0.7rem] font-semibold tracking-[0.14em] text-base-content/55 uppercase;
}

.animal-catalog-filters-options {
  @apply flex flex-wrap gap-2;
}

.animal-catalog-filters-options .btn {
  @apply min-h-9 rounded-full px-4 font-medium transition-[transform,box-shadow,background-color,color] duration-200;
}

.animal-catalog-filters-options .btn:hover {
  @apply -translate-y-px;
}

.animal-catalog-filters-options .btn[aria-pressed='true'] {
  @apply shadow-sm;
}
</style>

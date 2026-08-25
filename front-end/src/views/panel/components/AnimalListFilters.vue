<script setup lang="ts">
import { computed } from 'vue'

import {
  ANIMAL_ORDER_BY_OPTIONS,
  ANIMAL_SEX_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  ANIMAL_SPECIES_OPTIONS,
  ANIMAL_STATUS_OPTIONS,
  animalListQueryIsEmpty,
  isAnimalOrderBy,
  isAnimalSex,
  isAnimalSize,
  isAnimalSpecies,
  isAnimalStatus,
  type AnimalListQuery,
} from '@/shared/types/animal'
import {
  animalOrderByLabel,
  animalSexLabel,
  animalSizeLabel,
  animalSpeciesLabel,
  animalStatusLabel,
} from '@/shared/types/animal-labels'

const props = defineProps<{
  filters: AnimalListQuery
}>()

const emit = defineEmits<{
  setFilter: [key: keyof AnimalListQuery, value: AnimalListQuery[keyof AnimalListQuery] | undefined]
  clear: []
}>()

const hasClearableFilters = computed(() => !animalListQueryIsEmpty(props.filters))

function onFilterChange(key: keyof AnimalListQuery, event: Event): void {
  const raw = (event.target as HTMLSelectElement).value
  if (raw === '') {
    emit('setFilter', key, undefined)
    return
  }

  switch (key) {
    case 'species':
      if (isAnimalSpecies(raw)) {
        emit('setFilter', 'species', raw)
      }
      break
    case 'sex':
      if (isAnimalSex(raw)) {
        emit('setFilter', 'sex', raw)
      }
      break
    case 'size':
      if (isAnimalSize(raw)) {
        emit('setFilter', 'size', raw)
      }
      break
    case 'status':
      if (isAnimalStatus(raw)) {
        emit('setFilter', 'status', raw)
      }
      break
    case 'orderBy':
      if (isAnimalOrderBy(raw)) {
        emit('setFilter', 'orderBy', raw)
      }
      break
  }
}
</script>

<template>
  <div class="animal-list-filters" role="group" aria-label="Filtros da listagem">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Espécie</legend>
      <select
        class="select"
        name="species"
        :value="filters.species ?? ''"
        @change="onFilterChange('species', $event)"
      >
        <option value="">Todas</option>
        <option v-for="species in ANIMAL_SPECIES_OPTIONS" :key="species" :value="species">
          {{ animalSpeciesLabel[species] }}
        </option>
      </select>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Sexo</legend>
      <select
        class="select"
        name="sex"
        :value="filters.sex ?? ''"
        @change="onFilterChange('sex', $event)"
      >
        <option value="">Todos</option>
        <option v-for="sex in ANIMAL_SEX_OPTIONS" :key="sex" :value="sex">
          {{ animalSexLabel[sex] }}
        </option>
      </select>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Porte</legend>
      <select
        class="select"
        name="size"
        :value="filters.size ?? ''"
        @change="onFilterChange('size', $event)"
      >
        <option value="">Todos</option>
        <option v-for="size in ANIMAL_SIZE_OPTIONS" :key="size" :value="size">
          {{ animalSizeLabel[size] }}
        </option>
      </select>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Situação</legend>
      <select
        class="select"
        name="status"
        :value="filters.status ?? ''"
        @change="onFilterChange('status', $event)"
      >
        <option value="">Todas</option>
        <option v-for="status in ANIMAL_STATUS_OPTIONS" :key="status" :value="status">
          {{ animalStatusLabel[status] }}
        </option>
      </select>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Ordenar por</legend>
      <select
        class="select"
        name="orderBy"
        :value="filters.orderBy ?? ''"
        @change="onFilterChange('orderBy', $event)"
      >
        <option value="">Padrão</option>
        <option v-for="orderBy in ANIMAL_ORDER_BY_OPTIONS" :key="orderBy" :value="orderBy">
          {{ animalOrderByLabel[orderBy] }}
        </option>
      </select>
    </fieldset>

    <button
      v-if="hasClearableFilters"
      type="button"
      class="btn btn-sm animal-list-filters-clear"
      @click="emit('clear')"
    >
      Limpar filtros
    </button>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-list-filters {
  @apply flex flex-wrap items-end gap-3;
}

.animal-list-filters .fieldset {
  @apply min-w-36;
}

.animal-list-filters-clear {
  @apply mb-1;
}
</style>

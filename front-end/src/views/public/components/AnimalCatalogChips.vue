<script setup lang="ts">
import { computed } from 'vue'

import type { AnimalListQuery } from '@/shared/types/animal'
import { animalSexLabel, animalSizeLabel, animalSpeciesLabel } from '@/shared/types/animal-labels'

type CatalogChipKey = 'species' | 'sex' | 'size'

interface CatalogChip {
  key: CatalogChipKey
  label: string
}

const props = defineProps<{
  filters: AnimalListQuery
}>()

const emit = defineEmits<{
  removeFilter: [key: CatalogChipKey]
}>()

const chips = computed((): CatalogChip[] => {
  const result: CatalogChip[] = []

  if (props.filters.species !== undefined) {
    result.push({ key: 'species', label: animalSpeciesLabel[props.filters.species] })
  }

  if (props.filters.sex !== undefined) {
    result.push({ key: 'sex', label: animalSexLabel[props.filters.sex] })
  }

  if (props.filters.size !== undefined) {
    result.push({ key: 'size', label: animalSizeLabel[props.filters.size] })
  }

  return result
})
</script>

<template>
  <ul v-if="chips.length > 0" class="animal-catalog-chips" aria-label="Filtros aplicados">
    <li v-for="chip in chips" :key="chip.key">
      <button
        type="button"
        class="badge badge-outline animal-catalog-chip"
        :aria-label="`Remover filtro ${chip.label}`"
        @click="emit('removeFilter', chip.key)"
      >
        {{ chip.label }}
        <span aria-hidden="true">×</span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-catalog-chips {
  @apply flex list-none flex-wrap gap-2 p-0;
}

.animal-catalog-chip {
  @apply h-auto cursor-pointer gap-1 px-3 py-1;
}
</style>

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  animalListHasNarrowingFilters,
  parseAnimalListQuery,
  toAnimalListSearchParams,
  type AnimalListQuery,
} from '@/shared/types/animal'

export function useAnimalListFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed(() => parseAnimalListQuery(route.query))

  const hasNarrowingFilters = computed(() => animalListHasNarrowingFilters(filters.value))

  function setFilter<K extends keyof AnimalListQuery>(
    key: K,
    value: AnimalListQuery[K] | undefined,
  ): void {
    const next: AnimalListQuery = { ...filters.value }
    if (value === undefined) {
      delete next[key]
    } else {
      next[key] = value
    }

    void router.replace({ query: toAnimalListSearchParams(next) })
  }

  function clearFilters(): void {
    void router.replace({ query: {} })
  }

  return { filters, hasNarrowingFilters, setFilter, clearFilters }
}

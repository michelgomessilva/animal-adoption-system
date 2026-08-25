import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  animalListQueryIsEmpty,
  parseAnimalListQuery,
  toAnimalListSearchParams,
  type AnimalListQuery,
} from '@/shared/types/animal'

export function useAnimalListFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed(() => parseAnimalListQuery(route.query))

  const hasActiveFilters = computed(() => !animalListQueryIsEmpty(filters.value))

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

  return { filters, hasActiveFilters, setFilter, clearFilters }
}

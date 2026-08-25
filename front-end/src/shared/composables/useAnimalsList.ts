import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

import { listAnimals } from '@/shared/api/animals'
import type { Animal, AnimalListQuery } from '@/shared/types/animal'

export function useAnimalsList(query?: MaybeRefOrGetter<AnimalListQuery>) {
  const animals = ref<Animal[]>([])
  const isLoading = ref(true)
  const hasError = ref(false)

  let loadGeneration = 0

  async function reload(): Promise<void> {
    const generation = ++loadGeneration
    const currentQuery = toValue(query) ?? {}

    isLoading.value = true
    hasError.value = false

    try {
      const result = await listAnimals(currentQuery)
      if (generation !== loadGeneration) {
        return
      }
      animals.value = result
    } catch {
      if (generation !== loadGeneration) {
        return
      }
      animals.value = []
      hasError.value = true
    } finally {
      if (generation === loadGeneration) {
        isLoading.value = false
      }
    }
  }

  watch(
    () => toValue(query) ?? {},
    () => {
      void reload()
    },
    { immediate: true, deep: true },
  )

  return { animals, isLoading, hasError, reload }
}

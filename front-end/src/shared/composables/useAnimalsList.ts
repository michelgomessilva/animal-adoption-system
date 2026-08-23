import { onMounted, ref } from 'vue'

import { isApiError } from '@/shared/api/api-error'
import { listAnimals } from '@/shared/api/animals'
import type { Animal } from '@/shared/types/animal'

export function useAnimalsList() {
  const animals = ref<Animal[]>([])
  const isLoading = ref(true)
  const hasError = ref(false)

  async function loadAnimals(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      animals.value = await listAnimals()
    } catch (error: unknown) {
      hasError.value = true
      if (!isApiError(error)) {
        throw error
      }
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void loadAnimals()
  })

  return { animals, isLoading, hasError }
}

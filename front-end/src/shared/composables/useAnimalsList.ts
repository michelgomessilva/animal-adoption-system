import { onMounted, ref } from 'vue'

import { listAnimals } from '@/shared/api/animals'
import type { Animal } from '@/shared/types/animal'

export function useAnimalsList() {
  const animals = ref<Animal[]>([])
  const isLoading = ref(true)
  const hasError = ref(false)

  async function reload(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      animals.value = await listAnimals()
    } catch {
      animals.value = []
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void reload()
  })

  return { animals, isLoading, hasError, reload }
}

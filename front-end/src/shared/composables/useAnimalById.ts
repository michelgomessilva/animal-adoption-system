import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

import { isApiError } from '@/shared/api/api-error'
import { getAnimalById } from '@/shared/api/animals'
import { isAnimalId, type Animal } from '@/shared/types/animal'

export function useAnimalById(id: MaybeRefOrGetter<string>): {
  animal: Ref<Animal | null>
  isLoading: Ref<boolean>
  isNotFound: Ref<boolean>
  hasError: Ref<boolean>
  reload: () => Promise<void>
} {
  const animal = ref<Animal | null>(null)
  const isLoading = ref(true)
  const isNotFound = ref(false)
  const hasError = ref(false)

  let loadGeneration = 0

  async function reload(): Promise<void> {
    const generation = ++loadGeneration
    const currentId = toValue(id)

    isLoading.value = true
    isNotFound.value = false
    hasError.value = false
    animal.value = null

    if (!isAnimalId(currentId)) {
      isNotFound.value = true
      isLoading.value = false
      return
    }

    try {
      const result = await getAnimalById(currentId)
      if (generation !== loadGeneration) {
        return
      }
      animal.value = result
    } catch (error: unknown) {
      if (generation !== loadGeneration) {
        return
      }

      if (isApiError(error)) {
        if (error.code === 'unauthorized') {
          return
        }

        if (error.code === 'not-found') {
          isNotFound.value = true
          return
        }
      }

      hasError.value = true
    } finally {
      if (generation === loadGeneration) {
        isLoading.value = false
      }
    }
  }

  watch(
    () => toValue(id),
    () => {
      void reload()
    },
    { immediate: true },
  )

  return { animal, isLoading, isNotFound, hasError, reload }
}

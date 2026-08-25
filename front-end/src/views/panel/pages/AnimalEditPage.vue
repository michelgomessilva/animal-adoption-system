<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { isApiError, type ApiErrorCode } from '@/shared/api/api-error'
import { updateAnimal } from '@/shared/api/animals'
import AppIcon from '@/shared/components/AppIcon.vue'
import { useAnimalById } from '@/shared/composables/useAnimalById'
import { toAnimalWriteInput, type AnimalWriteInput } from '@/shared/types/animal'
import { ANIMAL_WRITE_COMMON_ERRORS } from '@/views/panel/animal-form-errors'
import AnimalFormWizard from '@/views/panel/components/AnimalFormWizard.vue'

const UPDATE_ERROR_MESSAGE: Partial<Record<ApiErrorCode, string>> = {
  ...ANIMAL_WRITE_COMMON_ERRORS,
  unknown: 'Não foi possível salvar o animal. Tente novamente.',
}

const LOAD_FAILURE_MESSAGE = 'Não foi possível carregar o cadastro. Tente novamente.'

const route = useRoute()
const router = useRouter()

const isSubmitting = ref(false)
const formError = ref<string | null>(null)
const submitNotFound = ref(false)

const animalId = computed(() => {
  const raw = route.params.id
  return typeof raw === 'string' ? raw : ''
})

const { animal, isLoading, isNotFound, hasError, reload } = useAnimalById(animalId)

const initialDraft = computed(() =>
  animal.value === null ? null : toAnimalWriteInput(animal.value),
)

const showNotFound = computed(() => isNotFound.value || submitNotFound.value)

watch(animalId, () => {
  submitNotFound.value = false
  formError.value = null
})

async function onSubmit(payload: AnimalWriteInput): Promise<void> {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  formError.value = null

  try {
    await updateAnimal(animalId.value, payload)
    await router.replace({ name: 'panel-animals' })
  } catch (error: unknown) {
    if (!isApiError(error)) {
      throw error
    }

    if (error.code === 'unauthorized') {
      return
    }

    if (error.code === 'not-found') {
      submitNotFound.value = true
      return
    }

    const message = UPDATE_ERROR_MESSAGE[error.code]
    if (message === undefined) {
      throw error
    }

    formError.value = message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="animal-edit">
    <header class="animal-edit-header">
      <p class="animal-edit-kicker">Editar cadastro</p>
      <h1>Editar pet</h1>
    </header>

    <p v-if="isLoading" role="status">Carregando cadastro…</p>

    <div v-else-if="showNotFound" role="alert" class="alert alert-error">
      <span>Não encontramos esse cadastro.</span>
      <RouterLink :to="{ name: 'panel-animals' }" class="btn btn-sm"
        >Voltar para Meus pets</RouterLink
      >
    </div>

    <div v-else-if="hasError" role="alert" class="alert alert-error">
      <span>{{ LOAD_FAILURE_MESSAGE }}</span>
      <button type="button" class="btn btn-sm" @click="reload">
        <AppIcon name="refresh-cw" />
        Tentar novamente
      </button>
    </div>

    <template v-else-if="initialDraft !== null">
      <AnimalFormWizard
        :initial-draft="initialDraft"
        submit-label="Salvar"
        :is-submitting="isSubmitting"
        @submit="onSubmit"
      />

      <div v-if="formError !== null" role="alert" class="alert alert-error">
        {{ formError }}
      </div>
    </template>
  </section>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-edit {
  @apply flex flex-col gap-6;
}

.animal-edit-kicker {
  @apply mb-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.animal-edit-header h1 {
  @apply font-serif text-4xl font-bold tracking-tight;
}
</style>

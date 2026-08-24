<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { isApiError, type ApiErrorCode } from '@/shared/api/api-error'
import { createAnimal, type CreateAnimalInput } from '@/shared/api/animals'
import AnimalCreateWizard from '@/views/panel/components/AnimalCreateWizard.vue'

const CREATE_ERROR_MESSAGE: Partial<Record<ApiErrorCode, string>> = {
  validation: 'Revise os dados do cadastro.',
  network: 'Não foi possível conectar. Tente novamente.',
  unknown: 'Não foi possível cadastrar o animal. Tente novamente.',
}

const router = useRouter()
const isSubmitting = ref(false)
const formError = ref<string | null>(null)

async function onSubmit(payload: CreateAnimalInput): Promise<void> {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  formError.value = null

  try {
    await createAnimal(payload)
    await router.replace({ name: 'panel-animals' })
  } catch (error: unknown) {
    if (!isApiError(error)) {
      throw error
    }

    if (error.code === 'unauthorized') {
      return
    }

    const message = CREATE_ERROR_MESSAGE[error.code]
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
  <section class="animal-create">
    <header class="animal-create-header">
      <p class="animal-create-kicker">Novo cadastro</p>
      <h1>Cadastro do pet</h1>
      <p class="animal-create-lead">
        Três etapas: dados básicos, descrição com foto por URL e localização.
      </p>
    </header>

    <AnimalCreateWizard @submit="onSubmit" />

    <div v-if="formError !== null" role="alert" class="alert alert-error">
      {{ formError }}
    </div>
  </section>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-create {
  @apply flex flex-col gap-6;
}

.animal-create-kicker {
  @apply mb-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.animal-create-header h1 {
  @apply font-serif text-4xl font-bold tracking-tight;
}

.animal-create-lead {
  @apply mt-2 max-w-2xl text-base-content/70;
}
</style>

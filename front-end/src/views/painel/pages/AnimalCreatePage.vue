<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { isApiError } from '@/shared/api/api-error'
import { createAnimal, type CreateAnimalInput } from '@/shared/api/animals'
import ComingSoon from '@/views/painel/components/ComingSoon.vue'
import AnimalCreateWizard from '@/views/painel/components/AnimalCreateWizard.vue'

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
    await router.replace({ name: 'painel-animais' })
  } catch (error: unknown) {
    if (!isApiError(error)) {
      throw error
    }

    if (error.code === 'unauthorized') {
      return
    }

    formError.value =
      error.code === 'validation'
        ? error.message
        : error.code === 'network'
          ? 'Não foi possível conectar. Tente novamente.'
          : 'Não foi possível cadastrar o animal. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="animal-create">
    <header class="animal-create-header">
      <h1>Cadastro do pet</h1>
      <ComingSoon>
        <p>Rascunho salvo automaticamente</p>
      </ComingSoon>
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

.animal-create-header {
  @apply flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between;
}

.animal-create-header h1 {
  @apply text-3xl font-bold;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'

import type { CreateAnimalInput } from '@/shared/api/animals'
import AnimalImage from '@/shared/components/AnimalImage.vue'
import { ANIMAL_DESCRIPTION_MAX } from '@/views/painel/composables/useAnimalCreateWizard'

const model = defineModel<CreateAnimalInput>({ required: true })

const hasImageUrl = computed(() => model.value.image.trim().length > 0)
</script>

<template>
  <div class="description-step">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Descrição</legend>
      <textarea
        v-model="model.description"
        class="textarea w-full"
        name="description"
        :maxlength="ANIMAL_DESCRIPTION_MAX"
        required
      />
      <p class="description-step-hint">Até {{ ANIMAL_DESCRIPTION_MAX }} caracteres.</p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Foto por URL (opcional)</legend>
      <input
        v-model="model.image"
        class="input w-full"
        type="url"
        name="image"
        placeholder="https://"
      />
      <p class="description-step-hint">Sem upload. Deixe em branco se ainda não houver foto.</p>
    </fieldset>

    <div v-if="hasImageUrl" class="description-step-preview">
      <p class="description-step-hint">Pré-visualização</p>
      <AnimalImage
        :src="model.image"
        :name="model.name || 'pet'"
        :species="model.species"
        class="description-step-media"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.description-step {
  @apply flex flex-col gap-4;
}

.description-step-hint {
  @apply mt-1 text-xs text-base-content/60;
}

.description-step-media {
  @apply mt-2 aspect-4/3 w-full max-w-sm rounded-box border border-base-300;
}
</style>

<script setup lang="ts">
import type { CreateAnimalInput } from '@/shared/api/animals'
import ComingSoon from '@/views/painel/components/ComingSoon.vue'

const model = defineModel<CreateAnimalInput>({ required: true })
</script>

<template>
  <div class="description-step">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Descrição</legend>
      <textarea
        v-model="model.description"
        class="textarea w-full"
        name="description"
        maxlength="200"
        required
      />
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">URL da foto</legend>
      <input
        v-model="model.image"
        class="input w-full"
        type="url"
        name="image"
        placeholder="https://"
      />
    </fieldset>

    <ComingSoon>
      <div class="description-step-gallery">
        <p>Imagens (etapa 3, pré-visualização)</p>
        <button type="button" class="btn">Adicionar</button>
      </div>
    </ComingSoon>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.description-step {
  @apply flex flex-col gap-4;
}

.description-step-gallery {
  @apply flex flex-col gap-2;
}
</style>

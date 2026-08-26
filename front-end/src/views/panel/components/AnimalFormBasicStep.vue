<script setup lang="ts">
import {
  ANIMAL_SEX_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  ANIMAL_SPECIES_OPTIONS,
  type AnimalWriteInput,
} from '@/shared/types/animal'
import { animalSexLabel, animalSizeLabel, animalSpeciesLabel } from '@/shared/types/animal-labels'
import { ANIMAL_AGE_MAX, ANIMAL_NAME_MAX } from '@/views/panel/composables/useAnimalFormWizard'

const model = defineModel<AnimalWriteInput>({ required: true })
</script>

<template>
  <div class="basic-step">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Nome do pet</legend>
      <input
        v-model="model.name"
        class="input w-full"
        type="text"
        name="name"
        :maxlength="ANIMAL_NAME_MAX"
        placeholder="Como o pet é chamado"
        required
      />
      <p class="basic-step-hint">Até {{ ANIMAL_NAME_MAX }} caracteres.</p>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Espécie</legend>
      <div class="join">
        <button
          v-for="species in ANIMAL_SPECIES_OPTIONS"
          :key="species"
          type="button"
          class="btn join-item"
          :class="{ 'btn-active': model.species === species }"
          @click="model.species = species"
        >
          {{ animalSpeciesLabel(species) }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Porte</legend>
      <div class="join">
        <button
          v-for="size in ANIMAL_SIZE_OPTIONS"
          :key="size"
          type="button"
          class="btn join-item"
          :class="{ 'btn-active': model.size === size }"
          @click="model.size = size"
        >
          {{ animalSizeLabel(size) }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Sexo</legend>
      <div class="join">
        <button
          v-for="sex in ANIMAL_SEX_OPTIONS"
          :key="sex"
          type="button"
          class="btn join-item"
          :class="{ 'btn-active': model.sex === sex }"
          @click="model.sex = sex"
        >
          {{ animalSexLabel(sex) }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Idade aproximada (anos)</legend>
      <input
        v-model.number="model.approximateAge"
        class="input"
        type="number"
        name="approximateAge"
        min="0"
        :max="ANIMAL_AGE_MAX"
        required
      />
      <p class="basic-step-hint">De 0 a {{ ANIMAL_AGE_MAX }} anos.</p>
    </fieldset>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.basic-step {
  @apply flex flex-col gap-4;
}

.basic-step-hint {
  @apply mt-1 text-xs text-base-content/60;
}
</style>

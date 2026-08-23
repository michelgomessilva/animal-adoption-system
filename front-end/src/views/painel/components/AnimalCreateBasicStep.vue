<script setup lang="ts">
import type { CreateAnimalInput } from '@/shared/api/animals'
import type { AnimalSex, AnimalSize, AnimalSpecies } from '@/shared/types/animal'
import { animalSexLabel, animalSizeLabel, animalSpeciesLabel } from '@/shared/types/animal-labels'
import ComingSoon from '@/views/painel/components/ComingSoon.vue'

const model = defineModel<CreateAnimalInput>({ required: true })

const speciesOptions: AnimalSpecies[] = ['Dog', 'Cat']
const sizeOptions: AnimalSize[] = ['Small', 'Medium', 'Large']
const sexOptions: AnimalSex[] = ['Male', 'Female']
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
        maxlength="20"
        placeholder="Como o pet é chamado"
        required
      />
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Espécie</legend>
      <div class="basic-step-choices">
        <div class="join">
          <button
            v-for="species in speciesOptions"
            :key="species"
            type="button"
            class="btn join-item"
            :class="{ 'btn-active': model.species === species }"
            @click="model.species = species"
          >
            {{ animalSpeciesLabel[species] }}
          </button>
        </div>
        <ComingSoon>
          <button type="button" class="btn">Outra</button>
        </ComingSoon>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Porte</legend>
      <div class="join">
        <button
          v-for="size in sizeOptions"
          :key="size"
          type="button"
          class="btn join-item"
          :class="{ 'btn-active': model.size === size }"
          @click="model.size = size"
        >
          {{ animalSizeLabel[size] }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Sexo</legend>
      <div class="join">
        <button
          v-for="sex in sexOptions"
          :key="sex"
          type="button"
          class="btn join-item"
          :class="{ 'btn-active': model.sex === sex }"
          @click="model.sex = sex"
        >
          {{ animalSexLabel[sex] }}
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Idade</legend>
      <div class="basic-step-age">
        <input
          v-model.number="model.approximateAge"
          class="input"
          type="number"
          name="approximateAge"
          min="0"
          max="30"
          required
        />
        <ComingSoon>
          <span>Anos</span>
        </ComingSoon>
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.basic-step {
  @apply flex flex-col gap-4;
}

.basic-step-choices,
.basic-step-age {
  @apply flex flex-wrap items-center gap-3;
}
</style>

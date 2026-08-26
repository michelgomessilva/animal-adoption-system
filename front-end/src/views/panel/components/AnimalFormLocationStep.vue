<script setup lang="ts">
import { ANIMAL_STATUS_OPTIONS, type AnimalWriteInput } from '@/shared/types/animal'
import {
  animalSexLabel,
  animalSizeLabel,
  animalSpeciesLabel,
  animalStatusLabel,
} from '@/shared/types/animal-labels'
import {
  ANIMAL_LOCATION_MAX,
  ANIMAL_PARISH_MAX,
} from '@/views/panel/composables/useAnimalFormWizard'

const model = defineModel<AnimalWriteInput>({ required: true })
</script>

<template>
  <div class="location-step">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Bairro</legend>
      <input
        v-model="model.district"
        class="input w-full"
        type="text"
        name="district"
        :maxlength="ANIMAL_LOCATION_MAX"
        required
      />
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Freguesia</legend>
      <input
        v-model="model.parish"
        class="input w-full"
        type="text"
        name="parish"
        :maxlength="ANIMAL_PARISH_MAX"
        required
      />
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Cidade</legend>
      <input
        v-model="model.city"
        class="input w-full"
        type="text"
        name="city"
        :maxlength="ANIMAL_LOCATION_MAX"
        required
      />
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Situação</legend>
      <div class="join">
        <button
          v-for="status in ANIMAL_STATUS_OPTIONS"
          :key="status"
          type="button"
          class="btn join-item"
          :class="{ 'btn-active': model.status === status }"
          @click="model.status = status"
        >
          {{ animalStatusLabel(status) }}
        </button>
      </div>
    </fieldset>

    <section class="location-step-review" aria-labelledby="review-title">
      <h2 id="review-title">Revisão</h2>
      <dl>
        <div>
          <dt>Nome</dt>
          <dd>{{ model.name }}</dd>
        </div>
        <div>
          <dt>Espécie</dt>
          <dd>{{ animalSpeciesLabel(model.species) }}</dd>
        </div>
        <div>
          <dt>Porte</dt>
          <dd>{{ animalSizeLabel(model.size) }}</dd>
        </div>
        <div>
          <dt>Sexo</dt>
          <dd>{{ animalSexLabel(model.sex) }}</dd>
        </div>
        <div>
          <dt>Idade</dt>
          <dd>{{ model.approximateAge }}</dd>
        </div>
        <div>
          <dt>Descrição</dt>
          <dd>{{ model.description }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.location-step {
  @apply flex flex-col gap-4;
}

.location-step-review {
  @apply flex flex-col gap-3 rounded-box bg-base-200 p-4;
}

.location-step-review h2 {
  @apply font-serif text-lg font-bold;
}

.location-step-review dl {
  @apply grid grid-cols-1 gap-3 sm:grid-cols-2;
}

.location-step-review div {
  @apply flex flex-col;
}

.location-step-review dt {
  @apply text-xs opacity-70;
}
</style>

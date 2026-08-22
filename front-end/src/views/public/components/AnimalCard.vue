<script setup lang="ts">
import { computed } from 'vue'

import type { Animal } from '@/shared/types/animal'
import { animalSizeLabel, animalSpeciesLabel } from '@/shared/types/animal-labels'

interface Props {
  animal: Animal
}

const props = defineProps<Props>()

const speciesText = computed(() => animalSpeciesLabel[props.animal.species])
const sizeText = computed(() => animalSizeLabel[props.animal.size])
</script>

<template>
  <article class="card bg-base-100 shadow-sm">
    <figure>
      <img :src="animal.image" :alt="`Foto de ${animal.name}`" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">{{ animal.name }}</h2>
      <p>{{ speciesText }} · {{ sizeText }} · {{ animal.approximateAge }} anos</p>
      <p>{{ animal.city }}</p>
    </div>
  </article>
</template>

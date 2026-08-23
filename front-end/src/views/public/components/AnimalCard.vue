<script setup lang="ts">
import { computed } from 'vue'

import AnimalImage from '@/shared/components/AnimalImage.vue'
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
  <article class="animal-card">
    <AnimalImage
      :src="animal.image"
      :name="animal.name"
      :species="animal.species"
      class="animal-card-media"
    />
    <div class="card-body">
      <h2 class="card-title font-serif">{{ animal.name }}</h2>
      <p>{{ speciesText }} · {{ sizeText }} · {{ animal.approximateAge }} anos</p>
      <p class="text-base-content/70">{{ animal.city }}</p>
    </div>
  </article>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-card {
  @apply card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm;
}

.animal-card-media {
  @apply aspect-4/3 w-full;
}
</style>

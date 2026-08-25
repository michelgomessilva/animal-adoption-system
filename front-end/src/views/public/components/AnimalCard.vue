<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import AnimalImage from '@/shared/components/AnimalImage.vue'
import type { Animal } from '@/shared/types/animal'
import {
  animalAgeLabel,
  animalLocationLabel,
  animalSizeLabel,
  animalSpeciesLabel,
} from '@/shared/types/animal-labels'

interface Props {
  animal: Animal
}

const props = defineProps<Props>()

const metaText = computed(
  () =>
    `${animalSpeciesLabel[props.animal.species]} · ${animalSizeLabel[props.animal.size]} · ${animalAgeLabel(props.animal.approximateAge)}`,
)
const locationText = computed(() => animalLocationLabel(props.animal.district, props.animal.city))
</script>

<template>
  <RouterLink :to="{ name: 'animal-details', params: { id: animal.id } }" class="animal-card">
    <AnimalImage
      :src="animal.image"
      :name="animal.name"
      :species="animal.species"
      class="animal-card-media"
    />
    <div class="animal-card-body">
      <h2 class="animal-card-title">{{ animal.name }}</h2>
      <p class="animal-card-meta">{{ metaText }}</p>
      <p class="animal-card-location">{{ locationText }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-card {
  @apply flex h-full flex-col overflow-hidden rounded-box border border-base-300/80 bg-base-100 shadow-sm transition-[transform,box-shadow,border-color] duration-200;
}

.animal-card:hover {
  @apply -translate-y-1 border-base-300 shadow-md;
}

.animal-card-media {
  @apply aspect-4/3 w-full overflow-hidden;
}

.animal-card:hover :deep(.animal-image-photo) {
  @apply scale-105;
}

.animal-card :deep(.animal-image-photo) {
  @apply transition-transform duration-300;
}

.animal-card-body {
  @apply flex flex-1 flex-col gap-1 px-4 pt-3.5 pb-4;
}

.animal-card-title {
  @apply font-serif text-lg leading-snug font-semibold tracking-tight text-base-content;
}

.animal-card-meta {
  @apply text-sm leading-relaxed text-base-content/65;
}

.animal-card-location {
  @apply mt-0.5 text-sm text-base-content/45;
}
</style>

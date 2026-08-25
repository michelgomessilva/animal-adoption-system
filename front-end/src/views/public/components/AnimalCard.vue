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
const metaText = computed(
  () => `${speciesText.value} · ${sizeText.value} · ${props.animal.approximateAge} anos`,
)
</script>

<template>
  <article class="animal-card">
    <AnimalImage
      :src="animal.image"
      :name="animal.name"
      :species="animal.species"
      class="animal-card-media"
    />
    <div class="animal-card-body">
      <h2 class="animal-card-title">{{ animal.name }}</h2>
      <p class="animal-card-meta">{{ metaText }}</p>
      <p class="animal-card-location">{{ animal.city }}</p>
    </div>
  </article>
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
  @apply aspect-4/3 w-full;
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

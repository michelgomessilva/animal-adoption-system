<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppIcon from '@/shared/components/AppIcon.vue'
import { animalSpeciesIcon, animalSpeciesImageClass } from '@/shared/types/animal-visual'

interface Props {
  src: string
  name: string
  species: unknown
  compact?: boolean
  priority?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  priority: false,
})

const hasLoadError = ref(false)

const trimmedSrc = computed(() => props.src.trim())
const canShowImage = computed(() => trimmedSrc.value.length > 0 && !hasLoadError.value)
const speciesIcon = computed(() => animalSpeciesIcon(props.species))
const speciesToneClass = computed(() => animalSpeciesImageClass(props.species))
const loadingMode = computed(() => (props.priority ? 'eager' : 'lazy'))

watch(trimmedSrc, () => {
  hasLoadError.value = false
})

function onImageError(): void {
  hasLoadError.value = true
}
</script>

<template>
  <div class="animal-image" :class="[speciesToneClass, { 'animal-image--compact': compact }]">
    <img
      v-if="canShowImage"
      class="animal-image-photo"
      :src="trimmedSrc"
      :alt="`Foto de ${name}`"
      :loading="loadingMode"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
      @error="onImageError"
    />
    <div v-else class="animal-image-fallback" aria-hidden="true">
      <AppIcon :name="speciesIcon" :size="compact ? 'md' : 'lg'" />
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-image {
  @apply relative isolate overflow-hidden;
}

.animal-image--dog {
  @apply bg-secondary/22 text-secondary;
}

.animal-image--cat {
  @apply bg-info/22 text-info;
}

.animal-image--unknown {
  @apply bg-base-200 text-base-content/50;
}

.animal-image--compact {
  @apply size-12 shrink-0 rounded-field;
}

.animal-image-photo {
  @apply size-full object-cover;
}

.animal-image-fallback {
  @apply flex size-full items-center justify-center;
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppIcon from '@/shared/components/AppIcon.vue'
import type { AnimalSpecies } from '@/shared/types/animal'

interface Props {
  src: string
  name: string
  species: AnimalSpecies
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const hasLoadError = ref(false)

const trimmedSrc = computed(() => props.src.trim())
const canShowImage = computed(() => trimmedSrc.value.length > 0 && !hasLoadError.value)
const speciesIcon = computed(() => (props.species === 'Cat' ? 'cat' : 'dog'))

watch(trimmedSrc, () => {
  hasLoadError.value = false
})

function onImageError(): void {
  hasLoadError.value = true
}
</script>

<template>
  <div class="animal-image" :class="{ 'animal-image--compact': compact }">
    <img
      v-if="canShowImage"
      class="animal-image-photo"
      :src="trimmedSrc"
      :alt="`Foto de ${name}`"
      loading="lazy"
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
  @apply relative isolate overflow-hidden bg-secondary/12;
}

.animal-image--compact {
  @apply size-12 shrink-0 rounded-field;
}

.animal-image-photo {
  @apply size-full object-cover;
}

.animal-image-fallback {
  @apply flex size-full items-center justify-center text-secondary;
}
</style>

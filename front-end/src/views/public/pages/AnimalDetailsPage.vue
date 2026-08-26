<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppIcon from '@/shared/components/AppIcon.vue'
import AnimalImage from '@/shared/components/AnimalImage.vue'
import { useAnimalById } from '@/shared/composables/useAnimalById'
import { canonicalAnimalStatus } from '@/shared/types/animal'
import {
  animalAgeLabel,
  animalLocationLabel,
  animalNameLabel,
  animalSexLabel,
  animalSizeLabel,
  animalSpeciesLabel,
  animalStatusLabel,
  formatAnimalPublishedAt,
} from '@/shared/types/animal-labels'
import PageContainer from '@/views/public/components/PageContainer.vue'

const route = useRoute()

const animalId = computed(() => {
  const raw = route.params.id
  return typeof raw === 'string' ? raw : ''
})

const { animal, isLoading, isNotFound, hasError, reload } = useAnimalById(animalId)

const aboutText = computed(() => animal.value?.description.trim() ?? '')
const displayName = computed(() =>
  animal.value === null ? '' : animalNameLabel(animal.value.name),
)
const metaText = computed(() => {
  if (animal.value === null) {
    return ''
  }

  const parts = [
    animalLocationLabel(animal.value.district, animal.value.city),
    formatAnimalPublishedAt(animal.value.createdAt),
  ].filter((part) => part.length > 0)

  return parts.join(' · ')
})
const isAdopted = computed(
  () => animal.value !== null && canonicalAnimalStatus(animal.value.status) === 'Adopted',
)
const statusText = computed(() =>
  animal.value === null ? '' : animalStatusLabel(animal.value.status),
)
</script>

<template>
  <PageContainer>
    <section class="animal-details">
      <div v-if="isLoading" class="animal-details-spread" role="status">
        <span class="sr-only">Carregando perfil…</span>
        <div class="animal-details-portrait">
          <div class="skeleton animal-details-portrait-skeleton" />
        </div>
        <div class="animal-details-dossier">
          <div class="skeleton h-4 w-28" />
          <div class="skeleton mt-4 h-12 w-3/4" />
          <div class="skeleton mt-3 h-4 w-1/2" />
          <div class="animal-details-sheet animal-details-sheet--skeleton mt-8">
            <div v-for="index in 4" :key="index" class="animal-details-sheet-cell">
              <div class="skeleton h-3 w-16" />
              <div class="skeleton mt-2 h-6 w-20" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="isNotFound" class="animal-details-empty">
        <h1>Não encontramos esse pet.</h1>
        <p>O perfil pode ter sido removido ou o endereço está incompleto.</p>
        <RouterLink :to="{ name: 'home' }" class="btn">Voltar ao catálogo</RouterLink>
      </div>

      <div v-else-if="hasError" role="alert" class="alert alert-error">
        <span>Não foi possível carregar o perfil. Tente novamente.</span>
        <button type="button" class="btn btn-sm" @click="reload">
          <AppIcon name="refresh-cw" />
          Tentar novamente
        </button>
      </div>

      <article
        v-else-if="animal !== null"
        class="animal-details-spread"
        :class="{ 'animal-details--adopted': isAdopted }"
      >
        <div class="animal-details-portrait animal-details-reveal" style="--reveal-index: 0">
          <AnimalImage
            :src="animal.image"
            :name="displayName"
            :species="animal.species"
            priority
            class="animal-details-photo"
          />
        </div>

        <div class="animal-details-dossier">
          <header class="animal-details-header animal-details-reveal" style="--reveal-index: 1">
            <p
              class="animal-details-kicker"
              :class="isAdopted ? 'animal-details-kicker--adopted' : undefined"
            >
              {{ statusText }}
            </p>
            <h1>{{ displayName }}</h1>
            <p
              v-if="metaText.length > 0"
              class="animal-details-meta animal-details-reveal"
              style="--reveal-index: 2"
            >
              {{ metaText }}
            </p>
          </header>

          <dl class="animal-details-sheet animal-details-reveal" style="--reveal-index: 3">
            <div class="animal-details-sheet-cell">
              <dt>Espécie</dt>
              <dd>{{ animalSpeciesLabel(animal.species) }}</dd>
            </div>
            <div class="animal-details-sheet-cell">
              <dt>Sexo</dt>
              <dd>{{ animalSexLabel(animal.sex) }}</dd>
            </div>
            <div class="animal-details-sheet-cell">
              <dt>Porte</dt>
              <dd>{{ animalSizeLabel(animal.size) }}</dd>
            </div>
            <div class="animal-details-sheet-cell">
              <dt>Idade</dt>
              <dd>{{ animalAgeLabel(animal.approximateAge) }}</dd>
            </div>
          </dl>

          <section
            v-if="aboutText.length > 0"
            class="animal-details-about animal-details-reveal"
            style="--reveal-index: 4"
          >
            <h2>Sobre</h2>
            <p>{{ aboutText }}</p>
          </section>
        </div>
      </article>
    </section>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.animal-details {
  @apply py-2 lg:py-6;
}

.animal-details-spread {
  @apply flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(17rem,24rem)_minmax(0,1fr)] lg:items-start lg:gap-12;
}

.animal-details-portrait {
  @apply w-full;
}

.animal-details-portrait-skeleton {
  @apply aspect-4/5 w-full max-h-[70dvh] rounded-box;
}

.animal-details-photo {
  @apply aspect-4/5 w-full max-h-[70dvh] rounded-box shadow-md;
}

.animal-details--adopted .animal-details-photo {
  @apply saturate-75;
}

.animal-details-dossier {
  @apply flex min-w-0 flex-col gap-8 lg:sticky lg:top-28;
}

.animal-details-header {
  @apply flex flex-col gap-3;
}

.animal-details-kicker {
  @apply text-[0.7rem] font-semibold tracking-[0.2em] text-primary uppercase;
}

.animal-details-kicker--adopted {
  @apply text-base-content/50;
}

.animal-details-header h1 {
  @apply font-serif text-5xl leading-[1.05] font-bold tracking-tight text-base-content lg:text-6xl;
}

.animal-details-meta {
  @apply text-sm text-base-content/55 sm:text-base;
}

.animal-details-sheet {
  @apply grid grid-cols-2 border-y border-base-300/80 sm:grid-cols-4;
}

.animal-details-sheet--skeleton {
  @apply divide-x divide-base-300/80;
}

.animal-details-sheet-cell {
  @apply px-3 py-4 first:pl-0 sm:px-4;
}

.animal-details-sheet-cell + .animal-details-sheet-cell {
  @apply border-l border-base-300/80;
}

.animal-details-sheet-cell:nth-child(3),
.animal-details-sheet-cell:nth-child(4) {
  @apply border-t border-base-300/80 sm:border-t-0;
}

.animal-details-sheet dt {
  @apply text-[0.7rem] font-semibold tracking-[0.14em] text-base-content/55 uppercase;
}

.animal-details-sheet dd {
  @apply mt-1.5 font-serif text-xl font-semibold tracking-tight text-base-content;
}

.animal-details-about {
  @apply flex max-w-prose flex-col gap-3;
}

.animal-details-about h2 {
  @apply text-[0.7rem] font-semibold tracking-[0.2em] text-base-content/55 uppercase;
}

.animal-details-about p {
  @apply text-lg leading-[1.7] text-base-content/80;
}

.animal-details-empty {
  @apply flex max-w-lg flex-col items-start gap-4 py-16;
}

.animal-details-empty h1 {
  @apply font-serif text-4xl font-bold tracking-tight;
}

.animal-details-empty p {
  @apply text-base text-base-content/65;
}

.animal-details-reveal {
  animation: animal-details-reveal 480ms ease-out both;
  animation-delay: calc(min(var(--reveal-index, 0), 6) * 70ms);
}

@keyframes animal-details-reveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

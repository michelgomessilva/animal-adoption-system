<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/shared/components/AppIcon.vue'
import { useAnimalListFilters } from '@/shared/composables/useAnimalListFilters'
import { useAnimalsList } from '@/shared/composables/useAnimalsList'
import { ANIMAL_ORDER_BY_OPTIONS, isAnimalOrderBy } from '@/shared/types/animal'
import { animalOrderByLabel } from '@/shared/types/animal-labels'
import AnimalCard from '@/views/public/components/AnimalCard.vue'
import AnimalCatalogChips from '@/views/public/components/AnimalCatalogChips.vue'
import AnimalCatalogFilters from '@/views/public/components/AnimalCatalogFilters.vue'
import PageContainer from '@/views/public/components/PageContainer.vue'

const { filters, hasNarrowingFilters, setFilter, clearFilters } = useAnimalListFilters()
const { animals, isLoading, hasError, reload } = useAnimalsList(() => filters.value)

const countLabel = computed(() => {
  const count = animals.value.length
  if (count === 1) {
    return '1 animal'
  }

  return `${count} animais`
})

function onOrderByChange(event: Event): void {
  const raw = (event.target as HTMLSelectElement).value
  if (raw === '') {
    setFilter('orderBy', undefined)
    return
  }

  if (isAnimalOrderBy(raw)) {
    setFilter('orderBy', raw)
  }
}
</script>

<template>
  <PageContainer>
    <section class="home-page">
      <header class="home-page-intro">
        <p class="home-page-kicker">Adoção responsável</p>
        <h1 class="home-page-title">Seu próximo companheiro está aqui</h1>
        <p class="home-page-lead">
          Conheça quem espera por um lar e dê o primeiro passo na adoção.
        </p>
      </header>

      <div class="home-page-body">
        <aside class="home-page-sidebar">
          <AnimalCatalogFilters :filters="filters" @set-filter="setFilter" @clear="clearFilters" />
        </aside>

        <div class="home-page-main">
          <div class="home-page-toolbar">
            <p v-if="!isLoading && !hasError" class="home-page-count">{{ countLabel }}</p>
            <p v-else class="home-page-count home-page-count--placeholder" aria-hidden="true">
              &nbsp;
            </p>
            <fieldset class="fieldset home-page-sort">
              <legend class="fieldset-legend">Ordenar</legend>
              <select
                class="select select-sm home-page-sort-select"
                name="orderBy"
                :value="filters.orderBy ?? ''"
                @change="onOrderByChange"
              >
                <option value="">Padrão</option>
                <option v-for="orderBy in ANIMAL_ORDER_BY_OPTIONS" :key="orderBy" :value="orderBy">
                  {{ animalOrderByLabel[orderBy] }}
                </option>
              </select>
            </fieldset>
          </div>

          <AnimalCatalogChips
            :filters="filters"
            @remove-filter="(key) => setFilter(key, undefined)"
          />

          <p v-if="isLoading" role="status" class="home-page-status">Carregando animais…</p>
          <div v-else-if="hasError" role="alert" class="alert alert-error">
            <span>Não foi possível carregar a lista. Tente novamente.</span>
            <button type="button" class="btn btn-sm" @click="reload">
              <AppIcon name="refresh-cw" />
              Tentar novamente
            </button>
          </div>
          <p v-else-if="animals.length === 0 && hasNarrowingFilters" class="home-page-status">
            Nenhum pet por aqui — ajuste a busca e continue.
          </p>
          <p v-else-if="animals.length === 0" class="home-page-status">
            Em breve novos pets. Volte para conhecer quem chega.
          </p>
          <ul v-else class="home-page-grid">
            <li
              v-for="(animal, index) in animals"
              :key="animal.id"
              :style="{ '--reveal-index': index }"
            >
              <AnimalCard :animal="animal" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  </PageContainer>
</template>

<style scoped>
@reference "@/styles/main.css";

.home-page {
  @apply flex flex-col gap-10;
}

.home-page-intro {
  @apply max-w-2xl;
}

.home-page-kicker {
  @apply mb-2.5 text-[0.7rem] font-semibold tracking-[0.2em] text-primary uppercase;
}

.home-page-title {
  @apply font-serif text-4xl leading-[1.12] font-bold tracking-tight text-base-content sm:text-5xl;
}

.home-page-lead {
  @apply mt-3.5 max-w-xl text-base leading-relaxed text-base-content/70;
}

.home-page-body {
  @apply flex flex-col gap-8 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-8;
}

.home-page-sidebar {
  @apply rounded-box border border-base-300/70 bg-base-100 p-5 shadow-sm lg:sticky lg:top-24;
}

.home-page-main {
  @apply flex min-w-0 flex-col gap-5;
}

.home-page-toolbar {
  @apply flex flex-wrap items-end justify-between gap-x-4 gap-y-3;
}

.home-page-count {
  @apply pb-2 text-sm font-medium text-base-content/55;
}

.home-page-count--placeholder {
  @apply invisible;
}

.home-page-sort {
  @apply min-w-48 gap-1.5 p-0;
}

.home-page-sort .fieldset-legend {
  @apply mb-0 px-0 text-[0.7rem] font-semibold tracking-[0.14em] text-base-content/55 uppercase;
}

.home-page-sort-select {
  @apply w-full min-w-48 rounded-field border-base-300 bg-base-100;
}

.home-page-status {
  @apply py-8 text-base text-base-content/60;
}

.home-page-grid {
  @apply grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3;
}

.home-page-grid > li {
  animation: home-card-reveal 420ms ease-out both;
  animation-delay: calc(min(var(--reveal-index, 0), 8) * 45ms);
}

@keyframes home-card-reveal {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

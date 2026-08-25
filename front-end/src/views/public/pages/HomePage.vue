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
    return '1 resultado'
  }

  return `${count} resultados`
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
        <p class="home-page-kicker">Adoção em Porto Alegre</p>
        <h1>Encontre o próximo membro da casa</h1>
        <p class="home-page-lead">
          O catálogo da ONG mostra pets disponíveis agora. Cada perfil traz espécie, porte, idade e
          cidade — a foto aparece quando a equipe cadastra uma URL.
        </p>
      </header>

      <div class="home-page-body">
        <aside class="home-page-sidebar">
          <AnimalCatalogFilters :filters="filters" @set-filter="setFilter" @clear="clearFilters" />
        </aside>

        <div class="home-page-main">
          <div class="home-page-toolbar">
            <p v-if="!isLoading && !hasError" class="home-page-count">{{ countLabel }}</p>
            <fieldset class="fieldset home-page-sort">
              <legend class="fieldset-legend">Ordenar</legend>
              <select
                class="select"
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

          <p v-if="isLoading" role="status" class="home-page-status">
            Carregando animais disponíveis…
          </p>
          <div v-else-if="hasError" role="alert" class="alert alert-error">
            <span>Não foi possível carregar o catálogo. Tente novamente mais tarde.</span>
            <button type="button" class="btn btn-sm" @click="reload">
              <AppIcon name="refresh-cw" />
              Tentar novamente
            </button>
          </div>
          <p v-else-if="animals.length === 0 && hasNarrowingFilters" class="home-page-status">
            Nenhum animal encontrado com esses filtros.
          </p>
          <p v-else-if="animals.length === 0" class="home-page-status">
            Nenhum animal disponível no momento.
          </p>
          <ul v-else class="home-page-grid">
            <li v-for="animal in animals" :key="animal.id">
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
  @apply flex flex-col gap-8;
}

.home-page-intro {
  @apply max-w-2xl;
}

.home-page-kicker {
  @apply mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.home-page-intro h1 {
  @apply font-serif text-4xl font-bold tracking-tight sm:text-5xl;
}

.home-page-lead {
  @apply mt-3 text-base-content/75;
}

.home-page-body {
  @apply flex flex-col gap-8 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start;
}

.home-page-sidebar {
  @apply rounded-box border border-base-300 bg-base-100 p-4;
}

.home-page-main {
  @apply flex min-w-0 flex-col gap-4;
}

.home-page-toolbar {
  @apply flex flex-wrap items-end justify-between gap-3;
}

.home-page-count {
  @apply text-sm text-base-content/70;
}

.home-page-sort {
  @apply min-w-44;
}

.home-page-status {
  @apply text-base-content/70;
}

.home-page-grid {
  @apply grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3;
}
</style>

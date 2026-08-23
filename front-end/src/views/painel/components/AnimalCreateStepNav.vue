<script setup lang="ts">
import ComingSoon from '@/views/painel/components/ComingSoon.vue'
import type { WizardStep } from '@/views/painel/composables/useAnimalCreateWizard'

interface StepItem {
  id: WizardStep
  title: string
  subtitle: string
  isComingSoon?: boolean
}

const props = defineProps<{
  currentStep: WizardStep
  visitedSteps: WizardStep[]
}>()

const emit = defineEmits<{
  select: [step: WizardStep]
}>()

const steps: StepItem[] = [
  { id: 1, title: 'Dados básicos', subtitle: 'Nome, espécie, porte, idade' },
  { id: 2, title: 'Saúde', subtitle: 'Vacinas, histórico de doenças', isComingSoon: true },
  { id: 3, title: 'Imagens e descrição', subtitle: 'Descrição e URL da foto' },
  { id: 4, title: 'Localização e revisão', subtitle: 'Estado, cidade, status' },
]

function isSelectable(step: StepItem): boolean {
  if (step.isComingSoon) {
    return false
  }

  return step.id === props.currentStep || props.visitedSteps.includes(step.id)
}

function onSelect(step: StepItem): void {
  if (!isSelectable(step)) {
    return
  }

  emit('select', step.id)
}
</script>

<template>
  <nav class="step-nav" aria-label="Etapas">
    <p class="step-nav-heading">Etapas</p>
    <ol class="step-nav-list">
      <li v-for="step in steps" :key="step.id">
        <ComingSoon v-if="step.isComingSoon">
          <div class="step-nav-item">
            <span class="step-nav-title">{{ step.title }}</span>
            <span class="step-nav-subtitle">{{ step.subtitle }}</span>
          </div>
        </ComingSoon>
        <button
          v-else
          type="button"
          class="step-nav-item"
          :class="{ 'step-nav-item--current': currentStep === step.id }"
          :disabled="!isSelectable(step)"
          @click="onSelect(step)"
        >
          <span class="step-nav-title">{{ step.title }}</span>
          <span class="step-nav-subtitle">{{ step.subtitle }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
@reference "@/styles/main.css";

.step-nav-heading {
  @apply mb-3 text-xs font-semibold tracking-wide uppercase;
}

.step-nav-list {
  @apply flex list-none flex-col gap-3 p-0;
}

.step-nav-item {
  @apply flex w-full flex-col items-start gap-0.5 text-left;
}

.step-nav-item--current .step-nav-title {
  @apply font-bold;
}

.step-nav-title {
  @apply text-sm;
}

.step-nav-subtitle {
  @apply text-xs opacity-70;
}
</style>

<script setup lang="ts">
import {
  WIZARD_STEP_META,
  WIZARD_STEPS,
  type WizardStep,
} from '@/views/panel/composables/useAnimalFormWizard'

const props = defineProps<{
  currentStep: WizardStep
  visitedSteps: WizardStep[]
}>()

const emit = defineEmits<{
  select: [step: WizardStep]
}>()

function isVisited(step: WizardStep): boolean {
  return props.visitedSteps.includes(step)
}

function onSelect(step: WizardStep): void {
  if (!isVisited(step)) {
    return
  }

  emit('select', step)
}
</script>

<template>
  <nav class="step-nav" aria-label="Etapas">
    <p class="step-nav-heading">Etapas</p>
    <ol class="step-nav-list">
      <li v-for="(step, index) in WIZARD_STEPS" :key="step">
        <button
          type="button"
          class="step-nav-item"
          :class="{ 'step-nav-item--current': currentStep === step }"
          :disabled="!isVisited(step)"
          @click="onSelect(step)"
        >
          <span class="step-nav-index">{{ index + 1 }}</span>
          <span>
            <span class="step-nav-title">{{ WIZARD_STEP_META[step].title }}</span>
            <span class="step-nav-subtitle">{{ WIZARD_STEP_META[step].subtitle }}</span>
          </span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
@reference "@/styles/main.css";

.step-nav {
  @apply rounded-box border border-base-300 bg-base-100 p-5 shadow-sm;
}

.step-nav-heading {
  @apply mb-3 text-xs font-semibold tracking-[0.18em] text-primary uppercase;
}

.step-nav-list {
  @apply flex list-none flex-col gap-3 p-0;
}

.step-nav-item {
  @apply flex w-full items-start gap-3 text-left;
}

.step-nav-item--current .step-nav-title {
  @apply font-bold;
}

.step-nav-item--current .step-nav-index {
  @apply bg-primary text-primary-content;
}

.step-nav-index {
  @apply mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-base-200 text-xs font-semibold;
}

.step-nav-title {
  @apply block text-sm;
}

.step-nav-subtitle {
  @apply block text-xs opacity-70;
}
</style>

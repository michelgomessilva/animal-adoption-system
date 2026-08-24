<script setup lang="ts">
import type { CreateAnimalInput } from '@/shared/api/animals'
import AnimalCreateBasicStep from '@/views/panel/components/AnimalCreateBasicStep.vue'
import AnimalCreateDescriptionStep from '@/views/panel/components/AnimalCreateDescriptionStep.vue'
import AnimalCreateFooter from '@/views/panel/components/AnimalCreateFooter.vue'
import AnimalCreateLocationStep from '@/views/panel/components/AnimalCreateLocationStep.vue'
import AnimalCreateStepNav from '@/views/panel/components/AnimalCreateStepNav.vue'
import { useAnimalCreateWizard } from '@/views/panel/composables/useAnimalCreateWizard'

const emit = defineEmits<{
  submit: [payload: CreateAnimalInput]
}>()

const {
  draft,
  currentStep,
  visitedSteps,
  canGoNext,
  isFirstStep,
  isLastStep,
  goNext,
  goBack,
  selectStep,
  toPayload,
} = useAnimalCreateWizard()

function onNext(): void {
  if (isLastStep.value) {
    emit('submit', toPayload())
    return
  }

  goNext()
}
</script>

<template>
  <div class="create-wizard">
    <AnimalCreateStepNav
      :current-step="currentStep"
      :visited-steps="visitedSteps"
      @select="selectStep"
    />
    <div class="create-wizard-body">
      <AnimalCreateBasicStep v-if="currentStep === 'basic'" v-model="draft" />
      <AnimalCreateDescriptionStep v-else-if="currentStep === 'description'" v-model="draft" />
      <AnimalCreateLocationStep v-else-if="currentStep === 'location'" v-model="draft" />
      <AnimalCreateFooter
        :is-first-step="isFirstStep"
        :is-last-step="isLastStep"
        :can-continue="canGoNext"
        @back="goBack"
        @next="onNext"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.create-wizard {
  @apply grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)];
}

.create-wizard-body {
  @apply flex flex-col rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7;
}
</style>

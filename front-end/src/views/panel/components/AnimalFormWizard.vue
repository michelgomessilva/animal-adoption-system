<script setup lang="ts">
import type { AnimalWriteInput } from '@/shared/types/animal'
import AnimalFormBasicStep from '@/views/panel/components/AnimalFormBasicStep.vue'
import AnimalFormDescriptionStep from '@/views/panel/components/AnimalFormDescriptionStep.vue'
import AnimalFormFooter from '@/views/panel/components/AnimalFormFooter.vue'
import AnimalFormLocationStep from '@/views/panel/components/AnimalFormLocationStep.vue'
import AnimalFormStepNav from '@/views/panel/components/AnimalFormStepNav.vue'
import { useAnimalFormWizard } from '@/views/panel/composables/useAnimalFormWizard'

const props = withDefaults(
  defineProps<{
    initialDraft?: AnimalWriteInput
    submitLabel?: string
    isSubmitting?: boolean
  }>(),
  {
    submitLabel: 'Cadastrar',
    isSubmitting: false,
  },
)

const emit = defineEmits<{
  submit: [payload: AnimalWriteInput]
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
} = useAnimalFormWizard(props.initialDraft)

function onNext(): void {
  if (!canGoNext.value) {
    return
  }

  if (isLastStep.value) {
    emit('submit', toPayload())
    return
  }

  goNext()
}
</script>

<template>
  <div class="form-wizard">
    <AnimalFormStepNav
      :current-step="currentStep"
      :visited-steps="visitedSteps"
      @select="selectStep"
    />
    <div class="form-wizard-body">
      <AnimalFormBasicStep v-if="currentStep === 'basic'" v-model="draft" />
      <AnimalFormDescriptionStep v-else-if="currentStep === 'description'" v-model="draft" />
      <AnimalFormLocationStep v-else-if="currentStep === 'location'" v-model="draft" />
      <AnimalFormFooter
        :is-first-step="isFirstStep"
        :is-last-step="isLastStep"
        :can-continue="canGoNext"
        :submit-label="submitLabel"
        :is-submitting="isSubmitting"
        @back="goBack"
        @next="onNext"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.form-wizard {
  @apply grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)];
}

.form-wizard-body {
  @apply flex flex-col rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-7;
}
</style>

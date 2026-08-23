import { computed, ref } from 'vue'

import type { CreateAnimalInput } from '@/shared/api/animals'

export type WizardStep = 1 | 2 | 3 | 4

export function createEmptyDraft(): CreateAnimalInput {
  return {
    name: '',
    species: 'Dog',
    sex: 'Male',
    size: 'Medium',
    description: '',
    approximateAge: 0,
    image: '',
    status: 'Available',
    district: '',
    city: '',
  }
}

function isStepValid(step: WizardStep, draft: CreateAnimalInput): boolean {
  if (step === 1) {
    const name = draft.name.trim()
    return (
      name.length > 0 &&
      name.length <= 20 &&
      Number.isInteger(draft.approximateAge) &&
      draft.approximateAge >= 0 &&
      draft.approximateAge <= 30
    )
  }

  if (step === 3) {
    const description = draft.description.trim()
    return description.length > 0 && description.length <= 200
  }

  if (step === 4) {
    const district = draft.district.trim()
    const city = draft.city.trim()
    return district.length > 0 && district.length <= 30 && city.length > 0 && city.length <= 30
  }

  return false
}

function nextActiveStep(step: WizardStep): WizardStep | null {
  if (step === 1) {
    return 3
  }

  if (step === 3) {
    return 4
  }

  return null
}

function previousActiveStep(step: WizardStep): WizardStep | null {
  if (step === 4) {
    return 3
  }

  if (step === 3) {
    return 1
  }

  return null
}

export function useAnimalCreateWizard() {
  const draft = ref<CreateAnimalInput>(createEmptyDraft())
  const currentStep = ref<WizardStep>(1)
  const visitedSteps = ref<WizardStep[]>([1])

  const canGoNext = computed(() => isStepValid(currentStep.value, draft.value))
  const isFirstStep = computed(() => currentStep.value === 1)
  const isLastStep = computed(() => currentStep.value === 4)

  function markVisited(step: WizardStep): void {
    if (!visitedSteps.value.includes(step)) {
      visitedSteps.value = [...visitedSteps.value, step]
    }
  }

  function goNext(): void {
    if (!canGoNext.value) {
      return
    }

    const next = nextActiveStep(currentStep.value)
    if (next === null) {
      return
    }

    currentStep.value = next
    markVisited(next)
  }

  function goBack(): void {
    const previous = previousActiveStep(currentStep.value)
    if (previous === null) {
      return
    }

    currentStep.value = previous
  }

  function selectStep(step: WizardStep): void {
    if (step === 2) {
      return
    }

    if (step === currentStep.value || visitedSteps.value.includes(step)) {
      currentStep.value = step
    }
  }

  function toPayload(): CreateAnimalInput {
    return {
      ...draft.value,
      name: draft.value.name.trim(),
      description: draft.value.description.trim(),
      district: draft.value.district.trim(),
      city: draft.value.city.trim(),
      image: draft.value.image.trim(),
    }
  }

  return {
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
  }
}

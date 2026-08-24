import { computed, ref } from 'vue'

import type { CreateAnimalInput } from '@/shared/api/animals'

export const WIZARD_STEPS = ['basic', 'description', 'location'] as const

export type WizardStep = (typeof WIZARD_STEPS)[number]

export const WIZARD_STEP_META: Record<WizardStep, { title: string; subtitle: string }> = {
  basic: { title: 'Dados básicos', subtitle: 'Nome, espécie, porte, idade' },
  description: { title: 'Descrição e foto', subtitle: 'Texto e URL opcional' },
  location: { title: 'Localização e revisão', subtitle: 'Bairro, cidade, situação' },
}

export const ANIMAL_NAME_MAX = 20
export const ANIMAL_AGE_MAX = 30
export const ANIMAL_DESCRIPTION_MAX = 200
export const ANIMAL_LOCATION_MAX = 30

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
  if (step === 'basic') {
    const name = draft.name.trim()
    return (
      name.length > 0 &&
      name.length <= ANIMAL_NAME_MAX &&
      Number.isInteger(draft.approximateAge) &&
      draft.approximateAge >= 0 &&
      draft.approximateAge <= ANIMAL_AGE_MAX
    )
  }

  if (step === 'description') {
    const description = draft.description.trim()
    return description.length > 0 && description.length <= ANIMAL_DESCRIPTION_MAX
  }

  const district = draft.district.trim()
  const city = draft.city.trim()
  return (
    district.length > 0 &&
    district.length <= ANIMAL_LOCATION_MAX &&
    city.length > 0 &&
    city.length <= ANIMAL_LOCATION_MAX
  )
}

export function useAnimalCreateWizard() {
  const draft = ref<CreateAnimalInput>(createEmptyDraft())
  const currentStep = ref<WizardStep>('basic')
  const visitedSteps = ref<WizardStep[]>(['basic'])

  const canGoNext = computed(() => isStepValid(currentStep.value, draft.value))
  const isFirstStep = computed(() => currentStep.value === 'basic')
  const isLastStep = computed(() => currentStep.value === 'location')

  function markVisited(step: WizardStep): void {
    if (!visitedSteps.value.includes(step)) {
      visitedSteps.value = [...visitedSteps.value, step]
    }
  }

  function goNext(): void {
    if (!canGoNext.value) {
      return
    }

    const next = WIZARD_STEPS[WIZARD_STEPS.indexOf(currentStep.value) + 1]
    if (next === undefined) {
      return
    }

    currentStep.value = next
    markVisited(next)
  }

  function goBack(): void {
    const previous = WIZARD_STEPS[WIZARD_STEPS.indexOf(currentStep.value) - 1]
    if (previous === undefined) {
      return
    }

    currentStep.value = previous
  }

  function selectStep(step: WizardStep): void {
    if (visitedSteps.value.includes(step)) {
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

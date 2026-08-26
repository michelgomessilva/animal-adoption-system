import { computed, ref } from 'vue'

import {
  canonicalAnimalSex,
  canonicalAnimalSize,
  canonicalAnimalSpecies,
  canonicalAnimalStatus,
  type AnimalSex,
  type AnimalSize,
  type AnimalSpecies,
  type AnimalStatus,
  type AnimalWriteInput,
} from '@/shared/types/animal'

export const WIZARD_STEPS = ['basic', 'description', 'location'] as const

export type WizardStep = (typeof WIZARD_STEPS)[number]

export const WIZARD_STEP_META: Record<WizardStep, { title: string; subtitle: string }> = {
  basic: { title: 'Dados básicos', subtitle: 'Nome, espécie, porte, idade' },
  description: { title: 'Descrição e foto', subtitle: 'Texto e URL opcional' },
  location: { title: 'Localização e revisão', subtitle: 'Bairro, freguesia, cidade, situação' },
}

export const ANIMAL_NAME_MAX = 20
export const ANIMAL_AGE_MAX = 30
export const ANIMAL_DESCRIPTION_MAX = 200
export const ANIMAL_LOCATION_MAX = 30
export const ANIMAL_PARISH_MAX = 50

export function createEmptyDraft(): AnimalWriteInput {
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
    parish: '',
    city: '',
  }
}

interface ResolvedDraftEnums {
  species: AnimalSpecies | null
  sex: AnimalSex | null
  size: AnimalSize | null
  status: AnimalStatus | null
}

/** Edit drafts may carry non-canonical API enums; resolve once for validation and submit. */
function resolveDraftEnums(draft: AnimalWriteInput): ResolvedDraftEnums {
  return {
    species: canonicalAnimalSpecies(draft.species),
    sex: canonicalAnimalSex(draft.sex),
    size: canonicalAnimalSize(draft.size),
    status: canonicalAnimalStatus(draft.status),
  }
}

function isStepValid(step: WizardStep, draft: AnimalWriteInput): boolean {
  const enums = resolveDraftEnums(draft)

  if (step === 'basic') {
    const name = draft.name.trim()
    return (
      name.length > 0 &&
      name.length <= ANIMAL_NAME_MAX &&
      Number.isInteger(draft.approximateAge) &&
      draft.approximateAge >= 0 &&
      draft.approximateAge <= ANIMAL_AGE_MAX &&
      enums.species !== null &&
      enums.sex !== null &&
      enums.size !== null
    )
  }

  if (step === 'description') {
    const description = draft.description.trim()
    return description.length > 0 && description.length <= ANIMAL_DESCRIPTION_MAX
  }

  const district = draft.district.trim()
  const parish = draft.parish.trim()
  const city = draft.city.trim()
  return (
    district.length > 0 &&
    district.length <= ANIMAL_LOCATION_MAX &&
    parish.length > 0 &&
    parish.length <= ANIMAL_PARISH_MAX &&
    city.length > 0 &&
    city.length <= ANIMAL_LOCATION_MAX &&
    enums.status !== null
  )
}

function isDraftComplete(draft: AnimalWriteInput): boolean {
  return WIZARD_STEPS.every((step) => isStepValid(step, draft))
}

export function useAnimalFormWizard(initialDraft?: AnimalWriteInput) {
  const draft = ref<AnimalWriteInput>(
    initialDraft === undefined ? createEmptyDraft() : { ...initialDraft },
  )
  const currentStep = ref<WizardStep>('basic')
  const visitedSteps = ref<WizardStep[]>(initialDraft === undefined ? ['basic'] : [...WIZARD_STEPS])

  const canGoNext = computed(() => {
    if (currentStep.value === 'location') {
      return isDraftComplete(draft.value)
    }

    return isStepValid(currentStep.value, draft.value)
  })
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

  function toPayload(): AnimalWriteInput {
    const enums = resolveDraftEnums(draft.value)
    if (
      enums.species === null ||
      enums.sex === null ||
      enums.size === null ||
      enums.status === null
    ) {
      throw new Error('Animal form draft has incomplete enum fields')
    }

    return {
      name: draft.value.name.trim(),
      species: enums.species,
      sex: enums.sex,
      size: enums.size,
      description: draft.value.description.trim(),
      approximateAge: draft.value.approximateAge,
      image: draft.value.image.trim(),
      status: enums.status,
      district: draft.value.district.trim(),
      parish: draft.value.parish.trim(),
      city: draft.value.city.trim(),
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

import { describe, expect, it } from 'vitest'

import {
  ANIMAL_STATUS_OPTIONS,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
  type AnimalWriteInput,
} from '@/shared/types/animal'
import {
  ANIMAL_PARISH_MAX,
  useAnimalFormWizard,
} from '@/views/panel/composables/useAnimalFormWizard'

describe('useAnimalFormWizard', () => {
  it('advances through the three active steps', () => {
    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = 'Luna'

    wizard.goNext()

    expect(wizard.currentStep.value).toBe('description')

    wizard.draft.value.description = 'Calma'
    wizard.goNext()

    expect(wizard.currentStep.value).toBe('location')
    wizard.goBack()

    expect(wizard.currentStep.value).toBe('description')
  })

  it('does not advance from basic data when the name is empty', () => {
    const wizard = useAnimalFormWizard()

    expect(wizard.canGoNext.value).toBe(false)
    wizard.goNext()

    expect(wizard.currentStep.value).toBe('basic')
  })

  it('does not advance past the last step', () => {
    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = 'Luna'
    wizard.goNext()
    wizard.draft.value.description = 'Calma'
    wizard.goNext()

    expect(wizard.currentStep.value).toBe('location')
    wizard.draft.value.district = 'Centro'
    wizard.draft.value.parish = 'Sé'
    wizard.draft.value.city = 'Porto Alegre'
    expect(wizard.canGoNext.value).toBe(true)
    wizard.goNext()

    expect(wizard.currentStep.value).toBe('location')
  })

  it('returns a payload with an empty image string and wire enums', () => {
    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = ' Luna '
    wizard.draft.value.description = ' Calma '
    wizard.draft.value.parish = ' Sé '

    expect(wizard.toPayload()).toMatchObject({
      name: 'Luna',
      description: 'Calma',
      parish: 'Sé',
      image: '',
      species: AnimalSpecies.Dog,
      status: AnimalStatus.Available,
    })
  })

  it('exposes the three product status options including in-adoption process', () => {
    expect(ANIMAL_STATUS_OPTIONS).toEqual([
      AnimalStatus.Available,
      AnimalStatus.InAdoptionProcess,
      AnimalStatus.Adopted,
    ])

    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = 'Luna'
    wizard.draft.value.description = 'Calma'
    wizard.draft.value.district = 'Centro'
    wizard.draft.value.parish = 'Sé'
    wizard.draft.value.city = 'Porto Alegre'
    wizard.draft.value.status = AnimalStatus.InAdoptionProcess

    expect(wizard.toPayload()).toMatchObject({
      status: AnimalStatus.InAdoptionProcess,
    })
  })

  it('revisits a visited step', () => {
    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = 'Luna'
    wizard.goNext()

    wizard.selectStep('basic')

    expect(wizard.currentStep.value).toBe('basic')
  })

  it('hydrates from initialDraft and marks every step visited', () => {
    const wizard = useAnimalFormWizard({
      name: 'Luna',
      species: AnimalSpecies.Dog,
      sex: AnimalSex.Female,
      size: AnimalSize.Medium,
      description: 'Calma',
      approximateAge: 3,
      image: '',
      status: AnimalStatus.Adopted,
      district: 'Centro',
      parish: 'Sé',
      city: 'Porto Alegre',
    })

    expect(wizard.draft.value.status).toBe(AnimalStatus.Adopted)
    expect(wizard.visitedSteps.value).toEqual(['basic', 'description', 'location'])
  })

  it('blocks submit on the review step when enums from the API are invalid', () => {
    const wizard = useAnimalFormWizard({
      name: 'Pipoca',
      species: 3,
      sex: AnimalSex.Female,
      size: AnimalSize.Small,
      description: 'dócil',
      approximateAge: 1,
      image: '',
      status: 4,
      district: 'porto',
      parish: 'bom sucesso',
      city: 'porto',
    } as unknown as AnimalWriteInput)

    wizard.selectStep('location')

    expect(wizard.canGoNext.value).toBe(false)

    wizard.draft.value.species = AnimalSpecies.Dog
    wizard.draft.value.status = AnimalStatus.Available

    expect(wizard.canGoNext.value).toBe(true)
    expect(wizard.toPayload()).toMatchObject({
      species: AnimalSpecies.Dog,
      status: AnimalStatus.Available,
    })
  })

  it('blocks the basic step when species is not a product enum', () => {
    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = 'Pipoca'
    wizard.draft.value.species = 'None' as AnimalWriteInput['species']

    expect(wizard.canGoNext.value).toBe(false)
  })

  it('blocks the review step when parish is blank or too long', () => {
    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = 'Luna'
    wizard.goNext()
    wizard.draft.value.description = 'Calma'
    wizard.goNext()
    wizard.draft.value.district = 'Centro'
    wizard.draft.value.city = 'Porto Alegre'

    wizard.draft.value.parish = '   '
    expect(wizard.canGoNext.value).toBe(false)

    wizard.draft.value.parish = 'x'.repeat(ANIMAL_PARISH_MAX + 1)
    expect(wizard.canGoNext.value).toBe(false)

    wizard.draft.value.parish = 'x'.repeat(ANIMAL_PARISH_MAX)
    expect(wizard.canGoNext.value).toBe(true)
  })
})

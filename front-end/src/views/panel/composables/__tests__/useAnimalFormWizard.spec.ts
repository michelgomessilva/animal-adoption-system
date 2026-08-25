import { describe, expect, it } from 'vitest'

import { useAnimalFormWizard } from '@/views/panel/composables/useAnimalFormWizard'

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
    wizard.draft.value.city = 'Porto Alegre'
    expect(wizard.canGoNext.value).toBe(true)
    wizard.goNext()

    expect(wizard.currentStep.value).toBe('location')
  })

  it('returns a payload with an empty image string and no nulls', () => {
    const wizard = useAnimalFormWizard()
    wizard.draft.value.name = ' Luna '
    wizard.draft.value.description = ' Calma '

    expect(wizard.toPayload()).toMatchObject({
      name: 'Luna',
      description: 'Calma',
      image: '',
      status: 'Available',
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
      species: 'Dog',
      sex: 'Female',
      size: 'Medium',
      description: 'Calma',
      approximateAge: 3,
      image: '',
      status: 'Adopted',
      district: 'Centro',
      city: 'Porto Alegre',
    })

    expect(wizard.draft.value.name).toBe('Luna')
    expect(wizard.draft.value.status).toBe('Adopted')
    wizard.selectStep('location')
    expect(wizard.currentStep.value).toBe('location')
  })
})

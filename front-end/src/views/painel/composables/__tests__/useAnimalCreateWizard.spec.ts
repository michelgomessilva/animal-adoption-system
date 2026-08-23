import { describe, expect, it } from 'vitest'

import { useAnimalCreateWizard } from '@/views/painel/composables/useAnimalCreateWizard'

describe('useAnimalCreateWizard', () => {
  it('advances through the three active steps', () => {
    const wizard = useAnimalCreateWizard()
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
    const wizard = useAnimalCreateWizard()

    expect(wizard.canGoNext.value).toBe(false)
    wizard.goNext()

    expect(wizard.currentStep.value).toBe('basic')
  })

  it('does not advance past the last step', () => {
    const wizard = useAnimalCreateWizard()
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
    const wizard = useAnimalCreateWizard()
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
    const wizard = useAnimalCreateWizard()
    wizard.draft.value.name = 'Luna'
    wizard.goNext()

    wizard.selectStep('basic')

    expect(wizard.currentStep.value).toBe('basic')
  })
})

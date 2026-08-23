import { describe, expect, it } from 'vitest'

import { useAnimalCreateWizard } from '@/views/painel/composables/useAnimalCreateWizard'

describe('useAnimalCreateWizard', () => {
  it('skips the health step when advancing and going back', () => {
    const wizard = useAnimalCreateWizard()
    wizard.draft.value.name = 'Luna'

    wizard.goNext()

    expect(wizard.currentStep.value).toBe(3)

    wizard.goBack()

    expect(wizard.currentStep.value).toBe(1)
    expect(wizard.currentStep.value).not.toBe(2)
  })

  it('does not advance from step 1 when the name is empty', () => {
    const wizard = useAnimalCreateWizard()

    expect(wizard.canGoNext.value).toBe(false)
    wizard.goNext()

    expect(wizard.currentStep.value).toBe(1)
  })

  it('does not advance past the last step', () => {
    const wizard = useAnimalCreateWizard()
    wizard.draft.value.name = 'Luna'
    wizard.goNext()
    wizard.draft.value.description = 'Calma'
    wizard.goNext()

    expect(wizard.currentStep.value).toBe(4)
    wizard.draft.value.district = 'Centro'
    wizard.draft.value.city = 'Porto Alegre'
    expect(wizard.canGoNext.value).toBe(true)
    wizard.goNext()

    expect(wizard.currentStep.value).toBe(4)
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

  it('ignores selecting the faded health step', () => {
    const wizard = useAnimalCreateWizard()

    wizard.selectStep(2)

    expect(wizard.currentStep.value).toBe(1)
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateWizard from '@/views/painel/components/AnimalCreateWizard.vue'

describe('AnimalCreateWizard', () => {
  it('starts on basic data and skips health after continue', async () => {
    const wrapper = mount(AnimalCreateWizard)

    expect(wrapper.text()).toContain('Nome do pet')
    expect(wrapper.text()).not.toContain('Vacinas e histórico de saúde em breve.')

    await wrapper.get('input[name="name"]').setValue('Luna')
    const continueButton = wrapper.findAll('button').find((button) => button.text() === 'Continuar')
    if (continueButton === undefined) {
      throw new Error('Expected Continuar')
    }
    await continueButton.trigger('click')

    expect(wrapper.text()).toContain('Descrição')
    expect(wrapper.text()).not.toContain('Vacinas e histórico de saúde em breve.')
  })
})

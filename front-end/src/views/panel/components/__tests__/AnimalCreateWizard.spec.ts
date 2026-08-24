import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateWizard from '@/views/panel/components/AnimalCreateWizard.vue'

describe('AnimalCreateWizard', () => {
  it('starts on basic data and continues to description', async () => {
    const wrapper = mount(AnimalCreateWizard)

    expect(wrapper.text()).toContain('Nome do pet')
    expect(wrapper.text()).not.toContain('Vacinas e histórico de saúde')

    await wrapper.get('input[name="name"]').setValue('Luna')
    const continueButton = wrapper.findAll('button').find((button) => button.text() === 'Continuar')
    if (continueButton === undefined) {
      throw new Error('Expected Continuar')
    }
    await continueButton.trigger('click')

    expect(wrapper.text()).toContain('Descrição')
    expect(wrapper.text()).toContain('Foto por URL (opcional)')
  })
})

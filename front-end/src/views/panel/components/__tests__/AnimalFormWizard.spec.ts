import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalFormWizard from '@/views/panel/components/AnimalFormWizard.vue'

describe('AnimalFormWizard', () => {
  it('starts on basic data and continues to description', async () => {
    const wrapper = mount(AnimalFormWizard)

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

  it('shows the submit label on the last step when hydrated', async () => {
    const wrapper = mount(AnimalFormWizard, {
      props: {
        submitLabel: 'Salvar',
        initialDraft: {
          name: 'Luna',
          species: 'Dog',
          sex: 'Female',
          size: 'Medium',
          description: 'Calma',
          approximateAge: 3,
          image: '',
          status: 'Available',
          district: 'Centro',
          parish: 'Sé',
          city: 'Porto Alegre',
        },
      },
    })

    expect((wrapper.get('input[name="name"]').element as HTMLInputElement).value).toBe('Luna')

    const locationNav = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Localização'))
    if (locationNav === undefined) {
      throw new Error('Expected location step nav')
    }
    await locationNav.trigger('click')

    const save = wrapper.findAll('button').find((button) => button.text().includes('Salvar'))
    expect(save).toBeDefined()
  })
})

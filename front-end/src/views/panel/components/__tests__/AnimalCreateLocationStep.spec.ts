import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateLocationStep from '@/views/panel/components/AnimalCreateLocationStep.vue'
import { createEmptyDraft } from '@/views/panel/composables/useAnimalCreateWizard'

describe('AnimalCreateLocationStep', () => {
  it('updates city, district, and status', async () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalCreateLocationStep, {
      props: { modelValue: model },
    })

    await wrapper.get('input[name="district"]').setValue('Centro')
    await wrapper.get('input[name="city"]').setValue('Porto Alegre')
    const adopted = wrapper.findAll('button').find((button) => button.text() === 'Adotado')
    if (adopted === undefined) {
      throw new Error('Expected the Adopted button')
    }
    await adopted.trigger('click')

    expect(model.district).toBe('Centro')
    expect(model.city).toBe('Porto Alegre')
    expect(model.status).toBe('Adopted')
  })

  it('shows the review name without a state field', () => {
    const model = createEmptyDraft()
    model.name = 'Luna'
    const wrapper = mount(AnimalCreateLocationStep, {
      props: { modelValue: model },
    })

    expect(wrapper.text()).toContain('Situação')
    expect(wrapper.text()).not.toContain('Status')
    expect(wrapper.text()).not.toContain('Estado')
    expect(wrapper.find('input[name="state"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Luna')
  })
})

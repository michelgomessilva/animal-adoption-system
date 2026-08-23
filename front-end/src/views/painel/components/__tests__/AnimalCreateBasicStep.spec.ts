import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateBasicStep from '@/views/painel/components/AnimalCreateBasicStep.vue'
import { createEmptyDraft } from '@/views/painel/composables/useAnimalCreateWizard'

describe('AnimalCreateBasicStep', () => {
  it('sets species to Cat when Gato is selected', async () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalCreateBasicStep, {
      props: { modelValue: model },
    })

    const buttons = wrapper.findAll('button')
    const cat = buttons.find((button) => button.text() === 'Gato')
    if (cat === undefined) {
      throw new Error('Expected the Cat button')
    }

    await cat.trigger('click')

    expect(model.species).toBe('Cat')
  })

  it('limits age to 30 and name to 20', () => {
    const wrapper = mount(AnimalCreateBasicStep, {
      props: { modelValue: createEmptyDraft() },
    })

    expect(wrapper.get('input[name="approximateAge"]').attributes('max')).toBe('30')
    expect(wrapper.get('input[name="name"]').attributes('maxlength')).toBe('20')
    expect(wrapper.text()).not.toContain('Outra')
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateDescriptionStep from '@/views/painel/components/AnimalCreateDescriptionStep.vue'
import { createEmptyDraft } from '@/views/painel/composables/useAnimalCreateWizard'

describe('AnimalCreateDescriptionStep', () => {
  it('updates description and image URL', async () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalCreateDescriptionStep, {
      props: { modelValue: model },
    })

    await wrapper.get('textarea[name="description"]').setValue('Calma e brincalhona')
    await wrapper.get('input[name="image"]').setValue('https://example.com/luna.jpg')

    expect(model.description).toBe('Calma e brincalhona')
    expect(model.image).toBe('https://example.com/luna.jpg')
  })

  it('has no file input and does not add photos from Adicionar', async () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalCreateDescriptionStep, {
      props: { modelValue: model },
    })

    expect(wrapper.findAll('input[type="file"]')).toHaveLength(0)

    const add = wrapper.findAll('button').find((button) => button.text() === 'Adicionar')
    if (add === undefined) {
      throw new Error('Expected the Adicionar button')
    }

    await add.trigger('click')

    expect(wrapper.findAll('input[type="file"]')).toHaveLength(0)
    expect(model.image).toBe('')
  })
})

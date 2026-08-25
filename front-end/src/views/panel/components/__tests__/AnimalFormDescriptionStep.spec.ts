import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalFormDescriptionStep from '@/views/panel/components/AnimalFormDescriptionStep.vue'
import { createEmptyDraft } from '@/views/panel/composables/useAnimalFormWizard'

describe('AnimalFormDescriptionStep', () => {
  it('updates description and image URL', async () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalFormDescriptionStep, {
      props: { modelValue: model },
    })

    await wrapper.get('textarea[name="description"]').setValue('Calma e brincalhona')
    await wrapper.get('input[name="image"]').setValue('https://example.com/luna.jpg')

    expect(model.description).toBe('Calma e brincalhona')
    expect(model.image).toBe('https://example.com/luna.jpg')
    expect(wrapper.get('img').attributes('src')).toBe('https://example.com/luna.jpg')
  })

  it('has no file input and no preview without a URL', () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalFormDescriptionStep, {
      props: { modelValue: model },
    })

    expect(wrapper.findAll('input[type="file"]')).toHaveLength(0)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Adicionar')
  })
})

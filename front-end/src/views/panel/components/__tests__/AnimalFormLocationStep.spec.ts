import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { AnimalStatus } from '@/shared/types/animal'
import AnimalFormLocationStep from '@/views/panel/components/AnimalFormLocationStep.vue'
import { ANIMAL_PARISH_MAX, createEmptyDraft } from '@/views/panel/composables/useAnimalFormWizard'

describe('AnimalFormLocationStep', () => {
  it('updates city, district, parish, and status', async () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalFormLocationStep, {
      props: { modelValue: model },
    })

    await wrapper.get('input[name="district"]').setValue('Centro')
    await wrapper.get('input[name="parish"]').setValue('Sé')
    await wrapper.get('input[name="city"]').setValue('Porto Alegre')
    const adopted = wrapper.findAll('button').find((button) => button.text() === 'Adotado')
    if (adopted === undefined) {
      throw new Error('Expected the Adopted button')
    }
    await adopted.trigger('click')

    expect(model.district).toBe('Centro')
    expect(model.parish).toBe('Sé')
    expect(model.city).toBe('Porto Alegre')
    expect(model.status).toBe(AnimalStatus.Adopted)
  })

  it('sets status to in-adoption process when that option is selected', async () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalFormLocationStep, {
      props: { modelValue: model },
    })

    const inProcess = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Em processo de adoção')
    if (inProcess === undefined) {
      throw new Error('Expected the InAdoptionProcess button')
    }
    await inProcess.trigger('click')

    expect(model.status).toBe(AnimalStatus.InAdoptionProcess)
  })

  it('exposes a parish input with the API max length', () => {
    const model = createEmptyDraft()
    const wrapper = mount(AnimalFormLocationStep, {
      props: { modelValue: model },
    })

    const parish = wrapper.get('input[name="parish"]')
    expect(parish.attributes('maxlength')).toBe(String(ANIMAL_PARISH_MAX))
  })

  it('shows the review name without a state field', () => {
    const model = createEmptyDraft()
    model.name = 'Luna'
    const wrapper = mount(AnimalFormLocationStep, {
      props: { modelValue: model },
    })

    expect(wrapper.text()).toContain('Situação')
    expect(wrapper.text()).toContain('Freguesia')
    expect(wrapper.text()).not.toContain('Status')
    expect(wrapper.text()).not.toContain('Estado')
    expect(wrapper.find('input[name="state"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Luna')
  })
})

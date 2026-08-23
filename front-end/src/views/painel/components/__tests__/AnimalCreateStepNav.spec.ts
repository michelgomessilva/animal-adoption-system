import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateStepNav from '@/views/painel/components/AnimalCreateStepNav.vue'

describe('AnimalCreateStepNav', () => {
  it('does not emit select when Saúde is clicked', async () => {
    const wrapper = mount(AnimalCreateStepNav, {
      props: { currentStep: 1, visitedSteps: [1] },
    })

    await wrapper.getComponent({ name: 'ComingSoon' }).trigger('click')

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('emits select for a visited description step', async () => {
    const wrapper = mount(AnimalCreateStepNav, {
      props: { currentStep: 1, visitedSteps: [1, 3] },
    })

    const buttons = wrapper.findAll('button')
    const description = buttons.find((button) => button.text().includes('Imagens e descrição'))
    if (description === undefined) {
      throw new Error('Expected the description step button')
    }

    await description.trigger('click')

    expect(wrapper.emitted('select')).toEqual([[3]])
  })

  it('marks the current step', () => {
    const wrapper = mount(AnimalCreateStepNav, {
      props: { currentStep: 1, visitedSteps: [1] },
    })

    expect(wrapper.get('.step-nav-item--current').text()).toContain('Dados básicos')
  })
})

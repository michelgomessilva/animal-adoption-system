import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateStepNav from '@/views/panel/components/AnimalCreateStepNav.vue'

describe('AnimalCreateStepNav', () => {
  it('does not emit select for an unvisited later step', async () => {
    const wrapper = mount(AnimalCreateStepNav, {
      props: { currentStep: 'basic', visitedSteps: ['basic'] },
    })

    const location = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Localização'))
    if (location === undefined) {
      throw new Error('Expected the location step button')
    }

    await location.trigger('click')

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('emits select for a visited description step', async () => {
    const wrapper = mount(AnimalCreateStepNav, {
      props: { currentStep: 'basic', visitedSteps: ['basic', 'description'] },
    })

    const description = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Descrição e foto'))
    if (description === undefined) {
      throw new Error('Expected the description step button')
    }

    await description.trigger('click')

    expect(wrapper.emitted('select')).toEqual([['description']])
  })

  it('marks the current step', () => {
    const wrapper = mount(AnimalCreateStepNav, {
      props: { currentStep: 'basic', visitedSteps: ['basic'] },
    })

    expect(wrapper.get('.step-nav-item--current').text()).toContain('Dados básicos')
    expect(wrapper.text()).toContain('situação')
    expect(wrapper.text()).not.toContain('status')
    expect(wrapper.text()).not.toContain('Saúde')
  })
})

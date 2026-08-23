import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateFooter from '@/views/panel/components/AnimalCreateFooter.vue'

describe('AnimalCreateFooter', () => {
  it('disables Voltar on the first step', () => {
    const wrapper = mount(AnimalCreateFooter, {
      props: { isFirstStep: true, isLastStep: false, canContinue: true },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button').text()).toContain('Voltar')
    expect(wrapper.find('[data-icon="chevron-left"]').exists()).toBe(true)
  })

  it('shows Cadastrar on the last step', () => {
    const wrapper = mount(AnimalCreateFooter, {
      props: { isFirstStep: false, isLastStep: true, canContinue: true },
    })

    const primary = wrapper.findAll('button').find((button) => button.text().includes('Cadastrar'))
    expect(primary).toBeDefined()
    expect(wrapper.find('[data-icon="chevron-right"]').exists()).toBe(true)
  })
})

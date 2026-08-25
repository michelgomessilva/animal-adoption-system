import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalFormFooter from '@/views/panel/components/AnimalFormFooter.vue'

describe('AnimalFormFooter', () => {
  it('disables Voltar on the first step', () => {
    const wrapper = mount(AnimalFormFooter, {
      props: {
        isFirstStep: true,
        isLastStep: false,
        canContinue: true,
        submitLabel: 'Cadastrar',
      },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button').text()).toContain('Voltar')
    expect(wrapper.find('[data-icon="chevron-left"]').exists()).toBe(true)
  })

  it('shows the submit label on the last step', () => {
    const wrapper = mount(AnimalFormFooter, {
      props: {
        isFirstStep: false,
        isLastStep: true,
        canContinue: true,
        submitLabel: 'Salvar',
      },
    })

    const primary = wrapper.findAll('button').find((button) => button.text().includes('Salvar'))
    expect(primary).toBeDefined()
    expect(wrapper.find('[data-icon="chevron-right"]').exists()).toBe(true)
  })

  it('disables the primary action while submitting', () => {
    const wrapper = mount(AnimalFormFooter, {
      props: {
        isFirstStep: false,
        isLastStep: true,
        canContinue: true,
        submitLabel: 'Salvar',
        isSubmitting: true,
      },
    })

    const primary = wrapper.findAll('button').find((button) => button.text().includes('Salvar'))
    expect(primary?.attributes('disabled')).toBeDefined()
  })
})

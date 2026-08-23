import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateFooter from '@/views/painel/components/AnimalCreateFooter.vue'

describe('AnimalCreateFooter', () => {
  it('disables Voltar on the first step', () => {
    const wrapper = mount(AnimalCreateFooter, {
      props: { isFirstStep: true, isLastStep: false, canContinue: true },
    })

    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button').text()).toBe('Voltar')
  })

  it('shows Cadastrar on the last step', () => {
    const wrapper = mount(AnimalCreateFooter, {
      props: { isFirstStep: false, isLastStep: true, canContinue: true },
    })

    const primary = wrapper.findAll('button').find((button) => button.text() === 'Cadastrar')
    expect(primary).toBeDefined()
  })

  it('does not emit from Arquivar', async () => {
    const wrapper = mount(AnimalCreateFooter, {
      props: { isFirstStep: false, isLastStep: false, canContinue: true },
    })

    const archive = wrapper.findAll('button').find((button) => button.text() === 'Arquivar')
    if (archive === undefined) {
      throw new Error('Expected the Arquivar button')
    }

    await archive.trigger('click')

    expect(wrapper.emitted('next')).toBeUndefined()
    expect(wrapper.emitted('back')).toBeUndefined()
  })
})

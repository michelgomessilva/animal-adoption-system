import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCreateHealthStep from '@/views/painel/components/AnimalCreateHealthStep.vue'

describe('AnimalCreateHealthStep', () => {
  it('shows Em breve and has no fields', () => {
    const wrapper = mount(AnimalCreateHealthStep)

    expect(wrapper.text()).toContain('Em breve')
    expect(wrapper.findAll('input')).toHaveLength(0)
    expect(wrapper.findAll('select')).toHaveLength(0)
  })
})

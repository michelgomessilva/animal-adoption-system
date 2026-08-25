import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import AppIcon from '@/shared/components/AppIcon.vue'

describe('AppIcon', () => {
  it('renders the requested icon with data-icon and aria-hidden', () => {
    const wrapper = mount(AppIcon, {
      props: { name: 'plus' },
    })

    const icon = wrapper.get('[data-icon="plus"]')
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.classes()).toContain('app-icon--sm')
  })

  it.each([
    { name: 'inbox' as const, size: 'lg' as const, expected: 'app-icon--lg' },
    { name: 'menu' as const, size: 'md' as const, expected: 'app-icon--md' },
    { name: 'eye' as const, size: 'xs' as const, expected: 'app-icon--xs' },
  ])('applies $size size class', ({ name, size, expected }) => {
    const wrapper = mount(AppIcon, { props: { name, size } })
    expect(wrapper.get(`[data-icon="${name}"]`).classes()).toContain(expected)
  })
})

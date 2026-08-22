import { describe, expect, it } from 'vitest'

import BrandLogo from '@/shared/components/BrandLogo.vue'
import { mountWithPlugins } from '@/__tests__/helpers'

describe('BrandLogo', () => {
  it('links to the home route and shows the brand name', async () => {
    const wrapper = await mountWithPlugins(BrandLogo)

    expect(wrapper.get('a').attributes('href')).toBe('/')
    expect(wrapper.get('a').attributes('aria-label')).toBe('POA — página inicial')
    expect(wrapper.text()).toContain('POA')
  })
})

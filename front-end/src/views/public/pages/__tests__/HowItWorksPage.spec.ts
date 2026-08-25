import { describe, expect, it } from 'vitest'

import HowItWorksPage from '@/views/public/pages/HowItWorksPage.vue'
import { mountWithPlugins } from '@/__tests__/helpers'

describe('HowItWorksPage', () => {
  it('describes the public adoption path without an in-app application', async () => {
    const wrapper = await mountWithPlugins(HowItWorksPage)

    expect(wrapper.get('h1').text()).toBe('Como funciona')
    expect(wrapper.text()).toContain('Abra o card no catálogo')
    expect(wrapper.text()).toContain('não cadastra adotantes')
    expect(wrapper.get('a[href="/"]').text()).toContain('Ver o catálogo')
  })
})

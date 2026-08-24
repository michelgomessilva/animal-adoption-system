import { describe, expect, it } from 'vitest'

import OrganizationPage from '@/views/public/pages/OrganizationPage.vue'
import { mountWithPlugins } from '@/__tests__/helpers'

describe('OrganizationPage', () => {
  it('explains the single-ONG catalog and links to adopt and login', async () => {
    const wrapper = await mountWithPlugins(OrganizationPage)

    expect(wrapper.get('h1').text()).toBe('A ONG por trás do POA')
    expect(wrapper.text()).toContain('única organização')
    expect(wrapper.get('a[href="/"]').text()).toContain('Ver animais')
    expect(wrapper.get('a[href="/entrar"]').text()).toContain('Área da ONG')
  })
})

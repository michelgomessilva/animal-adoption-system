import { describe, expect, it } from 'vitest'

import PublicHeader from '@/views/public/components/PublicHeader.vue'
import { mountWithPlugins } from '@/__tests__/helpers'

describe('PublicHeader', () => {
  it('renders the public destinations from the wireframe', async () => {
    const wrapper = await mountWithPlugins(PublicHeader)
    const hrefs = wrapper.findAll('a').map((link) => link.attributes('href'))

    expect(wrapper.text()).toContain('Adotar')
    expect(wrapper.text()).toContain('ONGs')
    expect(wrapper.text()).toContain('Como funciona')
    expect(wrapper.text()).toContain('Entrar')
    expect(wrapper.text()).toContain('Cadastrar ONG')
    expect(hrefs).toEqual(
      expect.arrayContaining(['/', '/ongs', '/como-funciona', '/entrar', '/cadastrar-ong']),
    )
    expect(wrapper.find('[aria-label="Abrir menu"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="menu"]').exists()).toBe(true)
  })
})

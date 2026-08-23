import { describe, expect, it } from 'vitest'

import PanelNav from '@/views/panel/components/PanelNav.vue'
import { mountWithPlugins } from '@/__tests__/helpers'

describe('PanelNav', () => {
  it('links only Meus pets and fades the remaining items', async () => {
    const wrapper = await mountWithPlugins(PanelNav)
    const links = wrapper.findAll('a')

    expect(links).toHaveLength(1)
    expect(links[0]!.text()).toContain('Meus pets')
    expect(links[0]!.attributes('href')).toBe('/panel/animals')
    expect(wrapper.find('[data-icon="paw-print"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="inbox"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="landmark"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Pedidos de adoção')
    expect(wrapper.text()).toContain('Perfil da ONG')
    expect(wrapper.text()).toContain('Em breve')
  })
})

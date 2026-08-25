import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import PanelLayout from '@/views/panel/PanelLayout.vue'
import { createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
  createAnimal: vi.fn<() => Promise<never>>(),
  getAnimalById: vi.fn<() => Promise<never>>(),
  updateAnimal: vi.fn<() => Promise<never>>(),
}))

describe('PanelLayout', () => {
  it('renders the panel chrome and the routed page', async () => {
    const router = await createTestRouter([
      {
        path: '/panel',
        component: PanelLayout,
        children: [
          {
            path: 'animals',
            name: 'panel-animals',
            component: defineComponent({ template: '<p>lista</p>' }),
          },
        ],
      },
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/entrar', name: 'login', component: { template: '<div />' } },
    ])
    await router.push('/panel/animals')

    const wrapper = await mountWithPlugins(PanelLayout, { router })

    expect(wrapper.text()).toContain('Meus pets')
    expect(wrapper.text()).toContain('Sair')
    expect(wrapper.text()).toContain('lista')
  })
})

import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import PainelLayout from '@/views/painel/PainelLayout.vue'
import { createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
  createAnimal: vi.fn<() => Promise<never>>(),
}))

describe('PainelLayout', () => {
  it('renders the painel chrome and the routed page', async () => {
    const router = await createTestRouter([
      {
        path: '/painel',
        component: PainelLayout,
        children: [
          {
            path: 'animais',
            name: 'painel-animais',
            component: defineComponent({ template: '<p>lista</p>' }),
          },
        ],
      },
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/entrar', name: 'login', component: { template: '<div />' } },
    ])
    await router.push('/painel/animais')

    const wrapper = await mountWithPlugins(PainelLayout, { router })

    expect(wrapper.text()).toContain('Meus pets')
    expect(wrapper.text()).toContain('Sair')
    expect(wrapper.text()).toContain('lista')
  })
})

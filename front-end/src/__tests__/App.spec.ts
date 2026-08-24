import { describe, expect, it, vi } from 'vitest'

import App from '@/App.vue'
import { createTestRouter, mountWithPlugins } from '@/__tests__/helpers'
import PublicLayout from '@/views/public/PublicLayout.vue'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
}))

describe('App', () => {
  it('renders the public shell on the home route', async () => {
    const { default: HomePage } = await import('@/views/public/pages/HomePage.vue')
    const router = await createTestRouter([
      {
        path: '/',
        component: PublicLayout,
        children: [{ path: '', name: 'home', component: HomePage }],
      },
      { path: '/ongs', name: 'organization', component: { template: '<div />' } },
      { path: '/como-funciona', name: 'how-it-works', component: { template: '<div />' } },
      { path: '/entrar', name: 'login', component: { template: '<div />' } },
    ])

    const wrapper = await mountWithPlugins(App, { router })

    expect(wrapper.text()).toContain('Adotar')
    expect(wrapper.text()).toContain('Encontre o próximo membro da casa')
  })
})

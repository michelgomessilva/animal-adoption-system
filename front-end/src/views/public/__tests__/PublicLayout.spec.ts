import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import PublicLayout from '@/views/public/PublicLayout.vue'
import { createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

describe('PublicLayout', () => {
  it('renders the public header and the routed page', async () => {
    const router = await createTestRouter([
      {
        path: '/',
        component: PublicLayout,
        children: [
          {
            path: '',
            name: 'home',
            component: defineComponent({ template: '<p>catalogo</p>' }),
          },
          { path: '/ongs', name: 'ongs', component: { template: '<div />' } },
          { path: '/como-funciona', name: 'how-it-works', component: { template: '<div />' } },
          { path: '/entrar', name: 'login', component: { template: '<div />' } },
        ],
      },
    ])

    const wrapper = await mountWithPlugins(PublicLayout, { router })

    expect(wrapper.text()).toContain('Adotar')
    expect(wrapper.text()).toContain('catalogo')
  })
})

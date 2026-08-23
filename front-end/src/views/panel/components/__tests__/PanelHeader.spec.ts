import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/shared/stores/auth.store'
import PanelHeader from '@/views/panel/components/PanelHeader.vue'
import { createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

describe('PanelHeader', () => {
  it('logs out and navigates to login', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    const logout = vi.spyOn(auth, 'logout')
    const router = await createTestRouter()
    const push = vi.spyOn(router, 'push')

    const wrapper = await mountWithPlugins(PanelHeader, { router, pinia })

    expect(wrapper.find('[aria-label="Abrir menu"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="menu"]').exists()).toBe(true)
    expect(wrapper.find('[data-icon="log-out"]').exists()).toBe(true)

    await wrapper.get('button').trigger('click')

    expect(logout).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith({ name: 'login' })
  })
})

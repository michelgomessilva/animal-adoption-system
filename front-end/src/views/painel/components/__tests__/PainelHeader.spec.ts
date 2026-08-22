import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/shared/stores/auth.store'
import PainelHeader from '@/views/painel/components/PainelHeader.vue'
import { createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

describe('PainelHeader', () => {
  it('logs out and navigates to login', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    const logout = vi.spyOn(auth, 'logout')
    const router = await createTestRouter()
    const push = vi.spyOn(router, 'push')

    const wrapper = await mountWithPlugins(PainelHeader, { router, pinia })
    await wrapper.get('button').trigger('click')

    expect(logout).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith({ name: 'login' })
  })
})

import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import { useAuthStore } from '@/shared/stores/auth.store'
import LoginPage from '@/views/public/pages/LoginPage.vue'
import { createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

describe('LoginPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows the invalid credentials alert and stays on login after 401', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    vi.spyOn(auth, 'login').mockRejectedValue(new ApiError('unauthorized', 401, 'Unauthorized'))
    const router = await createTestRouter()
    const push = vi.spyOn(router, 'replace')

    const wrapper = await mountWithPlugins(LoginPage, { router, pinia })
    await wrapper.get('input[name="username"]').setValue('admin')
    await wrapper.get('input[name="password"]').setValue('wrong')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('E-mail ou senha inválidos.')
    expect(push).not.toHaveBeenCalled()
  })

  it('calls login with rememberMe and navigates to the painel', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    const login = vi.spyOn(auth, 'login').mockResolvedValue()
    const router = await createTestRouter()
    const replace = vi.spyOn(router, 'replace')

    const wrapper = await mountWithPlugins(LoginPage, { router, pinia })
    await wrapper.get('input[name="username"]').setValue('admin')
    await wrapper.get('input[name="password"]').setValue('secret')
    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'secret',
      rememberMe: true,
    })
    expect(replace).toHaveBeenCalledWith({ name: 'painel-animais' })
  })

  it('toggles password visibility', async () => {
    const wrapper = await mountWithPlugins(LoginPage)
    const password = wrapper.get('input[name="password"]')

    expect(password.attributes('type')).toBe('password')
    await wrapper.get('button[type="button"]').trigger('click')
    expect(wrapper.get('input[name="password"]').attributes('type')).toBe('text')
    expect(wrapper.get('button[type="button"]').text()).toBe('ocultar')
  })
})

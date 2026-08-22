import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AUTH_SESSION_KEY, useAuthStore } from '@/shared/stores/auth.store'

vi.mock('@/shared/api/auth', () => ({
  login: vi.fn<(username: string, password: string) => Promise<{ token: string }>>(),
}))

import { login as loginRequest } from '@/shared/api/auth'
import { resetHttpClient } from '@/shared/api/http'

const loginMock = vi.mocked(loginRequest)

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
    resetHttpClient()
    loginMock.mockReset()
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    resetHttpClient()
  })

  it('stores the session after a successful login', async () => {
    loginMock.mockResolvedValue({ token: 'jwt' })
    const store = useAuthStore()

    await store.login({ username: 'admin', password: 'secret', rememberMe: false })

    expect(store.session).toEqual({ token: 'jwt', username: 'admin' })
    expect(store.isAuthenticated).toBe(true)
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBe(JSON.stringify(store.session))
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull()
  })

  it('persists to localStorage when rememberMe is true', async () => {
    loginMock.mockResolvedValue({ token: 'jwt' })
    const store = useAuthStore()

    await store.login({ username: 'admin', password: 'secret', rememberMe: true })

    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBe(JSON.stringify(store.session))
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeNull()
  })

  it('leaves the session empty when login is unauthorized', async () => {
    loginMock.mockRejectedValue({ code: 'unauthorized' })
    const store = useAuthStore()

    await expect(
      store.login({ username: 'admin', password: 'wrong', rememberMe: false }),
    ).rejects.toMatchObject({ code: 'unauthorized' })
    expect(store.session).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('hydrates a valid stored session', () => {
    const stored = { token: 'jwt', username: 'admin' }
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(stored))
    const store = useAuthStore()

    store.hydrate()

    expect(store.session).toEqual(stored)
    expect(store.isAuthenticated).toBe(true)
  })

  it('clears an invalid stored session on hydrate', () => {
    localStorage.setItem(AUTH_SESSION_KEY, '{not-json')
    const store = useAuthStore()

    store.hydrate()

    expect(store.session).toBeNull()
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull()
  })

  it('logout clears session and both storages', async () => {
    loginMock.mockResolvedValue({ token: 'jwt' })
    const store = useAuthStore()
    await store.login({ username: 'admin', password: 'secret', rememberMe: true })

    store.logout()

    expect(store.session).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull()
    expect(sessionStorage.getItem(AUTH_SESSION_KEY)).toBeNull()
  })
})

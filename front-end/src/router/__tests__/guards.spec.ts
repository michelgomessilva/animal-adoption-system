import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authNavigationGuard } from '@/router/auth-guard'
import { routes } from '@/router/routes'
import { AUTH_SESSION_KEY, useAuthStore } from '@/shared/stores/auth.store'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
  createAnimal: vi.fn<() => Promise<never>>(),
}))

async function createGuardedRouter() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.beforeEach(authNavigationGuard)
  return router
}

describe('router guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('sends anonymous users from the painel to login with redirect', async () => {
    const router = await createGuardedRouter()

    await router.push('/panel/animals')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/panel/animals')
  })

  it('sends authenticated users away from login', async () => {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ token: 'jwt', username: 'admin' }))
    useAuthStore().hydrate()

    const router = await createGuardedRouter()

    await router.push('/entrar')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('panel-animals')
  })

  it('sends anonymous users from the create page to login with redirect', async () => {
    const router = await createGuardedRouter()

    await router.push('/panel/animals/new')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/panel/animals/new')
  })
})

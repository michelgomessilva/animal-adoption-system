import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, type Pinia } from 'pinia'
import { vi } from 'vitest'
import { createMemoryHistory, createRouter, type RouteRecordRaw, type Router } from 'vue-router'
import type { Component } from 'vue'

import type { Animal } from '@/shared/types/animal'

export function firstFetchRequest(fetchMock: ReturnType<typeof vi.fn<typeof fetch>>): Request {
  const call = fetchMock.mock.calls[0]
  if (call === undefined) {
    throw new Error('Expected fetch to have been called')
  }

  const [input, init] = call
  return input instanceof Request ? input : new Request(input, init)
}

export function createAnimal(overrides: Partial<Animal> = {}): Animal {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Luna',
    sex: 'Female',
    size: 'Medium',
    species: 'Dog',
    approximateAge: 3,
    description: 'Calma',
    image: 'https://picsum.photos/400/300',
    status: 'Available',
    district: 'Centro',
    city: 'Porto Alegre',
    createdAt: '2026-01-15T10:00:00Z',
    ...overrides,
  }
}

export const stubRoutes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: { template: '<div>home</div>' } },
  {
    path: '/animais/:id',
    name: 'animal-details',
    component: { template: '<div>detalhes</div>' },
  },
  { path: '/ongs', name: 'organization', component: { template: '<div>ongs</div>' } },
  { path: '/como-funciona', name: 'how-it-works', component: { template: '<div>how</div>' } },
  { path: '/entrar', name: 'login', component: { template: '<div>login</div>' } },
  { path: '/panel/animals', name: 'panel-animals', component: { template: '<div>painel</div>' } },
  {
    path: '/panel/animals/new',
    name: 'panel-animals-new',
    component: { template: '<div>cadastro</div>' },
  },
  {
    path: '/panel/animals/:id/edit',
    name: 'panel-animals-edit',
    component: { template: '<div>edicao</div>' },
  },
]

export async function createTestRouter(routes: RouteRecordRaw[] = stubRoutes): Promise<Router> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  await router.push('/')
  await router.isReady()
  return router
}

export async function mountWithPlugins(
  component: Component,
  options: { router?: Router; pinia?: Pinia } = {},
): Promise<VueWrapper> {
  const router = options.router ?? (await createTestRouter())
  const pinia = options.pinia ?? createPinia()

  return mount(component, {
    global: {
      plugins: [router, pinia],
    },
  })
}

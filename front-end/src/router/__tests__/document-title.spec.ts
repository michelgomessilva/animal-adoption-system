import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it, vi } from 'vitest'

import { documentTitleFor } from '@/router/document-title'
import { routes } from '@/router/routes'
import type { Animal } from '@/shared/types/animal'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
  createAnimal: vi.fn<() => Promise<never>>(),
  getAnimalById: vi.fn<() => Promise<Animal>>(),
  updateAnimal: vi.fn<() => Promise<never>>(),
}))

describe('documentTitleFor', () => {
  it('uses the brand when the route has no title', () => {
    expect(documentTitleFor(undefined)).toBe('POA')
  })

  it('appends the brand to the page title', () => {
    expect(documentTitleFor('Como funciona')).toBe('Como funciona — POA')
  })
})

describe('document title after navigation', () => {
  it('sets the tab title from route meta', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    router.afterEach((to) => {
      const title = to.meta.title
      document.title = documentTitleFor(typeof title === 'string' ? title : undefined)
    })

    await router.push('/como-funciona')
    await router.isReady()
    expect(document.title).toBe('Como funciona — POA')

    await router.push('/panel/animals')
    expect(document.title).toBe('Meus pets — POA')

    await router.push('/panel/animals/11111111-1111-1111-1111-111111111111/edit')
    expect(document.title).toBe('Editar pet — POA')

    await router.push('/animais/11111111-1111-1111-1111-111111111111')
    expect(document.title).toBe('Detalhes do pet — POA')
  })
})

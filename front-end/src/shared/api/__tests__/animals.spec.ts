import { afterEach, describe, expect, it, vi } from 'vitest'

import { listAnimals } from '@/shared/api/animals'
import { resetHttpClient, setAccessTokenGetter } from '@/shared/api/http'
import { createAnimal } from '@/__tests__/helpers'

const fixture = createAnimal({ description: 'Calma e brincalhona' })

describe('listAnimals', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('returns the animal list from the API', async () => {
    setAccessTokenGetter(() => 'jwt')
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([fixture]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(listAnimals()).resolves.toEqual([fixture])

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:5127/api/animals')
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer jwt')
  })
})

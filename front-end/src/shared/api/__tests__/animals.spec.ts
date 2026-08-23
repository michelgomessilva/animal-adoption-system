import { afterEach, describe, expect, it, vi } from 'vitest'

import { listAnimals } from '@/shared/api/animals'
import { resetHttpClient, setAccessToken } from '@/shared/api/http'
import { createAnimal } from '@/__tests__/helpers'

const fixture = createAnimal({ description: 'Calma e brincalhona' })

describe('listAnimals', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('returns the animal list from the API', async () => {
    setAccessToken('jwt')
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([fixture]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(listAnimals()).resolves.toEqual([fixture])

    const [input, init] = fetchMock.mock.calls[0] as [RequestInfo, RequestInit | undefined]
    const request = input instanceof Request ? input : new Request(input, init)
    expect(new URL(request.url).pathname).toBe('/api/animals')
    expect(request.headers.get('Authorization')).toBe('Bearer jwt')
  })
})

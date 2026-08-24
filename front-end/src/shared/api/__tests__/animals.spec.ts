import { afterEach, describe, expect, it, vi } from 'vitest'

import { createAnimal, listAnimals } from '@/shared/api/animals'
import { resetHttpClient, setAccessToken } from '@/shared/api/http'
import { createAnimal as createAnimalFixture, firstFetchRequest } from '@/__tests__/helpers'

const fixture = createAnimalFixture({ description: 'Calma e brincalhona' })

const createInput = {
  name: 'Rex',
  species: 'Dog' as const,
  sex: 'Male' as const,
  size: 'Medium' as const,
  description: 'Friendly dog',
  approximateAge: 2,
  image: '',
  status: 'Available' as const,
  district: 'Centro',
  city: 'Sao Paulo',
}

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

    const request = firstFetchRequest(fetchMock)
    expect(new URL(request.url).pathname).toBe('/api/animals')
    expect(request.headers.get('Authorization')).toBe('Bearer jwt')
  })
})

describe('createAnimal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('posts the animal and returns the created resource', async () => {
    setAccessToken('jwt')
    let captured: Request | undefined
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      captured = input instanceof Request ? input.clone() : new Request(input, init)
      return new Response(JSON.stringify(fixture), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(createAnimal(createInput)).resolves.toEqual(fixture)

    if (captured === undefined) {
      throw new Error('Expected fetch to have been called')
    }

    expect(captured.method).toBe('POST')
    expect(new URL(captured.url).pathname).toBe('/api/animals')
    expect(captured.headers.get('Authorization')).toBe('Bearer jwt')
    expect(await captured.json()).toEqual(createInput)
  })

  it('propagates unauthorized on 401', async () => {
    setAccessToken('jwt')
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 401 })),
    )

    await expect(createAnimal(createInput)).rejects.toMatchObject({
      code: 'unauthorized',
    })
  })

  it('propagates validation on 400', async () => {
    setAccessToken('jwt')
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Species is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    await expect(createAnimal(createInput)).rejects.toMatchObject({
      code: 'validation',
      message: 'Species is required',
    })
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import { createAnimal, getAnimalById, listAnimals, updateAnimal } from '@/shared/api/animals'
import { resetHttpClient, setAccessToken } from '@/shared/api/http'
import { createAnimal as createAnimalFixture, firstFetchRequest } from '@/__tests__/helpers'

const fixture = createAnimalFixture({ description: 'Calma e brincalhona' })

const writeInput = {
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
    const url = new URL(request.url)
    expect(url.pathname).toBe('/api/animals')
    expect(url.search).toBe('')
    expect(request.headers.get('Authorization')).toBe('Bearer jwt')
  })

  it('sends filter query params when provided', async () => {
    setAccessToken('jwt')
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([fixture]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      listAnimals({ species: 'Dog', status: 'Adopted', orderBy: 'name' }),
    ).resolves.toEqual([fixture])

    const url = new URL(firstFetchRequest(fetchMock).url)
    expect(url.pathname).toBe('/api/animals')
    expect(url.searchParams.get('species')).toBe('Dog')
    expect(url.searchParams.get('status')).toBe('Adopted')
    expect(url.searchParams.get('orderBy')).toBe('name')
    expect(firstFetchRequest(fetchMock).headers.get('Authorization')).toBe('Bearer jwt')
  })

  it('omits searchParams when the query is empty', async () => {
    setAccessToken('jwt')
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await listAnimals({})

    expect(new URL(firstFetchRequest(fetchMock).url).search).toBe('')
  })
})

describe('getAnimalById', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('returns the animal from the API', async () => {
    setAccessToken('jwt')
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(fixture), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(getAnimalById(fixture.id)).resolves.toEqual(fixture)

    const request = firstFetchRequest(fetchMock)
    expect(new URL(request.url).pathname).toBe(`/api/animals/${fixture.id}`)
    expect(request.method).toBe('GET')
    expect(request.headers.get('Authorization')).toBe('Bearer jwt')
  })

  it('propagates not-found on 404', async () => {
    setAccessToken('jwt')
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 404 })),
    )

    await expect(getAnimalById(fixture.id)).rejects.toMatchObject({
      code: 'not-found',
      status: 404,
    })
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

    await expect(createAnimal(writeInput)).resolves.toEqual(fixture)

    if (captured === undefined) {
      throw new Error('Expected fetch to have been called')
    }

    expect(captured.method).toBe('POST')
    expect(new URL(captured.url).pathname).toBe('/api/animals')
    expect(captured.headers.get('Authorization')).toBe('Bearer jwt')
    expect(await captured.json()).toEqual(writeInput)
  })

  it('propagates unauthorized on 401', async () => {
    setAccessToken('jwt')
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 401 })),
    )

    await expect(createAnimal(writeInput)).rejects.toMatchObject({
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

    await expect(createAnimal(writeInput)).rejects.toMatchObject({
      code: 'validation',
      message: 'Species is required',
    })
  })
})

describe('updateAnimal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('puts the animal and returns the updated resource', async () => {
    setAccessToken('jwt')
    let captured: Request | undefined
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      captured = input instanceof Request ? input.clone() : new Request(input, init)
      return new Response(JSON.stringify(fixture), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(updateAnimal(fixture.id, writeInput)).resolves.toEqual(fixture)

    if (captured === undefined) {
      throw new Error('Expected fetch to have been called')
    }

    expect(captured.method).toBe('PUT')
    expect(new URL(captured.url).pathname).toBe(`/api/animals/${fixture.id}`)
    expect(captured.headers.get('Authorization')).toBe('Bearer jwt')
    expect(await captured.json()).toEqual(writeInput)
  })

  it('propagates unauthorized on 401', async () => {
    setAccessToken('jwt')
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 401 })),
    )

    await expect(updateAnimal(fixture.id, writeInput)).rejects.toMatchObject({
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

    await expect(updateAnimal(fixture.id, writeInput)).rejects.toMatchObject({
      code: 'validation',
      message: 'Species is required',
    })
  })
})

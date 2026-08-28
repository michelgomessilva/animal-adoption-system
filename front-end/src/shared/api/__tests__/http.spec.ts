import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import {
  apiRequest,
  resetHttpClient,
  setAccessToken,
  setUnauthorizedHandler,
} from '@/shared/api/http'
import { getApiBaseUrl } from '@/shared/config/api-base-url'
import { firstFetchRequest } from '@/__tests__/helpers'

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('returns parsed JSON on 200', async () => {
    let captured: Request | undefined
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      captured = input instanceof Request ? input.clone() : new Request(input, init)
      return new Response(JSON.stringify({ token: 'abc' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiRequest<{ token: string }>('auth/login', {
      method: 'POST',
      skipAuth: true,
      body: { username: 'admin', password: 'secret' },
    })

    expect(result).toEqual({ token: 'abc' })
    expect(fetchMock).toHaveBeenCalledOnce()
    if (captured === undefined) {
      throw new Error('Expected fetch to have been called')
    }

    expect(new URL(captured.url).pathname).toBe('/auth/login')
    expect(captured.method).toBe('POST')
    expect(await captured.json()).toEqual({ username: 'admin', password: 'secret' })
    expect(captured.headers.get('Authorization')).toBeNull()
  })

  it('sends the bearer token when auth is enabled', async () => {
    setAccessToken('jwt-token')
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('api/animals')

    expect(firstFetchRequest(fetchMock).headers.get('Authorization')).toBe('Bearer jwt-token')
  })

  it('resolves paths against the API base URL', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('api/animals')

    expect(firstFetchRequest(fetchMock).url).toBe(new URL('api/animals', getApiBaseUrl()).href)
  })

  it('appends searchParams to the request URL', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('api/animals', {
      searchParams: { species: 'DOG', status: 'ADOPTED' },
    })

    const url = new URL(firstFetchRequest(fetchMock).url)
    expect(url.pathname).toBe('/api/animals')
    expect(url.searchParams.get('species')).toBe('DOG')
    expect(url.searchParams.get('status')).toBe('ADOPTED')
  })

  it('throws unauthorized without calling the handler when skipAuth is true', async () => {
    const onUnauthorized = vi.fn<() => void>()
    setUnauthorizedHandler(onUnauthorized)
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(JSON.stringify({ message: 'nope' }), { status: 401 })),
    )

    await expect(apiRequest('auth/login', { skipAuth: true })).rejects.toMatchObject({
      code: 'unauthorized',
      status: 401,
    } satisfies Partial<ApiError>)
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('calls the unauthorized handler on 401 when authenticated', async () => {
    const onUnauthorized = vi.fn<() => void>()
    setUnauthorizedHandler(onUnauthorized)
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 401 })),
    )

    await expect(apiRequest('api/animals')).rejects.toMatchObject({
      code: 'unauthorized',
    })
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it('throws validation from a ProblemDetails 400 body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            title: 'One or more validation errors occurred.',
            status: 400,
            errors: { Name: ['The Name field is required.'] },
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    )

    await expect(apiRequest('api/animals', { method: 'POST', body: {} })).rejects.toMatchObject({
      code: 'validation',
      status: 400,
      message: 'The Name field is required.',
      fieldErrors: { name: 'The Name field is required.' },
    } satisfies Partial<ApiError>)
  })

  it('throws validation from a message-only 400 body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Species is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    await expect(apiRequest('api/animals', { method: 'POST', body: {} })).rejects.toMatchObject({
      code: 'validation',
      status: 400,
      message: 'Species is required',
      fieldErrors: {},
    } satisfies Partial<ApiError>)
  })

  it('throws unknown on a 400 without a parseable body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 400 })),
    )

    await expect(apiRequest('api/animals')).rejects.toMatchObject({
      code: 'unknown',
      status: 400,
    })
  })

  it('throws not-found on 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 404 })),
    )

    await expect(
      apiRequest('api/animals/11111111-1111-1111-1111-111111111111'),
    ).rejects.toMatchObject({
      code: 'not-found',
      status: 404,
    } satisfies Partial<ApiError>)
  })

  it('throws unknown on a non-401 error status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 500 })),
    )

    await expect(apiRequest('api/animals')).rejects.toMatchObject({
      code: 'unknown',
      status: 500,
    })
  })

  it('throws network when fetch fails with a TypeError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')),
    )

    await expect(apiRequest('api/animals')).rejects.toMatchObject({
      code: 'network',
      status: 0,
    })
  })

  it('rethrows non-TypeError fetch failures', async () => {
    const abortError = new DOMException('Aborted', 'AbortError')
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValue(abortError))

    await expect(apiRequest('api/animals')).rejects.toBe(abortError)
  })
})

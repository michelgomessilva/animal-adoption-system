import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import {
  apiRequest,
  resetHttpClient,
  setAccessTokenGetter,
  setUnauthorizedHandler,
} from '@/shared/api/http'

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('returns parsed JSON on 200', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ token: 'abc' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiRequest<{ token: string }>('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: { username: 'admin', password: 'secret' },
    })

    expect(result).toEqual({ token: 'abc' })
    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:5127/auth/login')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ username: 'admin', password: 'secret' }))
    expect(new Headers(init.headers).get('Authorization')).toBeNull()
  })

  it('sends the bearer token when auth is enabled', async () => {
    setAccessTokenGetter(() => 'jwt-token')
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/api/animals')

    const headers = new Headers((fetchMock.mock.calls[0] as [string, RequestInit])[1].headers)
    expect(headers.get('Authorization')).toBe('Bearer jwt-token')
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

    await expect(apiRequest('/auth/login', { skipAuth: true })).rejects.toMatchObject({
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

    await expect(apiRequest('/api/animals')).rejects.toMatchObject({
      code: 'unauthorized',
    })
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it('throws bad_request on 400', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 400 })),
    )

    await expect(apiRequest('/api/animals')).rejects.toMatchObject({
      code: 'bad_request',
      status: 400,
    })
  })

  it('throws network when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')),
    )

    await expect(apiRequest('/api/animals')).rejects.toMatchObject({
      code: 'network',
      status: 0,
    })
  })
})

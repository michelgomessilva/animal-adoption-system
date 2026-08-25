import { afterEach, describe, expect, it, vi } from 'vitest'

import { getApiBaseUrl } from '@/shared/config/api-base-url'

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('keeps a trailing slash on the configured base URL', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.org/')

    expect(getApiBaseUrl()).toBe('https://api.example.org/')
  })

  it('appends a trailing slash when the env var omits one', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.org')

    expect(getApiBaseUrl()).toBe('https://api.example.org/')
  })

  it('falls back to the page origin and warns when the env var is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('VITE_API_BASE_URL', undefined)

    expect(getApiBaseUrl()).toBe(`${globalThis.location.origin}/`)
    expect(warn).toHaveBeenCalledOnce()
  })

  it.each(['', '   '])('falls back to the page origin when VITE_API_BASE_URL is %j', (value) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('VITE_API_BASE_URL', value)

    expect(getApiBaseUrl()).toBe(`${globalThis.location.origin}/`)
    expect(warn).toHaveBeenCalledOnce()
  })
})

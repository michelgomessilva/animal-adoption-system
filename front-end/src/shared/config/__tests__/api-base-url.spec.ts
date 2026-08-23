import { afterEach, describe, expect, it, vi } from 'vitest'

import { getApiBaseUrl } from '@/shared/config/api-base-url'

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the configured base URL without a trailing slash', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.org/')

    expect(getApiBaseUrl()).toBe('https://api.example.org')
  })

  it('returns an empty string when the env var is missing', () => {
    expect(getApiBaseUrl()).toBe('')
  })

  it.each(['', '   '])('returns an empty string when VITE_API_BASE_URL is %j', (value) => {
    vi.stubEnv('VITE_API_BASE_URL', value)

    expect(getApiBaseUrl()).toBe('')
  })
})

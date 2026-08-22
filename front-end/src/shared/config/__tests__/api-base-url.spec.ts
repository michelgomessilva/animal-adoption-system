import { afterEach, describe, expect, it, vi } from 'vitest'

import { getApiBaseUrl } from '@/shared/config/api-base-url'

describe('getApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the configured base URL without a trailing slash', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5127/')

    expect(getApiBaseUrl()).toBe('http://localhost:5127')
  })

  it.each(['', '   '])('throws when VITE_API_BASE_URL is %j', (value) => {
    vi.stubEnv('VITE_API_BASE_URL', value)

    expect(() => getApiBaseUrl()).toThrow('VITE_API_BASE_URL is not configured')
  })
})

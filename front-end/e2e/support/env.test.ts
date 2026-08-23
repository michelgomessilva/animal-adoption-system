import { afterEach, describe, expect, it, vi } from 'vitest'

import { requireE2eCredentials } from './env'

describe('requireE2eCredentials', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws when either credential is missing', () => {
    vi.stubEnv('E2E_USERNAME', '')
    vi.stubEnv('E2E_PASSWORD', '')

    expect(() => requireE2eCredentials()).toThrow(/e2e\/README.md/)
  })

  it('returns the username and password when both are set', () => {
    vi.stubEnv('E2E_USERNAME', 'ong-admin')
    vi.stubEnv('E2E_PASSWORD', 'secret')

    expect(requireE2eCredentials()).toEqual({
      username: 'ong-admin',
      password: 'secret',
    })
  })
})

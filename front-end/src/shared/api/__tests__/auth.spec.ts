import { afterEach, describe, expect, it, vi } from 'vitest'

import { login } from '@/shared/api/auth'
import { resetHttpClient } from '@/shared/api/http'

describe('login', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetHttpClient()
  })

  it('returns the token on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ token: 'jwt' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    await expect(login('admin', 'secret')).resolves.toEqual({ token: 'jwt' })
  })

  it('propagates unauthorized on 401', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 401 })),
    )

    await expect(login('admin', 'wrong')).rejects.toMatchObject({
      code: 'unauthorized',
    })
  })
})

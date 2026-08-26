import { afterEach, describe, expect, it, vi } from 'vitest'

import { isStaleChunkError, reloadIfStaleChunk } from '@/router/stale-chunk'

describe('stale chunk errors', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detects failed dynamic imports', () => {
    expect(
      isStaleChunkError(new TypeError('Failed to fetch dynamically imported module: /panel.js')),
    ).toBe(true)
    expect(isStaleChunkError(new Error('Importing a module script failed.'))).toBe(true)
    expect(isStaleChunkError(new Error('error loading dynamically imported module'))).toBe(true)
  })

  it('ignores unrelated errors', () => {
    expect(isStaleChunkError(new Error('Navigation cancelled'))).toBe(false)
    expect(isStaleChunkError('Failed to fetch dynamically imported module')).toBe(false)
  })

  it('reloads the page when a panel chunk is stale', () => {
    const reload = vi.fn<() => void>()
    vi.stubGlobal('location', { reload })

    reloadIfStaleChunk(new TypeError('Failed to fetch dynamically imported module: /panel.js'))

    expect(reload).toHaveBeenCalledOnce()
  })
})

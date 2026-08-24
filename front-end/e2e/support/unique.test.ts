import { describe, expect, it } from 'vitest'

import { uniqueAnimalName } from './unique'

describe('uniqueAnimalName', () => {
  it('returns a 12-character e2e-prefixed identifier within the name limit', () => {
    const name = uniqueAnimalName()

    expect(name).toMatch(/^e2e-[a-z0-9]{8}$/)
    expect(name.length).toBeLessThanOrEqual(20)
  })

  it('returns a different value on each call', () => {
    expect(uniqueAnimalName()).not.toBe(uniqueAnimalName())
  })
})

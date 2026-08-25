import { describe, expect, it } from 'vitest'

import { isAnimalId, toAnimalWriteInput } from '@/shared/types/animal'
import { createAnimal as createAnimalFixture } from '@/__tests__/helpers'

describe('isAnimalId', () => {
  it('accepts a .NET GUID string', () => {
    expect(isAnimalId('11111111-1111-1111-1111-111111111111')).toBe(true)
  })

  it('rejects non-GUID route segments', () => {
    expect(isAnimalId('new')).toBe(false)
    expect(isAnimalId('')).toBe(false)
  })
})

describe('toAnimalWriteInput', () => {
  it('copies write fields and omits id and createdAt', () => {
    const fixture = createAnimalFixture({ description: 'Calma e brincalhona' })

    expect(toAnimalWriteInput(fixture)).toEqual({
      name: fixture.name,
      species: fixture.species,
      sex: fixture.sex,
      size: fixture.size,
      description: fixture.description,
      approximateAge: fixture.approximateAge,
      image: fixture.image,
      status: fixture.status,
      district: fixture.district,
      city: fixture.city,
    })
    expect(toAnimalWriteInput(fixture)).not.toHaveProperty('id')
    expect(toAnimalWriteInput(fixture)).not.toHaveProperty('createdAt')
  })
})

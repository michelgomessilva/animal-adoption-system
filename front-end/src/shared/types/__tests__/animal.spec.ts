import { describe, expect, it } from 'vitest'

import {
  animalListQueryIsEmpty,
  isAnimalId,
  isAnimalSex,
  isAnimalSize,
  isAnimalSpecies,
  isAnimalStatus,
  parseAnimalListQuery,
  toAnimalListSearchParams,
  toAnimalWriteInput,
} from '@/shared/types/animal'
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

describe('enum type guards', () => {
  it('accepts canonical enum values', () => {
    expect(isAnimalSpecies('Dog')).toBe(true)
    expect(isAnimalSex('Female')).toBe(true)
    expect(isAnimalSize('Medium')).toBe(true)
    expect(isAnimalStatus('Adopted')).toBe(true)
  })

  it('rejects unknown and wrong-case values', () => {
    expect(isAnimalSpecies('Elephant')).toBe(false)
    expect(isAnimalSpecies('dog')).toBe(false)
    expect(isAnimalSex('Other')).toBe(false)
    expect(isAnimalSize('Tiny')).toBe(false)
    expect(isAnimalStatus('Pending')).toBe(false)
  })
})

describe('parseAnimalListQuery / toAnimalListSearchParams', () => {
  it('round-trips a full valid query', () => {
    const query = {
      species: 'Dog' as const,
      sex: 'Male' as const,
      size: 'Small' as const,
      status: 'Adopted' as const,
    }

    expect(parseAnimalListQuery(toAnimalListSearchParams(query))).toEqual(query)
  })

  it('normalizes case-insensitive enum values to canonical casing', () => {
    expect(parseAnimalListQuery({ species: 'cat', status: 'available' })).toEqual({
      species: 'Cat',
      status: 'Available',
    })
  })

  it('discards invalid, empty, and unknown values', () => {
    expect(parseAnimalListQuery({ species: 'Elephant' })).toEqual({})
    expect(parseAnimalListQuery({ species: '' })).toEqual({})
    expect(parseAnimalListQuery({ species: 'Dog', size: 'Tiny' })).toEqual({ species: 'Dog' })
  })

  it('uses the first string when a key is an array', () => {
    expect(parseAnimalListQuery({ species: ['Dog', 'Cat'] })).toEqual({ species: 'Dog' })
  })

  it('omits undefined keys from search params', () => {
    expect(toAnimalListSearchParams({ species: 'Dog' })).toEqual({ species: 'Dog' })
    expect(toAnimalListSearchParams({})).toEqual({})
  })
})

describe('animalListQueryIsEmpty', () => {
  it('is true only when every filter key is absent', () => {
    expect(animalListQueryIsEmpty({})).toBe(true)
    expect(animalListQueryIsEmpty({ species: 'Dog' })).toBe(false)
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

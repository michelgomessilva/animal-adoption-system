import { describe, expect, it } from 'vitest'

import {
  AnimalOrderBy,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
  animalListHasNarrowingFilters,
  animalListQueryIsEmpty,
  canonicalAnimalSex,
  canonicalAnimalSize,
  canonicalAnimalSpecies,
  canonicalAnimalStatus,
  isAnimalId,
  isAnimalOrderBy,
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
  it('accepts exact wire enum values', () => {
    expect(isAnimalSpecies(AnimalSpecies.Dog)).toBe(true)
    expect(isAnimalSex(AnimalSex.Female)).toBe(true)
    expect(isAnimalSize(AnimalSize.Medium)).toBe(true)
    expect(isAnimalStatus(AnimalStatus.Adopted)).toBe(true)
    expect(isAnimalStatus(AnimalStatus.InAdoptionProcess)).toBe(true)
    expect(isAnimalOrderBy(AnimalOrderBy.CreatedAtDesc)).toBe(true)
  })

  it('rejects unknown and wrong-case values', () => {
    expect(isAnimalSpecies('Elephant')).toBe(false)
    expect(isAnimalSpecies('Dog')).toBe(false)
    expect(isAnimalSpecies('dog')).toBe(false)
    expect(isAnimalSex('Other')).toBe(false)
    expect(isAnimalSize('Tiny')).toBe(false)
    expect(isAnimalStatus('Pending')).toBe(false)
    expect(isAnimalStatus('Available')).toBe(false)
    expect(isAnimalOrderBy('bogus')).toBe(false)
    expect(isAnimalOrderBy('createdat_desc')).toBe(false)
  })
})

describe('canonical enum parsers', () => {
  it('accepts exact product wire values', () => {
    expect(canonicalAnimalSpecies(AnimalSpecies.Dog)).toBe(AnimalSpecies.Dog)
    expect(canonicalAnimalSex(AnimalSex.Female)).toBe(AnimalSex.Female)
    expect(canonicalAnimalSize(AnimalSize.Medium)).toBe(AnimalSize.Medium)
    expect(canonicalAnimalStatus(AnimalStatus.Available)).toBe(AnimalStatus.Available)
    expect(canonicalAnimalStatus(AnimalStatus.InAdoptionProcess)).toBe(
      AnimalStatus.InAdoptionProcess,
    )
  })

  it('rejects wrong case, None, empty, numbers, and unknown strings', () => {
    expect(canonicalAnimalSpecies('Dog')).toBeNull()
    expect(canonicalAnimalSpecies('dog')).toBeNull()
    expect(canonicalAnimalSpecies('NONE')).toBeNull()
    expect(canonicalAnimalSpecies('None')).toBeNull()
    expect(canonicalAnimalSpecies('')).toBeNull()
    expect(canonicalAnimalSpecies(3)).toBeNull()
    expect(canonicalAnimalSex(3)).toBeNull()
    expect(canonicalAnimalSize(4)).toBeNull()
    expect(canonicalAnimalStatus(3)).toBeNull()
    expect(canonicalAnimalStatus('None')).toBeNull()
    expect(canonicalAnimalStatus('available')).toBeNull()
    expect(canonicalAnimalSpecies(null)).toBeNull()
    expect(canonicalAnimalSpecies(undefined)).toBeNull()
  })
})

describe('parseAnimalListQuery / toAnimalListSearchParams', () => {
  it('round-trips a full valid query', () => {
    const query = {
      species: AnimalSpecies.Dog,
      sex: AnimalSex.Male,
      size: AnimalSize.Small,
      status: AnimalStatus.Adopted,
      orderBy: AnimalOrderBy.Name,
    }

    expect(parseAnimalListQuery(toAnimalListSearchParams(query))).toEqual(query)
  })

  it('keeps exact wire enum and orderBy values', () => {
    expect(
      parseAnimalListQuery({
        species: AnimalSpecies.Cat,
        status: AnimalStatus.Available,
        orderBy: AnimalOrderBy.CreatedAtDesc,
      }),
    ).toEqual({
      species: AnimalSpecies.Cat,
      status: AnimalStatus.Available,
      orderBy: AnimalOrderBy.CreatedAtDesc,
    })
  })

  it('discards invalid, empty, wrong-case, and unknown values', () => {
    expect(parseAnimalListQuery({ species: 'Elephant' })).toEqual({})
    expect(parseAnimalListQuery({ species: '' })).toEqual({})
    expect(parseAnimalListQuery({ species: 'Dog' })).toEqual({})
    expect(parseAnimalListQuery({ species: AnimalSpecies.Dog, size: 'Tiny' })).toEqual({
      species: AnimalSpecies.Dog,
    })
    expect(parseAnimalListQuery({ orderBy: 'bogus' })).toEqual({})
    expect(parseAnimalListQuery({ orderBy: 'createdat_desc' })).toEqual({})
  })

  it('uses the first string when a key is an array', () => {
    expect(parseAnimalListQuery({ species: [AnimalSpecies.Dog, AnimalSpecies.Cat] })).toEqual({
      species: AnimalSpecies.Dog,
    })
  })

  it('omits undefined keys from search params', () => {
    expect(
      toAnimalListSearchParams({
        species: AnimalSpecies.Dog,
        orderBy: AnimalOrderBy.NameDesc,
      }),
    ).toEqual({
      species: AnimalSpecies.Dog,
      orderBy: AnimalOrderBy.NameDesc,
    })
    expect(toAnimalListSearchParams({})).toEqual({})
  })
})

describe('animalListQueryIsEmpty', () => {
  it('is true only when every query key is absent', () => {
    expect(animalListQueryIsEmpty({})).toBe(true)
    expect(animalListQueryIsEmpty({ species: AnimalSpecies.Dog })).toBe(false)
    expect(animalListQueryIsEmpty({ orderBy: AnimalOrderBy.Name })).toBe(false)
  })
})

describe('animalListHasNarrowingFilters', () => {
  it('ignores orderBy and tracks only filter dimensions', () => {
    expect(animalListHasNarrowingFilters({})).toBe(false)
    expect(animalListHasNarrowingFilters({ orderBy: AnimalOrderBy.Name })).toBe(false)
    expect(animalListHasNarrowingFilters({ species: AnimalSpecies.Dog })).toBe(true)
    expect(
      animalListHasNarrowingFilters({
        status: AnimalStatus.Adopted,
        orderBy: AnimalOrderBy.Name,
      }),
    ).toBe(true)
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
      parish: fixture.parish,
      city: fixture.city,
    })
    expect(toAnimalWriteInput(fixture)).not.toHaveProperty('id')
    expect(toAnimalWriteInput(fixture)).not.toHaveProperty('createdAt')
  })
})

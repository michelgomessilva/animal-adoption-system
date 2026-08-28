export const AnimalSpecies = {
  Dog: 'DOG',
  Cat: 'CAT',
} as const
export type AnimalSpecies = (typeof AnimalSpecies)[keyof typeof AnimalSpecies]

export const AnimalSex = {
  Male: 'MALE',
  Female: 'FEMALE',
} as const
export type AnimalSex = (typeof AnimalSex)[keyof typeof AnimalSex]

export const AnimalSize = {
  Small: 'SMALL',
  Medium: 'MEDIUM',
  Large: 'LARGE',
} as const
export type AnimalSize = (typeof AnimalSize)[keyof typeof AnimalSize]

export const AnimalStatus = {
  Available: 'AVAILABLE',
  InAdoptionProcess: 'IN_ADOPTION_PROCESS',
  Adopted: 'ADOPTED',
} as const
export type AnimalStatus = (typeof AnimalStatus)[keyof typeof AnimalStatus]

export const AnimalOrderBy = {
  Name: 'name',
  NameDesc: 'name_desc',
  Species: 'species',
  SpeciesDesc: 'species_desc',
  Size: 'size',
  SizeDesc: 'size_desc',
  CreatedAt: 'createdAt',
  CreatedAtDesc: 'createdAt_desc',
} as const
export type AnimalOrderBy = (typeof AnimalOrderBy)[keyof typeof AnimalOrderBy]

function valuesOf<T extends Record<string, string>>(enumObject: T): readonly T[keyof T][] {
  return Object.values(enumObject) as T[keyof T][]
}

export const ANIMAL_SPECIES_OPTIONS = valuesOf(AnimalSpecies)
export const ANIMAL_SEX_OPTIONS = valuesOf(AnimalSex)
export const ANIMAL_SIZE_OPTIONS = valuesOf(AnimalSize)
export const ANIMAL_STATUS_OPTIONS = valuesOf(AnimalStatus)
export const ANIMAL_ORDER_BY_OPTIONS = valuesOf(AnimalOrderBy)

const ANIMAL_ID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

export function isAnimalId(value: string): boolean {
  return ANIMAL_ID_PATTERN.test(value)
}

export function isAnimalSpecies(value: string): value is AnimalSpecies {
  return (ANIMAL_SPECIES_OPTIONS as readonly string[]).includes(value)
}

export function isAnimalSex(value: string): value is AnimalSex {
  return (ANIMAL_SEX_OPTIONS as readonly string[]).includes(value)
}

export function isAnimalSize(value: string): value is AnimalSize {
  return (ANIMAL_SIZE_OPTIONS as readonly string[]).includes(value)
}

export function isAnimalStatus(value: string): value is AnimalStatus {
  return (ANIMAL_STATUS_OPTIONS as readonly string[]).includes(value)
}

export function isAnimalOrderBy(value: string): value is AnimalOrderBy {
  return (ANIMAL_ORDER_BY_OPTIONS as readonly string[]).includes(value)
}

function canonicalEnumValue<T extends string>(
  value: unknown,
  isMember: (value: string) => value is T,
): T | null {
  if (typeof value !== 'string' || value.length === 0) {
    return null
  }

  return isMember(value) ? value : null
}

export function canonicalAnimalSpecies(value: unknown): AnimalSpecies | null {
  return canonicalEnumValue(value, isAnimalSpecies)
}

export function canonicalAnimalSex(value: unknown): AnimalSex | null {
  return canonicalEnumValue(value, isAnimalSex)
}

export function canonicalAnimalSize(value: unknown): AnimalSize | null {
  return canonicalEnumValue(value, isAnimalSize)
}

export function canonicalAnimalStatus(value: unknown): AnimalStatus | null {
  return canonicalEnumValue(value, isAnimalStatus)
}

export interface AnimalListQuery {
  species?: AnimalSpecies
  sex?: AnimalSex
  size?: AnimalSize
  status?: AnimalStatus
  orderBy?: AnimalOrderBy
}

function firstQueryString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return undefined
}

function parseEnumQueryValue<T extends string>(
  raw: unknown,
  isMember: (value: string) => value is T,
): T | undefined {
  const text = firstQueryString(raw)
  if (text === undefined) {
    return undefined
  }

  return canonicalEnumValue(text, isMember) ?? undefined
}

export function parseAnimalListQuery(query: Record<string, unknown>): AnimalListQuery {
  const result: AnimalListQuery = {}

  const species = parseEnumQueryValue(query.species, isAnimalSpecies)
  if (species !== undefined) {
    result.species = species
  }

  const sex = parseEnumQueryValue(query.sex, isAnimalSex)
  if (sex !== undefined) {
    result.sex = sex
  }

  const size = parseEnumQueryValue(query.size, isAnimalSize)
  if (size !== undefined) {
    result.size = size
  }

  const status = parseEnumQueryValue(query.status, isAnimalStatus)
  if (status !== undefined) {
    result.status = status
  }

  const orderBy = parseEnumQueryValue(query.orderBy, isAnimalOrderBy)
  if (orderBy !== undefined) {
    result.orderBy = orderBy
  }

  return result
}

export function toAnimalListSearchParams(query: AnimalListQuery): Record<string, string> {
  const params: Record<string, string> = {}

  if (query.species !== undefined) {
    params.species = query.species
  }
  if (query.sex !== undefined) {
    params.sex = query.sex
  }
  if (query.size !== undefined) {
    params.size = query.size
  }
  if (query.status !== undefined) {
    params.status = query.status
  }
  if (query.orderBy !== undefined) {
    params.orderBy = query.orderBy
  }

  return params
}

export function animalListQueryIsEmpty(query: AnimalListQuery): boolean {
  return Object.keys(toAnimalListSearchParams(query)).length === 0
}

export function animalListHasNarrowingFilters(query: AnimalListQuery): boolean {
  return (
    query.species !== undefined ||
    query.sex !== undefined ||
    query.size !== undefined ||
    query.status !== undefined
  )
}

export interface AnimalWriteInput {
  name: string
  species: AnimalSpecies
  sex: AnimalSex
  size: AnimalSize
  description: string
  approximateAge: number
  image: string
  status: AnimalStatus
  district: string
  parish: string
  city: string
}

export interface Animal {
  id: string
  name: string
  sex: AnimalSex
  size: AnimalSize
  species: AnimalSpecies
  approximateAge: number
  description: string
  image: string
  status: AnimalStatus
  district: string
  parish: string
  city: string
  createdAt: string
}

export function toAnimalWriteInput(animal: Animal): AnimalWriteInput {
  return {
    name: animal.name,
    species: animal.species,
    sex: animal.sex,
    size: animal.size,
    description: animal.description,
    approximateAge: animal.approximateAge,
    image: animal.image,
    status: animal.status,
    district: animal.district,
    parish: animal.parish,
    city: animal.city,
  }
}

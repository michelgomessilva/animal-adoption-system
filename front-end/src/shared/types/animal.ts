export type AnimalSpecies = 'Dog' | 'Cat'
export type AnimalSex = 'Male' | 'Female'
export type AnimalSize = 'Small' | 'Medium' | 'Large'
export type AnimalStatus = 'Available' | 'Adopted'
export type AnimalOrderBy =
  | 'name'
  | 'name_desc'
  | 'species'
  | 'species_desc'
  | 'size'
  | 'size_desc'
  | 'createdAt'
  | 'createdAt_desc'

export const ANIMAL_SPECIES_OPTIONS = ['Dog', 'Cat'] as const satisfies readonly AnimalSpecies[]
export const ANIMAL_SEX_OPTIONS = ['Male', 'Female'] as const satisfies readonly AnimalSex[]
export const ANIMAL_SIZE_OPTIONS = [
  'Small',
  'Medium',
  'Large',
] as const satisfies readonly AnimalSize[]
export const ANIMAL_STATUS_OPTIONS = [
  'Available',
  'Adopted',
] as const satisfies readonly AnimalStatus[]
export const ANIMAL_ORDER_BY_OPTIONS = [
  'name',
  'name_desc',
  'species',
  'species_desc',
  'size',
  'size_desc',
  'createdAt',
  'createdAt_desc',
] as const satisfies readonly AnimalOrderBy[]

const ANIMAL_ID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

export function isAnimalId(value: string): boolean {
  return ANIMAL_ID_PATTERN.test(value)
}

function matchesOptionIgnoreCase<T extends string>(
  value: string,
  options: readonly T[],
): T | undefined {
  const normalized = value.toLowerCase()
  return options.find((option) => option.toLowerCase() === normalized)
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

function parseEnumQueryValue<T extends string>(raw: unknown, options: readonly T[]): T | undefined {
  const text = firstQueryString(raw)
  if (text === undefined || text.length === 0) {
    return undefined
  }

  return matchesOptionIgnoreCase(text, options)
}

export function parseAnimalListQuery(query: Record<string, unknown>): AnimalListQuery {
  const result: AnimalListQuery = {}

  const species = parseEnumQueryValue(query.species, ANIMAL_SPECIES_OPTIONS)
  if (species !== undefined) {
    result.species = species
  }

  const sex = parseEnumQueryValue(query.sex, ANIMAL_SEX_OPTIONS)
  if (sex !== undefined) {
    result.sex = sex
  }

  const size = parseEnumQueryValue(query.size, ANIMAL_SIZE_OPTIONS)
  if (size !== undefined) {
    result.size = size
  }

  const status = parseEnumQueryValue(query.status, ANIMAL_STATUS_OPTIONS)
  if (status !== undefined) {
    result.status = status
  }

  const orderBy = parseEnumQueryValue(query.orderBy, ANIMAL_ORDER_BY_OPTIONS)
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
    city: animal.city,
  }
}

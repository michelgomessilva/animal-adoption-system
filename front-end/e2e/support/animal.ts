import {
  ANIMAL_SEX_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  ANIMAL_SPECIES_OPTIONS,
  ANIMAL_STATUS_OPTIONS,
  type AnimalWriteInput,
} from '../../src/shared/types/animal'
import {
  animalSexLabel,
  animalSizeLabel,
  animalSpeciesLabel,
  animalStatusLabel,
} from '../../src/shared/types/animal-labels'

import { faker } from './faker'

/** Mirrors the wizard limits in `useAnimalFormWizard` without importing Vue into E2E. */
const NAME_MAX = 20
const AGE_MAX = 30
const LOCATION_MAX = 30
const NAME_SUFFIX_LENGTH = 4

const TRAITS = [
  'carinhoso',
  'brincalhão',
  'calmo',
  'dócil',
  'sociável',
  'independente',
  'curioso',
  'protetor',
] as const

const HABITS = [
  'Convive bem com crianças',
  'Já está vacinado e vermifugado',
  'Gosta de passear',
  'Prefere ambientes tranquilos',
  'Adora colo e companhia',
  'Vai bem em apartamento',
  'Se dá bem com outros pets',
] as const

export const CATALOG_FILTER_KEYS = ['species', 'sex', 'size'] as const
export const PANEL_FILTER_KEYS = ['species', 'sex', 'size', 'status'] as const

type FilterKey = (typeof PANEL_FILTER_KEYS)[number]

const FILTER_OPTIONS = {
  species: ANIMAL_SPECIES_OPTIONS,
  sex: ANIMAL_SEX_OPTIONS,
  size: ANIMAL_SIZE_OPTIONS,
  status: ANIMAL_STATUS_OPTIONS,
} as const

interface FilterContrast<K extends FilterKey> {
  key: K
  included: AnimalWriteInput[K]
  excluded: AnimalWriteInput[K]
}

function fit(value: string, max: number, fallback: string): string {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return fallback
  }

  if (trimmed.length <= max) {
    return trimmed
  }

  return trimmed.slice(0, max).trim()
}

export function uniqueAnimalName(): string {
  const suffix = faker.string.numeric(NAME_SUFFIX_LENGTH)
  const budget = NAME_MAX - NAME_SUFFIX_LENGTH - 1
  const base = fit(faker.person.firstName(), budget, 'Pet')
  return `${base} ${suffix}`
}

function randomDescription(): string {
  const traits = faker.helpers.arrayElements([...TRAITS], 2)
  const first = traits[0]
  const second = traits[1]
  if (first === undefined || second === undefined) {
    throw new Error('Expected two traits for the description')
  }

  const habit = faker.helpers.arrayElement(HABITS)
  return `${first.charAt(0).toUpperCase()}${first.slice(1)} e ${second}. ${habit}.`
}

export function randomAnimalInput(overrides: Partial<AnimalWriteInput> = {}): AnimalWriteInput {
  return {
    name: uniqueAnimalName(),
    species: faker.helpers.arrayElement(ANIMAL_SPECIES_OPTIONS),
    sex: faker.helpers.arrayElement(ANIMAL_SEX_OPTIONS),
    size: faker.helpers.arrayElement(ANIMAL_SIZE_OPTIONS),
    description: randomDescription(),
    approximateAge: faker.number.int({ min: 0, max: AGE_MAX }),
    image: '',
    status: 'Available',
    district: fit(faker.location.street(), LOCATION_MAX, 'Centro'),
    city: fit(faker.location.city(), LOCATION_MAX, 'Porto Alegre'),
    ...overrides,
  }
}

export function randomFilterContrast<K extends FilterKey>(keys: readonly K[]): FilterContrast<K> {
  const key = faker.helpers.arrayElement(keys)
  const options = FILTER_OPTIONS[key]
  const pair = faker.helpers.arrayElements([...options], 2)
  const included = pair[0]
  const excluded = pair[1]
  if (included === undefined || excluded === undefined) {
    throw new Error('Expected two contrasting filter values')
  }

  return { key, included, excluded } as FilterContrast<K>
}

export function filterLabel(key: FilterKey, value: AnimalWriteInput[FilterKey]): string {
  switch (key) {
    case 'species':
      return animalSpeciesLabel[value as AnimalWriteInput['species']]
    case 'sex':
      return animalSexLabel[value as AnimalWriteInput['sex']]
    case 'size':
      return animalSizeLabel[value as AnimalWriteInput['size']]
    case 'status':
      return animalStatusLabel[value as AnimalWriteInput['status']]
  }
}

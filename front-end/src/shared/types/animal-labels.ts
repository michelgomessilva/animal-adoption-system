import {
  canonicalAnimalSex,
  canonicalAnimalSize,
  canonicalAnimalSpecies,
  canonicalAnimalStatus,
  type AnimalOrderBy,
  type AnimalSex,
  type AnimalSize,
  type AnimalSpecies,
  type AnimalStatus,
} from '@/shared/types/animal'

const UNKNOWN_LABEL = 'Não informado'

const SPECIES_LABELS = {
  Dog: 'Cachorro',
  Cat: 'Gato',
} as const satisfies Record<AnimalSpecies, string>

const SIZE_LABELS = {
  Small: 'Pequeno',
  Medium: 'Médio',
  Large: 'Grande',
} as const satisfies Record<AnimalSize, string>

const SEX_LABELS = {
  Male: 'Macho',
  Female: 'Fêmea',
} as const satisfies Record<AnimalSex, string>

const STATUS_LABELS = {
  Available: 'Disponível',
  Adopted: 'Adotado',
} as const satisfies Record<AnimalStatus, string>

function labelFromCanonical<T extends string>(
  value: unknown,
  canonicalize: (value: unknown) => T | null,
  labels: Record<T, string>,
): string {
  const canonical = canonicalize(value)
  return canonical === null ? UNKNOWN_LABEL : labels[canonical]
}

export function animalSpeciesLabel(value: unknown): string {
  return labelFromCanonical(value, canonicalAnimalSpecies, SPECIES_LABELS)
}

export function animalSizeLabel(value: unknown): string {
  return labelFromCanonical(value, canonicalAnimalSize, SIZE_LABELS)
}

export function animalSexLabel(value: unknown): string {
  return labelFromCanonical(value, canonicalAnimalSex, SEX_LABELS)
}

export function animalStatusLabel(value: unknown): string {
  return labelFromCanonical(value, canonicalAnimalStatus, STATUS_LABELS)
}

export const animalOrderByLabel: Record<AnimalOrderBy, string> = {
  name: 'Nome (A–Z)',
  name_desc: 'Nome (Z–A)',
  species: 'Espécie (A–Z)',
  species_desc: 'Espécie (Z–A)',
  size: 'Porte (crescente)',
  size_desc: 'Porte (decrescente)',
  createdAt: 'Mais antigos',
  createdAt_desc: 'Mais recentes',
}

export function animalAgeLabel(age: unknown): string {
  if (typeof age !== 'number' || !Number.isInteger(age)) {
    return UNKNOWN_LABEL
  }

  return age === 1 ? '1 ano' : `${String(age)} anos`
}

export function animalNameLabel(name: string): string {
  const trimmed = name.trim()
  return trimmed.length === 0 ? 'Sem nome' : trimmed
}

export function animalLocationLabel(district: string, city: string): string {
  const trimmedDistrict = district.trim()
  const trimmedCity = city.trim()

  if (trimmedDistrict.length === 0) {
    return trimmedCity
  }

  if (trimmedCity.length === 0) {
    return trimmedDistrict
  }

  return `${trimmedDistrict}, ${trimmedCity}`
}

const RELATIVE_TIME = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'always' })

const RELATIVE_DIVISIONS: ReadonlyArray<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
]

export function formatAnimalPublishedAt(iso: string, now: Date = new Date()): string {
  const published = new Date(iso)
  if (Number.isNaN(published.getTime())) {
    return ''
  }

  const durationSeconds = Math.min(0, (published.getTime() - now.getTime()) / 1000)
  if (durationSeconds === 0) {
    return 'publicado agora'
  }

  let duration = durationSeconds
  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return `publicado ${RELATIVE_TIME.format(Math.round(duration), division.unit)}`
    }
    duration /= division.amount
  }

  return `publicado ${RELATIVE_TIME.format(Math.round(duration), 'year')}`
}

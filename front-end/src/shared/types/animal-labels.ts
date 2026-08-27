import {
  AnimalOrderBy,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
  canonicalAnimalSex,
  canonicalAnimalSize,
  canonicalAnimalSpecies,
  canonicalAnimalStatus,
} from '@/shared/types/animal'

const UNKNOWN_LABEL = 'Não informado'

const SPECIES_LABELS = {
  [AnimalSpecies.Dog]: 'Cachorro',
  [AnimalSpecies.Cat]: 'Gato',
} as const satisfies Record<AnimalSpecies, string>

const SIZE_LABELS = {
  [AnimalSize.Small]: 'Pequeno',
  [AnimalSize.Medium]: 'Médio',
  [AnimalSize.Large]: 'Grande',
} as const satisfies Record<AnimalSize, string>

const SEX_LABELS = {
  [AnimalSex.Male]: 'Macho',
  [AnimalSex.Female]: 'Fêmea',
} as const satisfies Record<AnimalSex, string>

const STATUS_LABELS = {
  [AnimalStatus.Available]: 'Disponível',
  [AnimalStatus.InAdoptionProcess]: 'Em processo de adoção',
  [AnimalStatus.Adopted]: 'Adotado',
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
  [AnimalOrderBy.Name]: 'Nome (A–Z)',
  [AnimalOrderBy.NameDesc]: 'Nome (Z–A)',
  [AnimalOrderBy.Species]: 'Espécie (A–Z)',
  [AnimalOrderBy.SpeciesDesc]: 'Espécie (Z–A)',
  [AnimalOrderBy.Size]: 'Porte (crescente)',
  [AnimalOrderBy.SizeDesc]: 'Porte (decrescente)',
  [AnimalOrderBy.CreatedAt]: 'Mais antigos',
  [AnimalOrderBy.CreatedAtDesc]: 'Mais recentes',
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

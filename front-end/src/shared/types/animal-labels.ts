import type {
  AnimalOrderBy,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '@/shared/types/animal'

export const animalSpeciesLabel: Record<AnimalSpecies, string> = {
  Dog: 'Cachorro',
  Cat: 'Gato',
}

export const animalSizeLabel: Record<AnimalSize, string> = {
  Small: 'Pequeno',
  Medium: 'Médio',
  Large: 'Grande',
}

export const animalSexLabel: Record<AnimalSex, string> = {
  Male: 'Macho',
  Female: 'Fêmea',
}

export const animalStatusLabel: Record<AnimalStatus, string> = {
  Available: 'Disponível',
  Adopted: 'Adotado',
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

export function animalAgeLabel(age: number): string {
  return age === 1 ? '1 ano' : `${String(age)} anos`
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

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

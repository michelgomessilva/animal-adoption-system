import type { AnimalSex, AnimalSize, AnimalSpecies, AnimalStatus } from '@/shared/types/animal'

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

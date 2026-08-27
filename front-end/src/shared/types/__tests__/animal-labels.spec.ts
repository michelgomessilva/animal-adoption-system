import { describe, expect, it } from 'vitest'

import {
  animalAgeLabel,
  animalLocationLabel,
  animalNameLabel,
  animalSexLabel,
  animalSizeLabel,
  animalSpeciesLabel,
  animalStatusLabel,
  formatAnimalPublishedAt,
} from '@/shared/types/animal-labels'
import { AnimalSex, AnimalSize, AnimalSpecies, AnimalStatus } from '@/shared/types/animal'

describe('animal enum labels', () => {
  it('maps canonical product wire values', () => {
    expect(animalSpeciesLabel(AnimalSpecies.Dog)).toBe('Cachorro')
    expect(animalSpeciesLabel(AnimalSpecies.Cat)).toBe('Gato')
    expect(animalSexLabel(AnimalSex.Female)).toBe('Fêmea')
    expect(animalSizeLabel(AnimalSize.Medium)).toBe('Médio')
    expect(animalStatusLabel(AnimalStatus.Available)).toBe('Disponível')
    expect(animalStatusLabel(AnimalStatus.InAdoptionProcess)).toBe('Em processo de adoção')
    expect(animalStatusLabel(AnimalStatus.Adopted)).toBe('Adotado')
  })

  it('returns Não informado for None, wrong case, numbers, and unknown values', () => {
    expect(animalSpeciesLabel('None')).toBe('Não informado')
    expect(animalSpeciesLabel('Dog')).toBe('Não informado')
    expect(animalSpeciesLabel('cat')).toBe('Não informado')
    expect(animalSpeciesLabel(3)).toBe('Não informado')
    expect(animalSexLabel(3)).toBe('Não informado')
    expect(animalSizeLabel(4)).toBe('Não informado')
    expect(animalStatusLabel('None')).toBe('Não informado')
    expect(animalStatusLabel(3)).toBe('Não informado')
  })
})

describe('animalAgeLabel', () => {
  it.each([
    [0, '0 anos'],
    [1, '1 ano'],
    [2, '2 anos'],
    [3, '3 anos'],
  ] as const)('formats %i as %s', (age, expected) => {
    expect(animalAgeLabel(age)).toBe(expected)
  })

  it('returns Não informado for non-integer ages', () => {
    expect(animalAgeLabel('None')).toBe('Não informado')
    expect(animalAgeLabel(1.5)).toBe('Não informado')
    expect(animalAgeLabel(null)).toBe('Não informado')
  })
})

describe('animalNameLabel', () => {
  it('returns the trimmed name', () => {
    expect(animalNameLabel(' Luna ')).toBe('Luna')
  })

  it('returns Sem nome for blank names', () => {
    expect(animalNameLabel('')).toBe('Sem nome')
    expect(animalNameLabel('   ')).toBe('Sem nome')
  })
})

describe('animalLocationLabel', () => {
  it('joins district and city', () => {
    expect(animalLocationLabel('Centro', 'Porto Alegre')).toBe('Centro, Porto Alegre')
  })

  it('returns only the city when district is empty', () => {
    expect(animalLocationLabel('', 'Porto Alegre')).toBe('Porto Alegre')
    expect(animalLocationLabel('   ', 'Porto Alegre')).toBe('Porto Alegre')
  })

  it('returns only the district when city is empty', () => {
    expect(animalLocationLabel('Centro', '')).toBe('Centro')
  })
})

describe('formatAnimalPublishedAt', () => {
  const now = new Date('2026-01-18T10:00:00Z')

  it('formats a relative published date in Portuguese', () => {
    expect(formatAnimalPublishedAt('2026-01-15T10:00:00Z', now)).toBe('publicado há 3 dias')
  })

  it('returns an empty string for an invalid ISO date', () => {
    expect(formatAnimalPublishedAt('not-a-date', now)).toBe('')
  })

  it('clamps a future date to the present', () => {
    expect(formatAnimalPublishedAt('2026-01-20T10:00:00Z', now)).toBe('publicado agora')
  })
})

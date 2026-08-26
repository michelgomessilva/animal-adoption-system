import { describe, expect, it } from 'vitest'

import {
  animalSexBadgeClass,
  animalSizeBadgeClass,
  animalSpeciesBadgeClass,
  animalSpeciesIcon,
  animalSpeciesImageClass,
  animalStatusBadgeClass,
} from '@/shared/types/animal-visual'

describe('animal visual tones', () => {
  it('maps species to distinct image and solid badge classes', () => {
    expect(animalSpeciesImageClass('Dog')).toBe('animal-image--dog')
    expect(animalSpeciesImageClass('Cat')).toBe('animal-image--cat')
    expect(animalSpeciesBadgeClass('Dog')).toBe('badge-secondary')
    expect(animalSpeciesBadgeClass('Cat')).toBe('badge-info')
  })

  it('maps species to icons including a paw-print for unknown', () => {
    expect(animalSpeciesIcon('Dog')).toBe('dog')
    expect(animalSpeciesIcon('Cat')).toBe('cat')
    expect(animalSpeciesIcon('None')).toBe('paw-print')
    expect(animalSpeciesIcon(3)).toBe('paw-print')
  })

  it('maps unknown species to a neutral tone', () => {
    expect(animalSpeciesImageClass('None')).toBe('animal-image--unknown')
    expect(animalSpeciesImageClass(3)).toBe('animal-image--unknown')
    expect(animalSpeciesBadgeClass('None')).toBe('badge-ghost')
    expect(animalSpeciesBadgeClass(3)).toBe('badge-ghost')
  })

  it('maps size to an increasing visual weight with readable fills', () => {
    expect(animalSizeBadgeClass('Small')).toBe('badge-outline')
    expect(animalSizeBadgeClass('Medium')).toBe('badge-warning')
    expect(animalSizeBadgeClass('Large')).toBe('badge-neutral')
  })

  it('maps unknown size to a ghost badge', () => {
    expect(animalSizeBadgeClass(4)).toBe('badge-ghost')
    expect(animalSizeBadgeClass('None')).toBe('badge-ghost')
  })

  it('maps sex to solid high-contrast badges', () => {
    expect(animalSexBadgeClass('Male')).toBe('badge-accent')
    expect(animalSexBadgeClass('Female')).toBe('badge-primary')
  })

  it('maps unknown sex to a ghost badge', () => {
    expect(animalSexBadgeClass(3)).toBe('badge-ghost')
    expect(animalSexBadgeClass('None')).toBe('badge-ghost')
  })

  it('maps status badges without treating unknown as adopted', () => {
    expect(animalStatusBadgeClass('Available')).toBe('badge-success')
    expect(animalStatusBadgeClass('Adopted')).toBe('badge-neutral')
    expect(animalStatusBadgeClass(3)).toBe('badge-ghost')
    expect(animalStatusBadgeClass(4)).toBe('badge-ghost')
    expect(animalStatusBadgeClass('None')).toBe('badge-ghost')
  })
})

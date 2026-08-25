import { describe, expect, it } from 'vitest'

import {
  animalSexBadgeClass,
  animalSizeBadgeClass,
  animalSpeciesBadgeClass,
  animalSpeciesImageClass,
} from '@/shared/types/animal-visual'

describe('animal visual tones', () => {
  it('maps species to distinct image and solid badge classes', () => {
    expect(animalSpeciesImageClass('Dog')).toBe('animal-image--dog')
    expect(animalSpeciesImageClass('Cat')).toBe('animal-image--cat')
    expect(animalSpeciesBadgeClass('Dog')).toBe('badge-secondary')
    expect(animalSpeciesBadgeClass('Cat')).toBe('badge-info')
  })

  it('maps size to an increasing visual weight with readable fills', () => {
    expect(animalSizeBadgeClass('Small')).toBe('badge-outline')
    expect(animalSizeBadgeClass('Medium')).toBe('badge-warning')
    expect(animalSizeBadgeClass('Large')).toBe('badge-neutral')
  })

  it('maps sex to solid high-contrast badges', () => {
    expect(animalSexBadgeClass('Male')).toBe('badge-accent')
    expect(animalSexBadgeClass('Female')).toBe('badge-primary')
  })
})

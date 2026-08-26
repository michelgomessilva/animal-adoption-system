import {
  canonicalAnimalSex,
  canonicalAnimalSize,
  canonicalAnimalSpecies,
  canonicalAnimalStatus,
  type AnimalSex,
  type AnimalSize,
  type AnimalSpecies,
  type AnimalStatus,
} from '@/shared/types/animal'
import type { AppIconName } from '@/shared/types/app-icon'

const GHOST_BADGE = 'badge-ghost'

/** Dog = secondary (forest); Cat = info (cool) — shared by icon fallback and badges. */
const SPECIES_IMAGE_CLASS = {
  Dog: 'animal-image--dog',
  Cat: 'animal-image--cat',
} as const satisfies Record<AnimalSpecies, string>

const SPECIES_BADGE_CLASS = {
  Dog: 'badge-secondary',
  Cat: 'badge-info',
} as const satisfies Record<AnimalSpecies, string>

const SPECIES_ICON = {
  Dog: 'dog',
  Cat: 'cat',
} as const satisfies Record<AnimalSpecies, AppIconName>

/**
 * Size ladder by fill weight, all high-contrast:
 * outline → warm solid → dense neutral.
 */
const SIZE_BADGE_CLASS = {
  Small: 'badge-outline',
  Medium: 'badge-warning',
  Large: 'badge-neutral',
} as const satisfies Record<AnimalSize, string>

const SEX_BADGE_CLASS = {
  Male: 'badge-accent',
  Female: 'badge-primary',
} as const satisfies Record<AnimalSex, string>

const STATUS_BADGE_CLASS = {
  Available: 'badge-success',
  Adopted: 'badge-neutral',
} as const satisfies Record<AnimalStatus, string>

function classFromCanonical<T extends string>(
  value: unknown,
  canonicalize: (value: unknown) => T | null,
  classes: Record<T, string>,
  fallback: string,
): string {
  const canonical = canonicalize(value)
  return canonical === null ? fallback : classes[canonical]
}

export function animalSpeciesImageClass(species: unknown): string {
  return classFromCanonical(
    species,
    canonicalAnimalSpecies,
    SPECIES_IMAGE_CLASS,
    'animal-image--unknown',
  )
}

export function animalSpeciesBadgeClass(species: unknown): string {
  return classFromCanonical(species, canonicalAnimalSpecies, SPECIES_BADGE_CLASS, GHOST_BADGE)
}

export function animalSpeciesIcon(species: unknown): AppIconName {
  const canonical = canonicalAnimalSpecies(species)
  return canonical === null ? 'paw-print' : SPECIES_ICON[canonical]
}

export function animalSizeBadgeClass(size: unknown): string {
  return classFromCanonical(size, canonicalAnimalSize, SIZE_BADGE_CLASS, GHOST_BADGE)
}

export function animalSexBadgeClass(sex: unknown): string {
  return classFromCanonical(sex, canonicalAnimalSex, SEX_BADGE_CLASS, GHOST_BADGE)
}

export function animalStatusBadgeClass(status: unknown): string {
  return classFromCanonical(status, canonicalAnimalStatus, STATUS_BADGE_CLASS, GHOST_BADGE)
}

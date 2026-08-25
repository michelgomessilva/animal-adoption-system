import type { AnimalSex, AnimalSize, AnimalSpecies } from '@/shared/types/animal'

/** Dog = secondary (forest); Cat = info (cool) — shared by icon fallback and badges. */
export function animalSpeciesImageClass(species: AnimalSpecies): string {
  return species === 'Cat' ? 'animal-image--cat' : 'animal-image--dog'
}

/** Solid fills (not soft) so label contrast matches status badges. */
export function animalSpeciesBadgeClass(species: AnimalSpecies): string {
  return species === 'Cat' ? 'badge-info' : 'badge-secondary'
}

/**
 * Size ladder by fill weight, all high-contrast:
 * outline → warm solid → dense neutral.
 */
export function animalSizeBadgeClass(size: AnimalSize): string {
  switch (size) {
    case 'Small':
      return 'badge-outline'
    case 'Medium':
      return 'badge-warning'
    case 'Large':
      return 'badge-neutral'
  }
}

export function animalSexBadgeClass(sex: AnimalSex): string {
  return sex === 'Female' ? 'badge-primary' : 'badge-accent'
}

export type AnimalSpecies = 'Dog' | 'Cat'
export type AnimalSex = 'Male' | 'Female'
export type AnimalSize = 'Small' | 'Medium' | 'Large'
export type AnimalStatus = 'Available' | 'Adopted'

const ANIMAL_ID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

export function isAnimalId(value: string): boolean {
  return ANIMAL_ID_PATTERN.test(value)
}

export interface AnimalWriteInput {
  name: string
  species: AnimalSpecies
  sex: AnimalSex
  size: AnimalSize
  description: string
  approximateAge: number
  image: string
  status: AnimalStatus
  district: string
  city: string
}

export interface Animal {
  id: string
  name: string
  sex: AnimalSex
  size: AnimalSize
  species: AnimalSpecies
  approximateAge: number
  description: string
  image: string
  status: AnimalStatus
  district: string
  city: string
  createdAt: string
}

export function toAnimalWriteInput(animal: Animal): AnimalWriteInput {
  return {
    name: animal.name,
    species: animal.species,
    sex: animal.sex,
    size: animal.size,
    description: animal.description,
    approximateAge: animal.approximateAge,
    image: animal.image,
    status: animal.status,
    district: animal.district,
    city: animal.city,
  }
}

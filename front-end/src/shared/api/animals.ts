import { apiRequest } from '@/shared/api/http'
import type {
  Animal,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '@/shared/types/animal'

export interface CreateAnimalInput {
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

export function listAnimals(): Promise<Animal[]> {
  return apiRequest<Animal[]>('api/animals')
}

export function createAnimal(input: CreateAnimalInput): Promise<Animal> {
  return apiRequest<Animal>('api/animals', {
    method: 'POST',
    body: input,
  })
}

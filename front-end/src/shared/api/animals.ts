import { apiRequest } from '@/shared/api/http'
import {
  animalListQueryIsEmpty,
  toAnimalListSearchParams,
  type Animal,
  type AnimalListQuery,
  type AnimalWriteInput,
} from '@/shared/types/animal'

export function listAnimals(query: AnimalListQuery = {}): Promise<Animal[]> {
  if (animalListQueryIsEmpty(query)) {
    return apiRequest<Animal[]>('api/animals')
  }

  return apiRequest<Animal[]>('api/animals', {
    searchParams: toAnimalListSearchParams(query),
  })
}

export function getAnimalById(id: string): Promise<Animal> {
  return apiRequest<Animal>(`api/animals/${id}`)
}

export function createAnimal(input: AnimalWriteInput): Promise<Animal> {
  return apiRequest<Animal>('api/animals', {
    method: 'POST',
    body: input,
  })
}

export function updateAnimal(id: string, input: AnimalWriteInput): Promise<Animal> {
  return apiRequest<Animal>(`api/animals/${id}`, {
    method: 'PUT',
    body: input,
  })
}

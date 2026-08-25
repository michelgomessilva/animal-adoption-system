import { apiRequest } from '@/shared/api/http'
import type { Animal, AnimalWriteInput } from '@/shared/types/animal'

export function listAnimals(): Promise<Animal[]> {
  return apiRequest<Animal[]>('api/animals')
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

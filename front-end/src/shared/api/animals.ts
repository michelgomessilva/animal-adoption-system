import { apiRequest } from '@/shared/api/http'
import type { Animal } from '@/shared/types/animal'

export function listAnimals(): Promise<Animal[]> {
  return apiRequest<Animal[]>('/api/animals')
}

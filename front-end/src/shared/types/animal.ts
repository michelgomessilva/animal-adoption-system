export type AnimalSpecies = 'Dog' | 'Cat'
export type AnimalSex = 'Male' | 'Female'
export type AnimalSize = 'Small' | 'Medium' | 'Large'
export type AnimalStatus = 'Available' | 'Adopted'

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

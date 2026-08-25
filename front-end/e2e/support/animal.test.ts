import { describe, expect, it } from 'vitest'

import { randomAnimalInput, randomFilterContrast, uniqueAnimalName } from './animal'
import { faker } from './faker'

describe('uniqueAnimalName', () => {
  it('returns a Brazilian first name with a unique kennel suffix within the name limit', () => {
    faker.seed(1)
    const name = uniqueAnimalName()

    expect(name).toMatch(/^.+ \d{4}$/)
    expect(name.length).toBeGreaterThan(5)
    expect(name.length).toBeLessThanOrEqual(20)
  })

  it('returns a different value on each call', () => {
    const names = new Set(Array.from({ length: 20 }, () => uniqueAnimalName()))

    expect(names.size).toBe(20)
  })
})

describe('randomAnimalInput', () => {
  it('stays within form limits across many draws', () => {
    faker.seed(7)
    for (let index = 0; index < 40; index += 1) {
      const input = randomAnimalInput()

      expect(input.name.length).toBeGreaterThan(0)
      expect(input.name.length).toBeLessThanOrEqual(20)
      expect(input.description.length).toBeGreaterThan(0)
      expect(input.description.length).toBeLessThanOrEqual(200)
      expect(input.district.length).toBeGreaterThan(0)
      expect(input.district.length).toBeLessThanOrEqual(30)
      expect(input.city.length).toBeGreaterThan(0)
      expect(input.city.length).toBeLessThanOrEqual(30)
      expect(input.approximateAge).toBeGreaterThanOrEqual(0)
      expect(input.approximateAge).toBeLessThanOrEqual(30)
      expect(input.status).toBe('Available')
    }
  })

  it('applies overrides on top of the generated pet', () => {
    const input = randomAnimalInput({ species: 'Cat', name: 'Mel 0001' })

    expect(input.species).toBe('Cat')
    expect(input.name).toBe('Mel 0001')
  })
})

describe('randomFilterContrast', () => {
  it('picks two different values for the chosen key', () => {
    faker.seed(3)
    for (let index = 0; index < 20; index += 1) {
      const contrast = randomFilterContrast(['species', 'sex', 'size'])

      expect(contrast.included).not.toBe(contrast.excluded)
    }
  })
})

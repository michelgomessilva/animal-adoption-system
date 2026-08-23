import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import type { Animal } from '@/shared/types/animal'
import HomePage from '@/views/public/pages/HomePage.vue'
import { createAnimal, mountWithPlugins } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<Animal[]>>(),
}))

import { listAnimals } from '@/shared/api/animals'

const listAnimalsMock = vi.mocked(listAnimals)
const luna = createAnimal()

describe('HomePage', () => {
  it('renders animals from the catalog', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const wrapper = await mountWithPlugins(HomePage)
    await flushPromises()

    expect(wrapper.text()).toContain('Luna')
    expect(wrapper.text()).toContain('Cachorro')
  })

  it('shows an empty state when the catalog is empty', async () => {
    listAnimalsMock.mockResolvedValue([])
    const wrapper = await mountWithPlugins(HomePage)
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhum animal disponível no momento.')
  })

  it('omits the image when the animal has no photo URL', async () => {
    listAnimalsMock.mockResolvedValue([createAnimal({ image: '' })])
    const wrapper = await mountWithPlugins(HomePage)
    await flushPromises()

    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('shows an error when the catalog fails to load', async () => {
    listAnimalsMock.mockRejectedValue(new ApiError('network', 0, 'Network request failed'))
    const wrapper = await mountWithPlugins(HomePage)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Não foi possível carregar o catálogo')
  })
})

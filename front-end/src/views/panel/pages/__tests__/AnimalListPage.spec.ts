import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import type { Animal } from '@/shared/types/animal'
import AnimalListPage from '@/views/panel/pages/AnimalListPage.vue'
import { createAnimal, mountWithPlugins } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<Animal[]>>(),
}))

import { listAnimals } from '@/shared/api/animals'

const listAnimalsMock = vi.mocked(listAnimals)
const luna = createAnimal()

describe('AnimalListPage', () => {
  it('renders a table of animals', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const wrapper = await mountWithPlugins(AnimalListPage)
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Meus pets')
    expect(wrapper.get('table').text()).toContain('Luna')
    expect(wrapper.get('table').text()).toContain('Situação')
    expect(wrapper.get('table').text()).toContain('Disponível')
    expect(wrapper.get('a.btn-primary').text()).toContain('Cadastrar pet')
    expect(wrapper.get('a.btn-primary').attributes('href')).toBe('/panel/animals/new')
    expect(wrapper.find('[data-icon="plus"]').exists()).toBe(true)
    expect(wrapper.get('a.btn-ghost').text()).toContain('Editar')
    expect(wrapper.get('a.btn-ghost').attributes('href')).toBe(
      '/panel/animals/11111111-1111-1111-1111-111111111111/edit',
    )
    expect(wrapper.find('[data-icon="pencil"]').exists()).toBe(true)
  })

  it('shows an empty state', async () => {
    listAnimalsMock.mockResolvedValue([])
    const wrapper = await mountWithPlugins(AnimalListPage)
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhum animal cadastrado.')
  })

  it('shows an error when the list fails', async () => {
    listAnimalsMock.mockRejectedValue(new ApiError('unknown', 500, 'Request failed'))
    const wrapper = await mountWithPlugins(AnimalListPage)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Não foi possível carregar os animais')
  })

  it('retries after a list failure', async () => {
    listAnimalsMock
      .mockRejectedValueOnce(new ApiError('unknown', 500, 'Request failed'))
      .mockResolvedValueOnce([luna])
    const wrapper = await mountWithPlugins(AnimalListPage)
    await flushPromises()

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.get('table').text()).toContain('Luna')
  })
})

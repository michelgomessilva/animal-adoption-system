import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import type { Animal } from '@/shared/types/animal'
import AnimalListPage from '@/views/panel/pages/AnimalListPage.vue'
import { createAnimal, createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<Animal[]>>(),
}))

import { listAnimals } from '@/shared/api/animals'

const listAnimalsMock = vi.mocked(listAnimals)
const luna = createAnimal()

async function mountListPage(path = '/panel/animals') {
  const router = await createTestRouter()
  await router.push(path)
  await router.isReady()
  const wrapper = await mountWithPlugins(AnimalListPage, { router })
  await flushPromises()
  return { wrapper, router }
}

describe('AnimalListPage', () => {
  it('renders a table of animals and the filter bar', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const { wrapper } = await mountListPage()

    expect(wrapper.get('h1').text()).toBe('Meus pets')
    expect(wrapper.find('[aria-label="Filtros da listagem"]').exists()).toBe(true)
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
    expect(listAnimalsMock).toHaveBeenCalledWith({})
  })

  it('loads with query filters from the URL', async () => {
    listAnimalsMock.mockResolvedValue([])
    await mountListPage('/panel/animals?status=Adopted')

    expect(listAnimalsMock).toHaveBeenCalledWith({ status: 'Adopted' })
  })

  it('updates the URL and refetches when a filter changes', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const { wrapper, router } = await mountListPage()

    listAnimalsMock.mockResolvedValue([])
    await wrapper.get('select[name="species"]').setValue('Cat')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ species: 'Cat' })
    expect(listAnimalsMock).toHaveBeenLastCalledWith({ species: 'Cat' })
  })

  it('shows an empty state when there are no animals', async () => {
    listAnimalsMock.mockResolvedValue([])
    const { wrapper } = await mountListPage()

    expect(wrapper.text()).toContain('Nenhum animal cadastrado.')
  })

  it('shows a filtered empty state when filters match nothing', async () => {
    listAnimalsMock.mockResolvedValue([])
    const { wrapper } = await mountListPage('/panel/animals?status=Adopted')

    expect(wrapper.text()).toContain('Nenhum animal encontrado com esses filtros.')
    expect(wrapper.text()).not.toContain('Nenhum animal cadastrado.')
  })

  it('shows filters while loading', async () => {
    let resolveList!: (value: Animal[]) => void
    listAnimalsMock.mockReturnValue(
      new Promise<Animal[]>((resolve) => {
        resolveList = resolve
      }),
    )
    const router = await createTestRouter()
    await router.push('/panel/animals')
    const wrapper = await mountWithPlugins(AnimalListPage, { router })

    expect(wrapper.find('[aria-label="Filtros da listagem"]').exists()).toBe(true)
    expect(wrapper.get('[role="status"]').text()).toContain('Carregando')

    resolveList([luna])
    await flushPromises()
  })

  it('shows an error when the list fails', async () => {
    listAnimalsMock.mockRejectedValue(new ApiError('unknown', 500, 'Request failed'))
    const { wrapper } = await mountListPage()

    expect(wrapper.get('[role="alert"]').text()).toContain('Não foi possível carregar os animais')
  })

  it('retries with the current filters after a list failure', async () => {
    listAnimalsMock
      .mockRejectedValueOnce(new ApiError('unknown', 500, 'Request failed'))
      .mockResolvedValueOnce([luna])
    const { wrapper } = await mountListPage('/panel/animals?species=Dog')

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(listAnimalsMock).toHaveBeenLastCalledWith({ species: 'Dog' })
    expect(wrapper.get('table').text()).toContain('Luna')
  })
})

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import type { Animal } from '@/shared/types/animal'
import HomePage from '@/views/public/pages/HomePage.vue'
import { createAnimal, createTestRouter, mountWithPlugins } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<Animal[]>>(),
}))

import { listAnimals } from '@/shared/api/animals'

const listAnimalsMock = vi.mocked(listAnimals)
const luna = createAnimal()

async function mountHomePage(path = '/') {
  const router = await createTestRouter()
  await router.push(path)
  await router.isReady()
  const wrapper = await mountWithPlugins(HomePage, { router })
  await flushPromises()
  return { wrapper, router }
}

describe('HomePage', () => {
  it('renders animals from the catalog', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const { wrapper } = await mountHomePage()

    expect(wrapper.text()).toContain('Luna')
    expect(wrapper.text()).toContain('Cachorro')
    expect(listAnimalsMock).toHaveBeenCalledWith({})
  })

  it('shows an empty state when the catalog is empty', async () => {
    listAnimalsMock.mockResolvedValue([])
    const { wrapper } = await mountHomePage()

    expect(wrapper.text()).toContain('Nenhum animal disponível no momento.')
  })

  it('shows a species fallback when the animal has no photo URL', async () => {
    listAnimalsMock.mockResolvedValue([createAnimal({ image: '' })])
    const { wrapper } = await mountHomePage()

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('[data-icon="dog"]').exists()).toBe(true)
  })

  it('retries the catalog after a failure', async () => {
    listAnimalsMock
      .mockRejectedValueOnce(new ApiError('network', 0, 'Network request failed'))
      .mockResolvedValueOnce([luna])
    const { wrapper } = await mountHomePage()

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Luna')
  })

  it('shows an error when the catalog fails to load', async () => {
    listAnimalsMock.mockRejectedValue(new ApiError('network', 0, 'Network request failed'))
    const { wrapper } = await mountHomePage()

    expect(wrapper.get('[role="alert"]').text()).toContain('Não foi possível carregar o catálogo')
  })

  it('loads with query filters from the URL', async () => {
    listAnimalsMock.mockResolvedValue([])
    await mountHomePage('/?species=Cat&orderBy=createdAt_desc')

    expect(listAnimalsMock).toHaveBeenCalledWith({
      species: 'Cat',
      orderBy: 'createdAt_desc',
    })
  })

  it('updates the URL and refetches when a species filter changes', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const { wrapper, router } = await mountHomePage()

    listAnimalsMock.mockResolvedValue([])
    const gato = wrapper.findAll('button').find((button) => button.text() === 'Gato')
    expect(gato).toBeDefined()
    await gato!.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ species: 'Cat' })
    expect(listAnimalsMock).toHaveBeenLastCalledWith({ species: 'Cat' })
  })

  it('updates the URL and refetches when orderBy changes', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const { wrapper, router } = await mountHomePage()

    listAnimalsMock.mockResolvedValue([luna])
    await wrapper.get('select[name="orderBy"]').setValue('createdAt_desc')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ orderBy: 'createdAt_desc' })
    expect(listAnimalsMock).toHaveBeenLastCalledWith({ orderBy: 'createdAt_desc' })
  })

  it('shows a filtered empty state when filters match nothing', async () => {
    listAnimalsMock.mockResolvedValue([])
    const { wrapper } = await mountHomePage('/?species=Cat')

    expect(wrapper.text()).toContain('Nenhum animal encontrado com esses filtros.')
    expect(wrapper.text()).not.toContain('Nenhum animal disponível no momento.')
  })

  it('shows a catalog empty state when only orderBy is set', async () => {
    listAnimalsMock.mockResolvedValue([])
    const { wrapper } = await mountHomePage('/?orderBy=name')

    expect(wrapper.text()).toContain('Nenhum animal disponível no momento.')
    expect(wrapper.text()).not.toContain('Nenhum animal encontrado com esses filtros.')
  })

  it('shows filters while loading', async () => {
    let resolveList!: (value: Animal[]) => void
    listAnimalsMock.mockReturnValue(
      new Promise<Animal[]>((resolve) => {
        resolveList = resolve
      }),
    )
    const router = await createTestRouter()
    await router.push('/')
    const wrapper = await mountWithPlugins(HomePage, { router })

    expect(wrapper.find('[aria-label="Filtros do catálogo"]').exists()).toBe(true)
    expect(wrapper.get('[role="status"]').text()).toContain('Carregando')

    resolveList([luna])
    await flushPromises()
  })

  it('removes a species chip and updates the URL', async () => {
    listAnimalsMock.mockResolvedValue([luna])
    const { wrapper, router } = await mountHomePage('/?species=Dog&orderBy=name')

    await wrapper.get('[aria-label="Remover filtro Cachorro"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ orderBy: 'name' })
    expect(listAnimalsMock).toHaveBeenLastCalledWith({ orderBy: 'name' })
  })
})

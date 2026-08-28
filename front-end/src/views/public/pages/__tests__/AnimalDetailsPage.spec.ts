import { flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import { AnimalStatus, type Animal } from '@/shared/types/animal'
import AnimalDetailsPage from '@/views/public/pages/AnimalDetailsPage.vue'
import {
  createAnimal as createAnimalFixture,
  mountWithPlugins,
  stubRoutes,
} from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
  getAnimalById: vi.fn<(id: string) => Promise<Animal>>(),
}))

import { getAnimalById } from '@/shared/api/animals'

const getAnimalByIdMock = vi.mocked(getAnimalById)
const luna = createAnimalFixture({
  description: 'Calma e brincalhona com crianças.',
})

async function createDetailsRouter(id: string) {
  const routes: RouteRecordRaw[] = stubRoutes.map((route) => {
    if (route.name !== 'animal-details') {
      return route
    }

    return {
      path: '/animais/:id',
      name: 'animal-details',
      component: AnimalDetailsPage,
    }
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  await router.push(`/animais/${id}`)
  await router.isReady()
  return router
}

describe('AnimalDetailsPage', () => {
  beforeEach(() => {
    getAnimalByIdMock.mockReset()
  })

  it('renders the animal profile from the API', async () => {
    getAnimalByIdMock.mockResolvedValue(luna)
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(getAnimalByIdMock).toHaveBeenCalledWith(luna.id)
    expect(wrapper.get('h1').text()).toBe('Luna')
    expect(wrapper.text()).toContain('Calma e brincalhona com crianças.')
    expect(wrapper.text()).toContain('Centro, Porto Alegre')
    expect(wrapper.text()).toContain('Cachorro')
    expect(wrapper.text()).toContain('Fêmea')
    expect(wrapper.text()).toContain('Médio')
    expect(wrapper.text()).toContain('3 anos')
    expect(wrapper.text()).toContain('Disponível')
    expect(wrapper.text()).not.toContain('Quero adotar')
    expect(wrapper.text()).not.toContain('Salvar')
    expect(wrapper.text()).not.toContain('Saúde')
    expect(wrapper.text()).not.toContain('mapa')
    expect(wrapper.text()).not.toContain('ONG')
  })

  it('shows a species fallback when there is no photo', async () => {
    getAnimalByIdMock.mockResolvedValue(createAnimalFixture({ image: '' }))
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('[data-icon="dog"]').exists()).toBe(true)
  })

  it('shows an adopted status when the animal is adopted', async () => {
    getAnimalByIdMock.mockResolvedValue(createAnimalFixture({ status: AnimalStatus.Adopted }))
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(wrapper.text()).toContain('Adotado')
    expect(wrapper.find('.animal-details--adopted').exists()).toBe(true)
  })

  it('shows in-adoption-process status without adopted chrome', async () => {
    getAnimalByIdMock.mockResolvedValue(
      createAnimalFixture({ status: AnimalStatus.InAdoptionProcess }),
    )
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(wrapper.text()).toContain('Em processo de adoção')
    expect(wrapper.find('.animal-details--adopted').exists()).toBe(false)
  })

  it('does not treat wrong-case adopted as adopted chrome', async () => {
    getAnimalByIdMock.mockResolvedValue({
      ...createAnimalFixture(),
      status: 'adopted',
    } as unknown as Animal)
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(wrapper.find('.animal-details--adopted').exists()).toBe(false)
    expect(wrapper.text()).toContain('Não informado')
  })

  it('shows Sem nome and Não informado without marking unknown status as adopted', async () => {
    getAnimalByIdMock.mockResolvedValue({
      ...createAnimalFixture({ image: '', name: '' }),
      species: 'None',
      status: 3,
    } as unknown as Animal)
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Sem nome')
    expect(wrapper.text()).toContain('Não informado')
    expect(wrapper.find('.animal-details--adopted').exists()).toBe(false)
    expect(wrapper.find('[data-icon="paw-print"]').exists()).toBe(true)
  })

  it('shows loading status while the profile loads', async () => {
    let resolveAnimal!: (value: Animal) => void
    getAnimalByIdMock.mockReturnValue(
      new Promise<Animal>((resolve) => {
        resolveAnimal = resolve
      }),
    )
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })

    expect(wrapper.get('[role="status"]').text()).toContain('Carregando perfil')

    resolveAnimal(luna)
    await flushPromises()
  })

  it('shows an editorial empty state when the animal is not found', async () => {
    getAnimalByIdMock.mockRejectedValue(new ApiError('not-found', 404, 'Not found'))
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(wrapper.get('h1').text()).toContain('Não encontramos esse pet.')
    expect(wrapper.get('a[href="/"]').text()).toContain('Voltar ao catálogo')
  })

  it('shows not found for an invalid id without calling the API', async () => {
    const router = await createDetailsRouter('not-a-guid')
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    expect(getAnimalByIdMock).not.toHaveBeenCalled()
    expect(wrapper.get('h1').text()).toContain('Não encontramos esse pet.')
  })

  it('retries after a network failure', async () => {
    getAnimalByIdMock
      .mockRejectedValueOnce(new ApiError('network', 0, 'Network request failed'))
      .mockResolvedValueOnce(luna)
    const router = await createDetailsRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalDetailsPage, { router })
    await flushPromises()

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Luna')
  })
})

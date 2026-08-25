import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import { ApiError } from '@/shared/api/api-error'
import type { Animal } from '@/shared/types/animal'
import AnimalEditPage from '@/views/panel/pages/AnimalEditPage.vue'
import {
  createAnimal as createAnimalFixture,
  mountWithPlugins,
  stubRoutes,
} from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
  createAnimal: vi.fn<(input: unknown) => Promise<Animal>>(),
  getAnimalById: vi.fn<(id: string) => Promise<Animal>>(),
  updateAnimal: vi.fn<(id: string, input: unknown) => Promise<Animal>>(),
}))

import { getAnimalById, updateAnimal } from '@/shared/api/animals'

const getAnimalByIdMock = vi.mocked(getAnimalById)
const updateAnimalMock = vi.mocked(updateAnimal)
const luna = createAnimalFixture()

async function createEditRouter(id: string) {
  const routes: RouteRecordRaw[] = stubRoutes.map((route) => {
    if (route.name !== 'panel-animals-edit') {
      return route
    }

    return {
      path: '/panel/animals/:id/edit',
      name: 'panel-animals-edit',
      component: AnimalEditPage,
    }
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  await router.push(`/panel/animals/${id}/edit`)
  await router.isReady()
  return router
}

async function goToLastStep(wrapper: Awaited<ReturnType<typeof mountWithPlugins>>): Promise<void> {
  const locationNav = wrapper
    .findAll('button')
    .find((button) => button.text().includes('Localização'))
  if (locationNav === undefined) {
    throw new Error('Expected location step nav')
  }
  await locationNav.trigger('click')
}

describe('AnimalEditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getAnimalByIdMock.mockReset()
    updateAnimalMock.mockReset()
  })

  it('loads the animal and saves updates', async () => {
    getAnimalByIdMock.mockResolvedValue(luna)
    updateAnimalMock.mockResolvedValue(luna)
    const router = await createEditRouter(luna.id)
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountWithPlugins(AnimalEditPage, { router })
    await flushPromises()

    expect(getAnimalByIdMock).toHaveBeenCalledWith(luna.id)
    expect((wrapper.get('input[name="name"]').element as HTMLInputElement).value).toBe('Luna')

    await goToLastStep(wrapper)
    const submit = wrapper.findAll('button').find((button) => button.text().includes('Salvar'))
    if (submit === undefined) {
      throw new Error('Expected Salvar')
    }
    await submit.trigger('click')
    await flushPromises()

    expect(updateAnimalMock).toHaveBeenCalledWith(
      luna.id,
      expect.objectContaining({
        name: 'Luna',
        description: 'Calma',
        district: 'Centro',
        city: 'Porto Alegre',
        status: 'Available',
      }),
    )
    expect(replace).toHaveBeenCalledWith({ name: 'panel-animals' })
  })

  it('shows not found when the animal does not exist', async () => {
    getAnimalByIdMock.mockRejectedValue(new ApiError('not-found', 404, 'Not found'))
    const router = await createEditRouter(luna.id)
    const wrapper = await mountWithPlugins(AnimalEditPage, { router })
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Não encontramos esse cadastro.')
    expect(wrapper.find('input[name="name"]').exists()).toBe(false)
  })

  it('shows not found for an invalid id without calling the API', async () => {
    const router = await createEditRouter('new')
    const wrapper = await mountWithPlugins(AnimalEditPage, { router })
    await flushPromises()

    expect(getAnimalByIdMock).not.toHaveBeenCalled()
    expect(wrapper.get('[role="alert"]').text()).toContain('Não encontramos esse cadastro.')
  })

  it('shows a validation alert and stays on the page', async () => {
    getAnimalByIdMock.mockResolvedValue(luna)
    updateAnimalMock.mockRejectedValue(
      new ApiError('validation', 400, 'The Name field is required.', {
        name: 'The Name field is required.',
      }),
    )
    const router = await createEditRouter(luna.id)
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountWithPlugins(AnimalEditPage, { router })
    await flushPromises()

    await goToLastStep(wrapper)
    const submit = wrapper.findAll('button').find((button) => button.text().includes('Salvar'))
    if (submit === undefined) {
      throw new Error('Expected Salvar')
    }
    await submit.trigger('click')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Revise os dados do cadastro.')
    expect(replace).not.toHaveBeenCalled()
  })
})

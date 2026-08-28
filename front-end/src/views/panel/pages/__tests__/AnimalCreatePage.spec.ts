import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/api-error'
import { AnimalStatus, type Animal } from '@/shared/types/animal'
import AnimalCreatePage from '@/views/panel/pages/AnimalCreatePage.vue'
import {
  createAnimal as createAnimalFixture,
  createTestRouter,
  mountWithPlugins,
} from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<never[]>>().mockResolvedValue([]),
  createAnimal: vi.fn<(input: unknown) => Promise<Animal>>(),
  getAnimalById: vi.fn<() => Promise<Animal>>(),
  updateAnimal: vi.fn<(id: string, input: unknown) => Promise<Animal>>(),
}))

import { createAnimal } from '@/shared/api/animals'

const createAnimalMock = vi.mocked(createAnimal)

async function completeWizard(
  wrapper: Awaited<ReturnType<typeof mountWithPlugins>>,
): Promise<void> {
  await wrapper.get('input[name="name"]').setValue('Luna')
  const continueFirst = wrapper.findAll('button').find((button) => button.text() === 'Continuar')
  if (continueFirst === undefined) {
    throw new Error('Expected Continuar on basic step')
  }
  await continueFirst.trigger('click')

  await wrapper.get('textarea[name="description"]').setValue('Calma')
  const continueSecond = wrapper.findAll('button').find((button) => button.text() === 'Continuar')
  if (continueSecond === undefined) {
    throw new Error('Expected Continuar on description step')
  }
  await continueSecond.trigger('click')

  await wrapper.get('input[name="district"]').setValue('Centro')
  await wrapper.get('input[name="parish"]').setValue('Sé')
  await wrapper.get('input[name="city"]').setValue('Porto Alegre')
}

describe('AnimalCreatePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    createAnimalMock.mockReset()
  })

  it('posts the animal after the last step and returns to the list', async () => {
    createAnimalMock.mockResolvedValue(createAnimalFixture())
    const router = await createTestRouter()
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountWithPlugins(AnimalCreatePage, { router })

    expect(wrapper.text()).not.toContain('Vacinas e histórico de saúde em breve.')

    await completeWizard(wrapper)
    const submit = wrapper.findAll('button').find((button) => button.text() === 'Cadastrar')
    if (submit === undefined) {
      throw new Error('Expected Cadastrar')
    }
    await submit.trigger('click')
    await flushPromises()

    expect(createAnimalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Luna',
        description: 'Calma',
        district: 'Centro',
        parish: 'Sé',
        city: 'Porto Alegre',
        image: '',
        status: AnimalStatus.Available,
      }),
    )
    expect(replace).toHaveBeenCalledWith({ name: 'panel-animals' })
    expect(wrapper.findAll('input[type="file"]')).toHaveLength(0)
  })

  it('shows a validation alert and stays on the page', async () => {
    createAnimalMock.mockRejectedValue(
      new ApiError('validation', 400, 'The Name field is required.', {
        name: 'The Name field is required.',
      }),
    )
    const router = await createTestRouter()
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountWithPlugins(AnimalCreatePage, { router })

    await completeWizard(wrapper)
    const submit = wrapper.findAll('button').find((button) => button.text() === 'Cadastrar')
    if (submit === undefined) {
      throw new Error('Expected Cadastrar')
    }
    await submit.trigger('click')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Revise os dados do cadastro.')
    expect(replace).not.toHaveBeenCalled()
  })

  it('shows a network alert and stays on the page', async () => {
    createAnimalMock.mockRejectedValue(new ApiError('network', 0, 'Network request failed'))
    const router = await createTestRouter()
    const replace = vi.spyOn(router, 'replace')
    const wrapper = await mountWithPlugins(AnimalCreatePage, { router })

    await completeWizard(wrapper)
    const submit = wrapper.findAll('button').find((button) => button.text() === 'Cadastrar')
    if (submit === undefined) {
      throw new Error('Expected Cadastrar')
    }
    await submit.trigger('click')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Não foi possível conectar. Tente novamente.')
    expect(replace).not.toHaveBeenCalled()
  })
})

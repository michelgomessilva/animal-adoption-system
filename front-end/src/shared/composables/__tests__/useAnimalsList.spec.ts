import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'

import { ApiError } from '@/shared/api/api-error'
import { useAnimalsList } from '@/shared/composables/useAnimalsList'
import type { Animal, AnimalListQuery } from '@/shared/types/animal'
import { createAnimal } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<Animal[]>>(),
}))

import { listAnimals } from '@/shared/api/animals'

const listAnimalsMock = vi.mocked(listAnimals)

function mountList(query?: Ref<AnimalListQuery>) {
  const Host = defineComponent({
    setup() {
      return useAnimalsList(query)
    },
    template: '<div />',
  })

  return mount(Host)
}

describe('useAnimalsList', () => {
  afterEach(() => {
    listAnimalsMock.mockReset()
  })

  it('loads animals on mount', async () => {
    listAnimalsMock.mockResolvedValue([createAnimal()])
    const wrapper = mountList()
    await flushPromises()

    expect(listAnimalsMock).toHaveBeenCalledWith({})
    expect(wrapper.vm.animals).toHaveLength(1)
    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('refetches when the query changes', async () => {
    const query = ref<AnimalListQuery>({ status: 'Adopted' })
    listAnimalsMock.mockResolvedValue([createAnimal({ status: 'Adopted' })])
    const wrapper = mountList(query)
    await flushPromises()

    expect(listAnimalsMock).toHaveBeenCalledWith({ status: 'Adopted' })

    listAnimalsMock.mockResolvedValue([createAnimal({ species: 'Cat' })])
    query.value = { species: 'Cat' }
    await nextTick()
    await flushPromises()

    expect(listAnimalsMock).toHaveBeenLastCalledWith({ species: 'Cat' })
    expect(wrapper.vm.animals[0]?.species).toBe('Cat')
  })

  it('ignores a stale response after a newer query', async () => {
    let resolveFirst!: (value: Animal[]) => void
    const first = new Promise<Animal[]>((resolve) => {
      resolveFirst = resolve
    })
    listAnimalsMock.mockReturnValueOnce(first)

    const query = ref<AnimalListQuery>({ status: 'Adopted' })
    const wrapper = mountList(query)
    await nextTick()

    const secondResult = [createAnimal({ species: 'Cat', name: 'Mimi' })]
    listAnimalsMock.mockResolvedValueOnce(secondResult)
    query.value = { species: 'Cat' }
    await nextTick()
    await flushPromises()

    resolveFirst([createAnimal({ status: 'Adopted', name: 'Old' })])
    await flushPromises()

    expect(wrapper.vm.animals).toEqual(secondResult)
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('treats a known API failure as a recoverable error', async () => {
    listAnimalsMock.mockRejectedValue(new ApiError('network', 0, 'Network request failed'))
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.vm.hasError).toBe(true)
    expect(wrapper.vm.animals).toEqual([])
  })

  it('treats an unknown failure as a recoverable error', async () => {
    listAnimalsMock.mockRejectedValue(new Error('boom'))
    const wrapper = mountList()
    await flushPromises()

    expect(wrapper.vm.hasError).toBe(true)
  })

  it('reloads with the current query after a failure', async () => {
    const query = ref<AnimalListQuery>({ species: 'Dog' })
    listAnimalsMock
      .mockRejectedValueOnce(new ApiError('unknown', 500, 'Request failed'))
      .mockResolvedValueOnce([createAnimal()])
    const wrapper = mountList(query)
    await flushPromises()

    await wrapper.vm.reload()
    await flushPromises()

    expect(listAnimalsMock).toHaveBeenLastCalledWith({ species: 'Dog' })
    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.animals).toHaveLength(1)
  })
})

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, type Ref } from 'vue'

import { ApiError } from '@/shared/api/api-error'
import { useAnimalById } from '@/shared/composables/useAnimalById'
import type { Animal } from '@/shared/types/animal'
import { createAnimal } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  getAnimalById: vi.fn<(id: string) => Promise<Animal>>(),
}))

import { getAnimalById } from '@/shared/api/animals'

const getAnimalByIdMock = vi.mocked(getAnimalById)
const luna = createAnimal()

function mountAnimal(id?: Ref<string>) {
  const Host = defineComponent({
    setup() {
      return useAnimalById(id ?? (() => luna.id))
    },
    template: '<div />',
  })

  return mount(Host)
}

describe('useAnimalById', () => {
  afterEach(() => {
    getAnimalByIdMock.mockReset()
  })

  it('loads the animal on mount', async () => {
    getAnimalByIdMock.mockResolvedValue(luna)
    const wrapper = mountAnimal()
    await flushPromises()

    expect(getAnimalByIdMock).toHaveBeenCalledWith(luna.id)
    expect(wrapper.vm.animal).toEqual(luna)
    expect(wrapper.vm.isNotFound).toBe(false)
    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('treats an invalid id as not found without calling the API', async () => {
    const id = ref('new')
    const wrapper = mountAnimal(id)
    await flushPromises()

    expect(getAnimalByIdMock).not.toHaveBeenCalled()
    expect(wrapper.vm.isNotFound).toBe(true)
    expect(wrapper.vm.animal).toBeNull()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('marks not found when the API returns 404', async () => {
    getAnimalByIdMock.mockRejectedValue(new ApiError('not-found', 404, 'Not found'))
    const wrapper = mountAnimal()
    await flushPromises()

    expect(wrapper.vm.isNotFound).toBe(true)
    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.animal).toBeNull()
  })

  it('treats a network failure as a recoverable error and reloads', async () => {
    getAnimalByIdMock
      .mockRejectedValueOnce(new ApiError('network', 0, 'Network request failed'))
      .mockResolvedValueOnce(luna)
    const wrapper = mountAnimal()
    await flushPromises()

    expect(wrapper.vm.hasError).toBe(true)

    await wrapper.vm.reload()
    await flushPromises()

    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.animal).toEqual(luna)
  })

  it('ignores a stale response after a newer id', async () => {
    let resolveFirst!: (value: Animal) => void
    const first = new Promise<Animal>((resolve) => {
      resolveFirst = resolve
    })
    getAnimalByIdMock.mockReturnValueOnce(first)

    const id = ref(luna.id)
    const wrapper = mountAnimal(id)
    await nextTick()

    const second = createAnimal({ id: '22222222-2222-2222-2222-222222222222', name: 'Mimi' })
    getAnimalByIdMock.mockResolvedValueOnce(second)
    id.value = second.id
    await nextTick()
    await flushPromises()

    resolveFirst(createAnimal({ name: 'Old' }))
    await flushPromises()

    expect(wrapper.vm.animal).toEqual(second)
    expect(wrapper.vm.hasError).toBe(false)
  })

  it('does not set hasError on unauthorized', async () => {
    getAnimalByIdMock.mockRejectedValue(new ApiError('unauthorized', 401, 'Unauthorized'))
    const wrapper = mountAnimal()
    await flushPromises()

    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.isNotFound).toBe(false)
    expect(wrapper.vm.animal).toBeNull()
    expect(wrapper.vm.isLoading).toBe(false)
  })
})

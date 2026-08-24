import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import { ApiError } from '@/shared/api/api-error'
import { useAnimalsList } from '@/shared/composables/useAnimalsList'
import type { Animal } from '@/shared/types/animal'
import { createAnimal } from '@/__tests__/helpers'

vi.mock('@/shared/api/animals', () => ({
  listAnimals: vi.fn<() => Promise<Animal[]>>(),
}))

import { listAnimals } from '@/shared/api/animals'

const listAnimalsMock = vi.mocked(listAnimals)

function mountList() {
  const Host = defineComponent({
    setup() {
      return useAnimalsList()
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

    expect(wrapper.vm.animals).toHaveLength(1)
    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.isLoading).toBe(false)
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

  it('reloads after a failure', async () => {
    listAnimalsMock
      .mockRejectedValueOnce(new ApiError('unknown', 500, 'Request failed'))
      .mockResolvedValueOnce([createAnimal()])
    const wrapper = mountList()
    await flushPromises()

    await wrapper.vm.reload()
    await flushPromises()

    expect(wrapper.vm.hasError).toBe(false)
    expect(wrapper.vm.animals).toHaveLength(1)
  })
})

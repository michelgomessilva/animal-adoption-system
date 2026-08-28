import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import { useAnimalListFilters } from '@/shared/composables/useAnimalListFilters'
import { AnimalOrderBy, AnimalSpecies, AnimalStatus } from '@/shared/types/animal'
import { createTestRouter } from '@/__tests__/helpers'

describe('useAnimalListFilters', () => {
  async function mountFilters(path = '/panel/animals') {
    const router = await createTestRouter()
    await router.push(path)
    await router.isReady()

    const replaceSpy = vi.spyOn(router, 'replace')
    const pushSpy = vi.spyOn(router, 'push')

    const Host = defineComponent({
      setup() {
        return useAnimalListFilters()
      },
      template: '<div />',
    })

    const wrapper = mount(Host, {
      global: { plugins: [router] },
    })

    return { wrapper, router, replaceSpy, pushSpy }
  }

  it('reads valid filters from the route query', async () => {
    const { wrapper } = await mountFilters(
      `/panel/animals?status=${AnimalStatus.Adopted}&species=${AnimalSpecies.Dog}&orderBy=${AnimalOrderBy.NameDesc}`,
    )

    expect(wrapper.vm.filters).toEqual({
      status: AnimalStatus.Adopted,
      species: AnimalSpecies.Dog,
      orderBy: AnimalOrderBy.NameDesc,
    })
    expect(wrapper.vm.hasNarrowingFilters).toBe(true)
  })

  it('reads filters from the public home route', async () => {
    const { wrapper } = await mountFilters(`/?species=${AnimalSpecies.Dog}`)

    expect(wrapper.vm.filters).toEqual({ species: AnimalSpecies.Dog })
    expect(wrapper.vm.hasNarrowingFilters).toBe(true)
  })

  it('treats orderBy alone as inactive filters', async () => {
    const { wrapper } = await mountFilters(`/panel/animals?orderBy=${AnimalOrderBy.Name}`)

    expect(wrapper.vm.filters).toEqual({ orderBy: AnimalOrderBy.Name })
    expect(wrapper.vm.hasNarrowingFilters).toBe(false)
  })

  it('ignores invalid query values without rewriting the URL', async () => {
    const { wrapper, replaceSpy } = await mountFilters(
      '/panel/animals?species=Elephant&orderBy=bogus',
    )

    expect(wrapper.vm.filters).toEqual({})
    expect(wrapper.vm.hasNarrowingFilters).toBe(false)
    expect(replaceSpy).not.toHaveBeenCalled()
  })

  it('sets a filter with replace and accumulates keys', async () => {
    const { wrapper, router, replaceSpy, pushSpy } = await mountFilters()

    wrapper.vm.setFilter('status', AnimalStatus.Adopted)
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe(`/panel/animals?status=${AnimalStatus.Adopted}`)
    expect(replaceSpy).toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()

    wrapper.vm.setFilter('species', AnimalSpecies.Dog)
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({
      status: AnimalStatus.Adopted,
      species: AnimalSpecies.Dog,
    })
  })

  it('clears a single filter key when value is undefined', async () => {
    const { wrapper, router } = await mountFilters(
      `/panel/animals?status=${AnimalStatus.Adopted}&species=${AnimalSpecies.Dog}`,
    )

    wrapper.vm.setFilter('status', undefined)
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ species: AnimalSpecies.Dog })
  })

  it('clears all filters', async () => {
    const { wrapper, router, replaceSpy } = await mountFilters(
      `/panel/animals?status=${AnimalStatus.Adopted}&species=${AnimalSpecies.Dog}`,
    )

    wrapper.vm.clearFilters()
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/panel/animals')
    expect(router.currentRoute.value.query).toEqual({})
    expect(replaceSpy).toHaveBeenCalled()
  })
})

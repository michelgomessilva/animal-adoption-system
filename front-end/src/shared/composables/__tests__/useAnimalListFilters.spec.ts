import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import { useAnimalListFilters } from '@/shared/composables/useAnimalListFilters'
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
      '/panel/animals?status=Adopted&species=Dog&orderBy=name_desc',
    )

    expect(wrapper.vm.filters).toEqual({
      status: 'Adopted',
      species: 'Dog',
      orderBy: 'name_desc',
    })
    expect(wrapper.vm.hasNarrowingFilters).toBe(true)
  })

  it('reads filters from the public home route', async () => {
    const { wrapper } = await mountFilters('/?species=Dog')

    expect(wrapper.vm.filters).toEqual({ species: 'Dog' })
    expect(wrapper.vm.hasNarrowingFilters).toBe(true)
  })

  it('treats orderBy alone as inactive filters', async () => {
    const { wrapper } = await mountFilters('/panel/animals?orderBy=name')

    expect(wrapper.vm.filters).toEqual({ orderBy: 'name' })
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

    wrapper.vm.setFilter('status', 'Adopted')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/panel/animals?status=Adopted')
    expect(replaceSpy).toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()

    wrapper.vm.setFilter('species', 'Dog')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ status: 'Adopted', species: 'Dog' })
  })

  it('clears a single filter key when value is undefined', async () => {
    const { wrapper, router } = await mountFilters('/panel/animals?status=Adopted&species=Dog')

    wrapper.vm.setFilter('status', undefined)
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ species: 'Dog' })
  })

  it('clears all filters', async () => {
    const { wrapper, router, replaceSpy } = await mountFilters(
      '/panel/animals?status=Adopted&species=Dog',
    )

    wrapper.vm.clearFilters()
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/panel/animals')
    expect(router.currentRoute.value.query).toEqual({})
    expect(replaceSpy).toHaveBeenCalled()
  })
})

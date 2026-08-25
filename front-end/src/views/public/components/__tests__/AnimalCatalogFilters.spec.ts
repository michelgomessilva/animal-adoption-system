import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalCatalogFilters from '@/views/public/components/AnimalCatalogFilters.vue'

describe('AnimalCatalogFilters', () => {
  it('renders Portuguese labels for species, sex, and size', () => {
    const wrapper = mount(AnimalCatalogFilters, {
      props: { filters: {} },
    })

    expect(wrapper.find('[aria-label="Filtros do catálogo"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Filtros')
    expect(wrapper.text()).toContain('Espécie')
    expect(wrapper.text()).toContain('Sexo')
    expect(wrapper.text()).toContain('Porte')
    expect(wrapper.text()).toContain('Cachorro')
    expect(wrapper.text()).toContain('Gato')
    expect(wrapper.text()).toContain('Macho')
    expect(wrapper.text()).toContain('Fêmea')
    expect(wrapper.text()).toContain('Pequeno')
    expect(wrapper.text()).toContain('Médio')
    expect(wrapper.text()).toContain('Grande')
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Limpar')
  })

  it('emits setFilter with Cat when Gato is clicked', async () => {
    const wrapper = mount(AnimalCatalogFilters, {
      props: { filters: {} },
    })

    const gato = wrapper.findAll('button').find((button) => button.text() === 'Gato')
    expect(gato).toBeDefined()
    await gato!.trigger('click')

    expect(wrapper.emitted('setFilter')).toEqual([['species', 'Cat']])
  })

  it('emits setFilter with undefined when the active species is clicked again', async () => {
    const wrapper = mount(AnimalCatalogFilters, {
      props: { filters: { species: 'Cat' } },
    })

    const gato = wrapper.findAll('button').find((button) => button.text() === 'Gato')
    expect(gato).toBeDefined()
    expect(gato!.attributes('aria-pressed')).toBe('true')
    await gato!.trigger('click')

    expect(wrapper.emitted('setFilter')).toEqual([['species', undefined]])
  })

  it('shows Limpar when orderBy alone is set and emits clear', async () => {
    const inactive = mount(AnimalCatalogFilters, {
      props: { filters: {} },
    })
    expect(inactive.text()).not.toContain('Limpar')

    const active = mount(AnimalCatalogFilters, {
      props: { filters: { orderBy: 'createdAt_desc' } },
    })
    const clear = active.get('button.btn-ghost')
    expect(clear.text()).toBe('Limpar')

    await clear.trigger('click')
    expect(active.emitted('clear')).toEqual([[]])
  })

  it('marks the active size with btn-active and aria-pressed', () => {
    const wrapper = mount(AnimalCatalogFilters, {
      props: { filters: { size: 'Medium' } },
    })

    const medio = wrapper.findAll('button').find((button) => button.text() === 'Médio')
    expect(medio).toBeDefined()
    expect(medio!.classes()).toContain('btn-active')
    expect(medio!.attributes('aria-pressed')).toBe('true')
  })
})

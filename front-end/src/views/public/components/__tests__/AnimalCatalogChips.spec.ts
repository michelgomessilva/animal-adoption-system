import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {
  AnimalOrderBy,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '@/shared/types/animal'
import AnimalCatalogChips from '@/views/public/components/AnimalCatalogChips.vue'

describe('AnimalCatalogChips', () => {
  it('renders nothing when there are no narrowing filters', () => {
    const empty = mount(AnimalCatalogChips, {
      props: { filters: {} },
    })
    expect(empty.find('ul').exists()).toBe(false)

    const onlyOrder = mount(AnimalCatalogChips, {
      props: { filters: { orderBy: AnimalOrderBy.Name } },
    })
    expect(onlyOrder.find('ul').exists()).toBe(false)

    const onlyStatus = mount(AnimalCatalogChips, {
      props: { filters: { status: AnimalStatus.Available } },
    })
    expect(onlyStatus.find('ul').exists()).toBe(false)
  })

  it('renders chips for species, sex, and size only', () => {
    const wrapper = mount(AnimalCatalogChips, {
      props: {
        filters: {
          species: AnimalSpecies.Dog,
          sex: AnimalSex.Female,
          size: AnimalSize.Medium,
          orderBy: AnimalOrderBy.Name,
          status: AnimalStatus.Available,
        },
      },
    })

    expect(wrapper.text()).toContain('Cachorro')
    expect(wrapper.text()).toContain('Fêmea')
    expect(wrapper.text()).toContain('Médio')
    expect(wrapper.text()).not.toContain('Nome')
    expect(wrapper.text()).not.toContain('Disponível')
    expect(wrapper.findAll('button')).toHaveLength(3)
  })

  it('emits removeFilter when a chip is removed', async () => {
    const wrapper = mount(AnimalCatalogChips, {
      props: { filters: { species: AnimalSpecies.Dog, orderBy: AnimalOrderBy.Name } },
    })

    await wrapper.get('[aria-label="Remover filtro Cachorro"]').trigger('click')

    expect(wrapper.emitted('removeFilter')).toEqual([['species']])
  })
})

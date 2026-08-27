import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {
  AnimalOrderBy,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '@/shared/types/animal'
import AnimalListFilters from '@/views/panel/components/AnimalListFilters.vue'

describe('AnimalListFilters', () => {
  it('renders Portuguese labels and empty “Todos/Todas” options', () => {
    const wrapper = mount(AnimalListFilters, {
      props: { filters: {} },
    })

    expect(wrapper.find('[aria-label="Filtros da listagem"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Espécie')
    expect(wrapper.text()).toContain('Sexo')
    expect(wrapper.text()).toContain('Porte')
    expect(wrapper.text()).toContain('Situação')
    expect(wrapper.text()).toContain('Ordenar por')
    expect(wrapper.text()).toContain('Cachorro')
    expect(wrapper.text()).toContain('Gato')
    expect(wrapper.text()).toContain('Disponível')
    expect(wrapper.text()).toContain('Em processo de adoção')
    expect(wrapper.text()).toContain('Adotado')
    expect(wrapper.text()).toContain('Nome (A–Z)')
    expect(wrapper.text()).toContain('Mais recentes')
    expect(wrapper.get('select[name="species"]').text()).toContain('Todas')
    expect(wrapper.get('select[name="sex"]').text()).toContain('Todos')
    expect(wrapper.get('select[name="orderBy"]').text()).toContain('Padrão')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('emits setFilter with Cat when Espécie changes to Gato', async () => {
    const wrapper = mount(AnimalListFilters, {
      props: { filters: {} },
    })

    await wrapper.get('select[name="species"]').setValue(AnimalSpecies.Cat)

    expect(wrapper.emitted('setFilter')).toEqual([['species', AnimalSpecies.Cat]])
  })

  it('emits setFilter with orderBy when Ordenar por changes', async () => {
    const wrapper = mount(AnimalListFilters, {
      props: { filters: {} },
    })

    await wrapper.get('select[name="orderBy"]').setValue(AnimalOrderBy.Name)

    expect(wrapper.emitted('setFilter')).toEqual([['orderBy', AnimalOrderBy.Name]])
  })

  it('emits setFilter with undefined when Espécie is cleared', async () => {
    const wrapper = mount(AnimalListFilters, {
      props: { filters: { species: AnimalSpecies.Dog } },
    })

    await wrapper.get('select[name="species"]').setValue('')

    expect(wrapper.emitted('setFilter')).toEqual([['species', undefined]])
  })

  it('shows Limpar filtros when orderBy is active and emits clear', async () => {
    const inactive = mount(AnimalListFilters, {
      props: { filters: {} },
    })
    expect(inactive.find('button').exists()).toBe(false)

    const active = mount(AnimalListFilters, {
      props: { filters: { orderBy: AnimalOrderBy.CreatedAtDesc } },
    })
    const clear = active.get('button')
    expect(clear.text()).toBe('Limpar filtros')

    await clear.trigger('click')
    expect(active.emitted('clear')).toEqual([[]])
  })

  it('reflects current filter values in the selects', () => {
    const wrapper = mount(AnimalListFilters, {
      props: {
        filters: {
          species: AnimalSpecies.Cat,
          sex: AnimalSex.Female,
          size: AnimalSize.Small,
          status: AnimalStatus.Adopted,
          orderBy: AnimalOrderBy.NameDesc,
        },
      },
    })

    expect(wrapper.get('select[name="species"]').element).toMatchObject({
      value: AnimalSpecies.Cat,
    })
    expect(wrapper.get('select[name="sex"]').element).toMatchObject({ value: AnimalSex.Female })
    expect(wrapper.get('select[name="size"]').element).toMatchObject({ value: AnimalSize.Small })
    expect(wrapper.get('select[name="status"]').element).toMatchObject({
      value: AnimalStatus.Adopted,
    })
    expect(wrapper.get('select[name="orderBy"]').element).toMatchObject({
      value: AnimalOrderBy.NameDesc,
    })
  })
})

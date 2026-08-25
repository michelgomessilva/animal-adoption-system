import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
    expect(wrapper.text()).toContain('Cachorro')
    expect(wrapper.text()).toContain('Gato')
    expect(wrapper.text()).toContain('Disponível')
    expect(wrapper.text()).toContain('Adotado')
    expect(wrapper.get('select[name="species"]').text()).toContain('Todas')
    expect(wrapper.get('select[name="sex"]').text()).toContain('Todos')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('emits setFilter with Cat when Espécie changes to Gato', async () => {
    const wrapper = mount(AnimalListFilters, {
      props: { filters: {} },
    })

    await wrapper.get('select[name="species"]').setValue('Cat')

    expect(wrapper.emitted('setFilter')).toEqual([['species', 'Cat']])
  })

  it('emits setFilter with undefined when Espécie is cleared', async () => {
    const wrapper = mount(AnimalListFilters, {
      props: { filters: { species: 'Dog' } },
    })

    await wrapper.get('select[name="species"]').setValue('')

    expect(wrapper.emitted('setFilter')).toEqual([['species', undefined]])
  })

  it('shows Limpar filtros only when filters are active and emits clear', async () => {
    const inactive = mount(AnimalListFilters, {
      props: { filters: {} },
    })
    expect(inactive.find('button').exists()).toBe(false)

    const active = mount(AnimalListFilters, {
      props: { filters: { status: 'Adopted' } },
    })
    const clear = active.get('button')
    expect(clear.text()).toBe('Limpar filtros')

    await clear.trigger('click')
    expect(active.emitted('clear')).toEqual([[]])
  })

  it('reflects current filter values in the selects', () => {
    const wrapper = mount(AnimalListFilters, {
      props: {
        filters: { species: 'Cat', sex: 'Female', size: 'Small', status: 'Adopted' },
      },
    })

    expect(wrapper.get('select[name="species"]').element).toMatchObject({ value: 'Cat' })
    expect(wrapper.get('select[name="sex"]').element).toMatchObject({ value: 'Female' })
    expect(wrapper.get('select[name="size"]').element).toMatchObject({ value: 'Small' })
    expect(wrapper.get('select[name="status"]').element).toMatchObject({ value: 'Adopted' })
  })
})

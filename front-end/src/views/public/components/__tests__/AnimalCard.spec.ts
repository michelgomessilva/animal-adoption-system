import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { Animal } from '@/shared/types/animal'
import AnimalCard from '@/views/public/components/AnimalCard.vue'
import { createAnimal, createTestRouter } from '@/__tests__/helpers'

describe('AnimalCard', () => {
  it('links the whole card to the animal details page', async () => {
    const router = await createTestRouter()
    const animal = createAnimal()
    const wrapper = mount(AnimalCard, {
      props: { animal },
      global: { plugins: [router] },
    })

    expect(wrapper.get('a').attributes('href')).toBe(`/animais/${animal.id}`)
    expect(wrapper.get('h2').text()).toBe('Luna')
    expect(wrapper.text()).toContain('3 anos')
    expect(wrapper.text()).toContain('Centro, Porto Alegre')
  })

  it('renders gracefully when enum and name fields are invalid', async () => {
    const router = await createTestRouter()
    const animal = {
      ...createAnimal({ image: '' }),
      name: '',
      species: 'None',
      size: 4,
    } as unknown as Animal
    const wrapper = mount(AnimalCard, {
      props: { animal },
      global: { plugins: [router] },
    })

    expect(wrapper.get('a').attributes('href')).toBe(`/animais/${animal.id}`)
    expect(wrapper.get('h2').text()).toBe('Sem nome')
    expect(wrapper.text()).toContain('Não informado')
    expect(wrapper.find('[data-icon="paw-print"]').exists()).toBe(true)
  })
})

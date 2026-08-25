import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
})

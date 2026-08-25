import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AnimalImage from '@/shared/components/AnimalImage.vue'

describe('AnimalImage', () => {
  it('renders the photo when a URL is provided', () => {
    const wrapper = mount(AnimalImage, {
      props: { src: 'https://example.com/luna.jpg', name: 'Luna', species: 'Dog' },
    })

    expect(wrapper.get('img').attributes('src')).toBe('https://example.com/luna.jpg')
    expect(wrapper.get('img').attributes('alt')).toBe('Foto de Luna')
    expect(wrapper.get('img').attributes('loading')).toBe('lazy')
    expect(wrapper.find('[data-icon="dog"]').exists()).toBe(false)
  })

  it('loads the photo eagerly when priority is set', () => {
    const wrapper = mount(AnimalImage, {
      props: {
        src: 'https://example.com/luna.jpg',
        name: 'Luna',
        species: 'Dog',
        priority: true,
      },
    })

    expect(wrapper.get('img').attributes('loading')).toBe('eager')
    expect(wrapper.get('img').attributes('fetchpriority')).toBe('high')
  })

  it('shows a species fallback when the URL is empty', () => {
    const wrapper = mount(AnimalImage, {
      props: { src: '', name: 'Mimi', species: 'Cat' },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('[data-icon="cat"]').exists()).toBe(true)
    expect(wrapper.classes()).toContain('animal-image--cat')
  })

  it('applies the dog tone class for Dog fallbacks', () => {
    const wrapper = mount(AnimalImage, {
      props: { src: '', name: 'Rex', species: 'Dog' },
    })

    expect(wrapper.classes()).toContain('animal-image--dog')
    expect(wrapper.find('[data-icon="dog"]').exists()).toBe(true)
  })

  it('shows a species fallback when the photo fails to load', async () => {
    const wrapper = mount(AnimalImage, {
      props: { src: 'https://example.com/missing.jpg', name: 'Luna', species: 'Dog' },
    })

    await wrapper.get('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('[data-icon="dog"]').exists()).toBe(true)
  })
})

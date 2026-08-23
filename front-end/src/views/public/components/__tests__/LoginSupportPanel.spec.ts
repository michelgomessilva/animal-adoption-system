import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import LoginSupportPanel from '@/views/public/components/LoginSupportPanel.vue'

describe('LoginSupportPanel', () => {
  it('uses the local companions illustration as decorative media', () => {
    const wrapper = mount(LoginSupportPanel)
    const image = wrapper.get('img')

    expect(image.attributes('src')).toMatch(/^data:image\/svg\+xml/)
    expect(image.attributes('src')).not.toContain('picsum.photos')
    expect(image.attributes('alt')).toBe('')
  })
})

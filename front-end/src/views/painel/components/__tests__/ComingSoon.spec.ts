import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import ComingSoon from '@/views/painel/components/ComingSoon.vue'

describe('ComingSoon', () => {
  it('shows Em breve and marks the chrome as disabled', () => {
    const wrapper = mount(ComingSoon, {
      slots: { default: '<button type="button">Arquivar</button>' },
    })

    expect(wrapper.text()).toContain('Em breve')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('does not run a click handler on the slotted control', async () => {
    const onClick = vi.fn<() => void>()
    const Host = defineComponent({
      components: { ComingSoon },
      setup() {
        return { onClick }
      },
      template: `
        <ComingSoon>
          <button type="button" @click="onClick">Arquivar</button>
        </ComingSoon>
      `,
    })
    const wrapper = mount(Host)

    await wrapper.get('button').trigger('click')

    expect(onClick).not.toHaveBeenCalled()
  })
})

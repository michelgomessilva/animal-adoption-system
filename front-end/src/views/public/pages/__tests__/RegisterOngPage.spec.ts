import { describe, expect, it } from 'vitest'

import RegisterOngPage from '@/views/public/pages/RegisterOngPage.vue'
import { mountWithPlugins } from '@/__tests__/helpers'

describe('RegisterOngPage', () => {
  it('explains that there is no self-serve signup', async () => {
    const wrapper = await mountWithPlugins(RegisterOngPage)

    expect(wrapper.get('h1').text()).toBe('Cadastro de ONG')
    expect(wrapper.text()).toContain('não há auto-cadastro')
    expect(wrapper.get('a[href="/entrar"]').text()).toContain('Ir para o login')
  })
})

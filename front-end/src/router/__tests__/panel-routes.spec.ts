import { describe, expect, it } from 'vitest'

import { panelRoutes } from '@/router/routes/panel'
import { publicRoutes } from '@/router/routes/public'

describe('panel route splitting', () => {
  it('loads panel views only through async factories', () => {
    expect(panelRoutes.component).toEqual(expect.any(Function))

    const namedChildren = panelRoutes.children?.filter((route) => route.name !== undefined) ?? []
    expect(namedChildren.length).toBeGreaterThan(0)
    for (const route of namedChildren) {
      expect(route.component).toEqual(expect.any(Function))
    }
  })

  it('keeps the public shell eager', () => {
    expect(publicRoutes.component).not.toEqual(expect.any(Function))
    expect(publicRoutes.children?.find((route) => route.name === 'home')?.component).not.toEqual(
      expect.any(Function),
    )
  })
})

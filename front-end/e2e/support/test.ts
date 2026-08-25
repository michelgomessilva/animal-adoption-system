import { test as base } from '@playwright/test'

import { faker } from './faker'

export const test = base.extend<{ fakerSeed: number }>({
  fakerSeed: [
    // Playwright requires a destructured first argument; this fixture has no deps.
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      const seed = faker.seed()
      testInfo.annotations.push({ type: 'faker-seed', description: String(seed) })
      await use(seed)
    },
    { auto: true },
  ],
})

export { expect } from '@playwright/test'

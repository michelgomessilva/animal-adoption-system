import type { Page } from '@playwright/test'

import type { ApiSession } from './api'

// Must match AUTH_SESSION_KEY in src/shared/stores/auth.store.ts.
const AUTH_SESSION_KEY = 'poa.auth.session'

export async function injectSession(page: Page, session: ApiSession): Promise<void> {
  await page.addInitScript(
    ({ key, value }) => {
      sessionStorage.setItem(key, value)
    },
    { key: AUTH_SESSION_KEY, value: JSON.stringify(session) },
  )
}

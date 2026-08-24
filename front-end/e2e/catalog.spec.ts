import { expect, test } from '@playwright/test'

import { createAnimalViaApi, loginViaApi } from './support/api'
import { uniqueAnimalName } from './support/unique'

test('the public catalog shows an available pet created via the API', async ({ page, request }) => {
  const session = await loginViaApi(request)
  const name = uniqueAnimalName()
  await createAnimalViaApi(request, session.token, name)

  await page.goto('/')

  await expect(page.getByRole('heading', { name, level: 2 })).toBeVisible()
})

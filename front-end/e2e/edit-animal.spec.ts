import { expect, test } from '@playwright/test'

import { createAnimalViaApi, loginViaApi } from './support/api'
import { injectSession } from './support/session'
import { uniqueAnimalName } from './support/unique'

test('staff can edit a pet through the wizard', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const originalName = uniqueAnimalName()
  const animal = await createAnimalViaApi(request, session.token, originalName)
  const updatedName = uniqueAnimalName()

  await page.goto(`/panel/animals/${animal.id}/edit`)
  await expect(page.locator('input[name="name"]')).toHaveValue(originalName)

  await page.locator('input[name="name"]').fill(updatedName)

  const locationNav = page.getByRole('button', { name: /Localização/ })
  await locationNav.click()
  await page.getByRole('button', { name: 'Salvar' }).click()

  await expect(page).toHaveURL(/\/panel\/animals/)
  await expect(page.getByRole('cell', { name: updatedName })).toBeVisible()
})

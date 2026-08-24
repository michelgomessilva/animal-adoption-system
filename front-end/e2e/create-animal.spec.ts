import { expect, test } from '@playwright/test'

import { loginViaApi } from './support/api'
import { injectSession } from './support/session'
import { uniqueAnimalName } from './support/unique'

test('staff can register a pet through the wizard', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const name = uniqueAnimalName()

  await page.goto('/panel/animals/new')
  await page.locator('input[name="name"]').fill(name)
  await page.locator('input[name="approximateAge"]').fill('3')
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.locator('textarea[name="description"]').fill('Pet cadastrado pelo teste E2E.')
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.locator('input[name="district"]').fill('Centro')
  await page.locator('input[name="city"]').fill('Porto Alegre')
  await page.getByRole('button', { name: 'Cadastrar' }).click()

  await expect(page).toHaveURL(/\/panel\/animals/)
  await expect(page.getByRole('cell', { name })).toBeVisible()
})

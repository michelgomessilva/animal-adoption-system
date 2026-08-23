import { expect, test } from '@playwright/test'

import { requireE2eCredentials } from './support/env'

test('staff can sign in and reach Meus pets', async ({ page }) => {
  const { username, password } = requireE2eCredentials()

  await page.goto('/entrar')
  await page.locator('input[name="username"]').fill(username)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL(/\/panel\/animals/)
  await expect(page.getByRole('heading', { name: 'Meus pets' })).toBeVisible()
})

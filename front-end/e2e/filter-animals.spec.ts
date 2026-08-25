import { expect, test } from '@playwright/test'

import { createAnimalViaApi, loginViaApi } from './support/api'
import { injectSession } from './support/session'
import { uniqueAnimalName } from './support/unique'

test('staff can filter Meus pets by species', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const dogName = uniqueAnimalName()
  const catName = uniqueAnimalName()
  await createAnimalViaApi(request, session.token, dogName, { species: 'Dog' })
  await createAnimalViaApi(request, session.token, catName, { species: 'Cat' })

  await page.goto('/panel/animals')
  await expect(page.getByRole('heading', { name: 'Meus pets' })).toBeVisible()
  await expect(page.getByRole('cell', { name: dogName })).toBeVisible()
  await expect(page.getByRole('cell', { name: catName })).toBeVisible()

  await page.locator('select[name="species"]').selectOption('Cat')

  await expect(page).toHaveURL(/\/panel\/animals\?species=Cat/)
  await expect(page.getByRole('cell', { name: catName })).toBeVisible()
  await expect(page.getByRole('cell', { name: dogName })).toHaveCount(0)

  await page.getByRole('button', { name: 'Limpar filtros' }).click()

  await expect(page).toHaveURL(/\/panel\/animals\/?$/)
  await expect(page.getByRole('cell', { name: dogName })).toBeVisible()
  await expect(page.getByRole('cell', { name: catName })).toBeVisible()
})

test('staff can sort Meus pets by name', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const laterName = uniqueAnimalName('e2e-z')
  const earlierName = uniqueAnimalName('e2e-a')
  await createAnimalViaApi(request, session.token, laterName)
  await createAnimalViaApi(request, session.token, earlierName)

  await page.goto('/panel/animals')
  await expect(page.getByRole('cell', { name: earlierName })).toBeVisible()
  await expect(page.getByRole('cell', { name: laterName })).toBeVisible()

  await page.locator('select[name="orderBy"]').selectOption('name')

  await expect(page).toHaveURL(/orderBy=name/)

  const rows = page.locator('table tbody tr')
  const texts = await rows.allTextContents()
  const earlierIndex = texts.findIndex((text) => text.includes(earlierName))
  const laterIndex = texts.findIndex((text) => text.includes(laterName))

  expect(earlierIndex).toBeGreaterThanOrEqual(0)
  expect(laterIndex).toBeGreaterThanOrEqual(0)
  expect(earlierIndex).toBeLessThan(laterIndex)
})

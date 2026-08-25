import { expect, test } from '@playwright/test'

import { createAnimalViaApi, loginViaApi } from './support/api'
import { uniqueAnimalName } from './support/unique'

test('visitors can filter the public catalog by species', async ({ page, request }) => {
  const session = await loginViaApi(request)

  const dogName = uniqueAnimalName()
  const catName = uniqueAnimalName()
  await createAnimalViaApi(request, session.token, dogName, { species: 'Dog' })
  await createAnimalViaApi(request, session.token, catName, { species: 'Cat' })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: dogName, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: catName, level: 2 })).toBeVisible()

  await page.getByRole('button', { name: 'Gato' }).click()

  await expect(page).toHaveURL(/\/\?species=Cat/)
  await expect(page.getByRole('heading', { name: catName, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: dogName, level: 2 })).toHaveCount(0)

  await page.getByRole('button', { name: 'Limpar' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: dogName, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: catName, level: 2 })).toBeVisible()
})

test('visitors can sort the public catalog by name', async ({ page, request }) => {
  const session = await loginViaApi(request)

  const laterName = uniqueAnimalName('e2e-z')
  const earlierName = uniqueAnimalName('e2e-a')
  await createAnimalViaApi(request, session.token, laterName)
  await createAnimalViaApi(request, session.token, earlierName)

  await page.goto('/')
  await expect(page.getByRole('heading', { name: earlierName, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: laterName, level: 2 })).toBeVisible()

  await page.locator('select[name="orderBy"]').selectOption('name')

  await expect(page).toHaveURL(/orderBy=name/)

  const headings = page.locator('.home-page-grid h2')
  const texts = await headings.allTextContents()
  const earlierIndex = texts.findIndex((text) => text.includes(earlierName))
  const laterIndex = texts.findIndex((text) => text.includes(laterName))

  expect(earlierIndex).toBeGreaterThanOrEqual(0)
  expect(laterIndex).toBeGreaterThanOrEqual(0)
  expect(earlierIndex).toBeLessThan(laterIndex)
})

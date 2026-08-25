import { createAnimalViaApi, listAnimalsViaApi, loginViaApi } from './support/api'
import { CATALOG_FILTER_KEYS, filterLabel, randomFilterContrast } from './support/animal'
import { faker } from './support/faker'
import { expect, test } from './support/test'

test('visitors can filter the public catalog', async ({ page, request }) => {
  const session = await loginViaApi(request)

  const contrast = randomFilterContrast(CATALOG_FILTER_KEYS)
  test.info().annotations.push({
    type: 'filter',
    description: `${contrast.key}=${contrast.included}`,
  })

  const match = await createAnimalViaApi(request, session.token, {
    [contrast.key]: contrast.included,
  })
  const other = await createAnimalViaApi(request, session.token, {
    [contrast.key]: contrast.excluded,
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: match.name, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: other.name, level: 2 })).toBeVisible()

  await page
    .getByRole('button', { name: filterLabel(contrast.key, contrast.included), exact: true })
    .click()

  await expect(page).toHaveURL(new RegExp(`[?&]${contrast.key}=${contrast.included}(?:&|$)`))
  await expect(page.getByRole('heading', { name: match.name, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: other.name, level: 2 })).toHaveCount(0)

  await page.getByRole('button', { name: 'Limpar' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: match.name, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: other.name, level: 2 })).toBeVisible()
})

test('visitors can sort the public catalog by name', async ({ page, request }) => {
  const session = await loginViaApi(request)

  const orderBy = faker.helpers.arrayElement(['name', 'name_desc'] as const)
  test.info().annotations.push({ type: 'orderBy', description: orderBy })

  const first = await createAnimalViaApi(request, session.token)
  const second = await createAnimalViaApi(request, session.token)

  await page.goto('/')
  await expect(page.getByRole('heading', { name: first.name, level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: second.name, level: 2 })).toBeVisible()

  await page.locator('select[name="orderBy"]').selectOption(orderBy)

  await expect(page).toHaveURL(new RegExp(`[?&]orderBy=${orderBy}(?:&|$)`))

  const listed = await listAnimalsViaApi(request, { orderBy })
  const apiNames = listed.map((animal) => animal.name)
  const apiFirst = apiNames.indexOf(first.name)
  const apiSecond = apiNames.indexOf(second.name)
  expect(apiFirst).toBeGreaterThanOrEqual(0)
  expect(apiSecond).toBeGreaterThanOrEqual(0)

  const texts = await page
    .locator('.home-page-grid')
    .getByRole('heading', { level: 2 })
    .allTextContents()
  const uiFirst = texts.findIndex((text) => text.includes(first.name))
  const uiSecond = texts.findIndex((text) => text.includes(second.name))
  expect(uiFirst).toBeGreaterThanOrEqual(0)
  expect(uiSecond).toBeGreaterThanOrEqual(0)
  expect(Math.sign(uiFirst - uiSecond)).toBe(Math.sign(apiFirst - apiSecond))
})

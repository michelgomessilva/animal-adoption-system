import { createAnimalViaApi, listAnimalsViaApi, loginViaApi } from './support/api'
import { PANEL_FILTER_KEYS, randomFilterContrast } from './support/animal'
import { faker } from './support/faker'
import { injectSession } from './support/session'
import { expect, test } from './support/test'

test('staff can filter Meus pets', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const contrast = randomFilterContrast(PANEL_FILTER_KEYS)
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

  await page.goto('/panel/animals')
  await expect(page.getByRole('heading', { name: 'Meus pets' })).toBeVisible()
  await expect(page.getByRole('cell', { name: match.name, exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: other.name, exact: true })).toBeVisible()

  await page.locator(`select[name="${contrast.key}"]`).selectOption(contrast.included)

  await expect(page).toHaveURL(new RegExp(`[?&]${contrast.key}=${contrast.included}(?:&|$)`))
  await expect(page.getByRole('cell', { name: match.name, exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: other.name, exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Limpar filtros' }).click()

  await expect(page).toHaveURL(/\/panel\/animals\/?$/)
  await expect(page.getByRole('cell', { name: match.name, exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: other.name, exact: true })).toBeVisible()
})

test('staff can sort Meus pets by name', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const orderBy = faker.helpers.arrayElement(['name', 'name_desc'] as const)
  test.info().annotations.push({ type: 'orderBy', description: orderBy })

  const first = await createAnimalViaApi(request, session.token)
  const second = await createAnimalViaApi(request, session.token)

  await page.goto('/panel/animals')
  await expect(page.getByRole('cell', { name: first.name, exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: second.name, exact: true })).toBeVisible()

  await page.locator('select[name="orderBy"]').selectOption(orderBy)

  await expect(page).toHaveURL(new RegExp(`[?&]orderBy=${orderBy}(?:&|$)`))

  const listed = await listAnimalsViaApi(request, { orderBy }, session.token)
  const apiNames = listed.map((animal) => animal.name)
  const apiFirst = apiNames.indexOf(first.name)
  const apiSecond = apiNames.indexOf(second.name)
  expect(apiFirst).toBeGreaterThanOrEqual(0)
  expect(apiSecond).toBeGreaterThanOrEqual(0)

  const texts = await page.locator('table tbody tr').allTextContents()
  const uiFirst = texts.findIndex((text) => text.includes(first.name))
  const uiSecond = texts.findIndex((text) => text.includes(second.name))
  expect(uiFirst).toBeGreaterThanOrEqual(0)
  expect(uiSecond).toBeGreaterThanOrEqual(0)
  expect(Math.sign(uiFirst - uiSecond)).toBe(Math.sign(apiFirst - apiSecond))
})

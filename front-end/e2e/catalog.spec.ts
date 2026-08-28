import { createAnimalViaApi, loginViaApi } from './support/api'
import { expect, test } from './support/test'

test('the public catalog shows an available pet created via the API', async ({ page, request }) => {
  const session = await loginViaApi(request)
  const animal = await createAnimalViaApi(request, session.token)

  await page.goto('/')

  await expect(page.getByRole('heading', { name: animal.name, level: 2 })).toBeVisible()
  await expect(page.getByText(animal.city, { exact: false }).first()).toBeVisible()
})

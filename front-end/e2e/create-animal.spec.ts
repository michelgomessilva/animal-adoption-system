import { loginViaApi } from './support/api'
import { filterLabel, randomAnimalInput } from './support/animal'
import { injectSession } from './support/session'
import { expect, test } from './support/test'
import { fillWizardSteps } from './support/wizard'

test('staff can register a pet through the wizard', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const input = randomAnimalInput()

  await page.goto('/panel/animals/new')
  await fillWizardSteps(page, input)
  await page.getByRole('button', { name: 'Cadastrar' }).click()

  await expect(page).toHaveURL(/\/panel\/animals/)

  const row = page.getByRole('row', { name: input.name })
  await expect(row.getByRole('cell', { name: input.name, exact: true })).toBeVisible()
  await expect(row.getByRole('cell', { name: filterLabel('species', input.species) })).toBeVisible()
  await expect(row.getByRole('cell', { name: filterLabel('sex', input.sex) })).toBeVisible()
  await expect(row.getByRole('cell', { name: filterLabel('size', input.size) })).toBeVisible()
  await expect(row.getByRole('cell', { name: input.city, exact: true })).toBeVisible()
})

import { createAnimalViaApi, loginViaApi } from './support/api'
import { randomAnimalInput } from './support/animal'
import { injectSession } from './support/session'
import { expect, test } from './support/test'
import { fillWizardSteps } from './support/wizard'

test('staff can edit a pet through the wizard', async ({ page, request }) => {
  const session = await loginViaApi(request)
  await injectSession(page, session)

  const original = randomAnimalInput()
  const animal = await createAnimalViaApi(request, session.token, original)
  const updated = randomAnimalInput()

  await page.goto(`/panel/animals/${animal.id}/edit`)
  await expect(page.locator('input[name="name"]')).toHaveValue(original.name)

  await fillWizardSteps(page, updated)
  await page.getByRole('button', { name: 'Salvar' }).click()

  await expect(page).toHaveURL(/\/panel\/animals/)
  await expect(page.getByRole('cell', { name: updated.name, exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: original.name, exact: true })).toHaveCount(0)
})

import { createAnimalViaApi, loginViaApi } from './support/api'
import { expect, test } from './support/test'
import { animalSpeciesLabel } from '../src/shared/types/animal-labels'

test('the public catalog opens the animal details page', async ({ page, request }) => {
  const session = await loginViaApi(request)
  const animal = await createAnimalViaApi(request, session.token, {
    description: 'Perfil aberto pelo E2E do catálogo público.',
    city: 'Porto Alegre',
    species: 'Dog',
  })

  await page.goto('/')
  await page.getByRole('heading', { name: animal.name, level: 2 }).click()

  await expect(page).toHaveURL(new RegExp(`/animais/${animal.id}$`))
  await expect(page.getByRole('heading', { name: animal.name, level: 1 })).toBeVisible()
  await expect(page.getByText(animal.description)).toBeVisible()
  await expect(page.getByText(animal.city, { exact: false }).first()).toBeVisible()
  await expect(page.getByText(animalSpeciesLabel(animal.species))).toBeVisible()
  await expect(page.getByText('Disponível').first()).toBeVisible()
})

test('an unknown animal id shows the editorial empty state', async ({ page }) => {
  const missingId = '99999999-9999-9999-9999-999999999999'
  await page.goto(`/animais/${missingId}`)

  await expect(page.getByRole('heading', { name: 'Não encontramos esse pet.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Voltar ao catálogo' })).toBeVisible()
})

import type { Page } from '@playwright/test'

import type { AnimalWriteInput } from '../../src/shared/types/animal'

import { filterLabel } from './animal'

async function clickOption(page: Page, label: string): Promise<void> {
  await page.getByRole('button', { name: label, exact: true }).click()
}

export async function fillWizardSteps(page: Page, input: AnimalWriteInput): Promise<void> {
  await page.locator('input[name="name"]').fill(input.name)
  await clickOption(page, filterLabel('species', input.species))
  await clickOption(page, filterLabel('size', input.size))
  await clickOption(page, filterLabel('sex', input.sex))
  await page.locator('input[name="approximateAge"]').fill(String(input.approximateAge))
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.locator('textarea[name="description"]').fill(input.description)
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.locator('input[name="district"]').fill(input.district)
  await page.locator('input[name="parish"]').fill(input.parish)
  await page.locator('input[name="city"]').fill(input.city)
  await clickOption(page, filterLabel('status', input.status))
}

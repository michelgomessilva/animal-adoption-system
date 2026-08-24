export interface E2eCredentials {
  username: string
  password: string
}

export function requireE2eCredentials(): E2eCredentials {
  const username = process.env.E2E_USERNAME?.trim()
  const password = process.env.E2E_PASSWORD?.trim()

  if (!username || !password) {
    throw new Error(
      'E2E_USERNAME and E2E_PASSWORD must be set to the admin credentials of the running API (the same values as ADMIN_SEED_USERNAME / ADMIN_SEED_PASSWORD). See e2e/README.md.',
    )
  }

  return { username, password }
}

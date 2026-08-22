export function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

  if (value === '') {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  return value.replace(/\/$/, '')
}

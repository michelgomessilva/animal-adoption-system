export function getApiBaseUrl(): string {
  // Empty keeps requests same-origin (Vite proxy). Set VITE_API_BASE_URL to call an API host directly.
  const value = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

  return value.replace(/\/$/, '')
}

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

export function getApiBaseUrl(): string {
  const value = import.meta.env.VITE_API_BASE_URL?.trim()
  if (value) {
    return withTrailingSlash(value)
  }

  console.warn('VITE_API_BASE_URL is not configured; falling back to the page origin')
  return withTrailingSlash(globalThis.location.origin)
}

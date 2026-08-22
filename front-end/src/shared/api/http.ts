import { getApiBaseUrl } from '@/shared/config/api-base-url'

import { ApiError } from './api-error'

export interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  body?: unknown
  skipAuth?: boolean
}

let accessTokenGetter: () => string | null = () => null
let unauthorizedHandler: () => void = () => {}

export function setAccessTokenGetter(getter: () => string | null): void {
  accessTokenGetter = getter
}

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

export function resetHttpClient(): void {
  accessTokenGetter = () => null
  unauthorizedHandler = () => {}
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { skipAuth = false, body, headers, ...rest } = init
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`

  const requestHeaders = new Headers(headers)
  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json')
  }

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (!skipAuth) {
    const token = accessTokenGetter()
    if (token !== null) {
      requestHeaders.set('Authorization', `Bearer ${token}`)
    }
  }

  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('network', 0, 'Network request failed')
  }

  if (response.status === 401) {
    if (!skipAuth) {
      unauthorizedHandler()
    }

    throw new ApiError('unauthorized', 401, 'Unauthorized')
  }

  if (response.status === 400) {
    throw new ApiError('bad_request', 400, 'Bad request')
  }

  if (!response.ok) {
    throw new ApiError('unknown', response.status, 'Request failed')
  }

  return (await response.json()) as T
}

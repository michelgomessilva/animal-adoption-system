import { getApiBaseUrl } from '@/shared/config/api-base-url'

import { ApiError } from './api-error'

export interface ApiRequestInit {
  method?: string
  body?: unknown
  skipAuth?: boolean
}

let accessToken: string | null = null
let unauthorizedHandler: () => void = () => {}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

export function resetHttpClient(): void {
  accessToken = null
  unauthorizedHandler = () => {}
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { skipAuth = false, body, method } = init
  const url = `${getApiBaseUrl()}${path}`

  const requestHeaders = new Headers({ Accept: 'application/json' })
  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (!skipAuth && accessToken !== null) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      throw new ApiError('network', 0, 'Network request failed')
    }

    throw error
  }

  if (response.status === 401) {
    if (!skipAuth) {
      unauthorizedHandler()
    }

    throw new ApiError('unauthorized', 401, 'Unauthorized')
  }

  if (!response.ok) {
    throw new ApiError('unknown', response.status, 'Request failed')
  }

  return (await response.json()) as T
}

import ky, { isHTTPError, isNetworkError } from 'ky'

import { getApiBaseUrl } from '@/shared/config/api-base-url'

import { ApiError, parseValidationBody } from './api-error'

export interface ApiRequestInit {
  method?: string
  body?: unknown
  skipAuth?: boolean
  searchParams?: Record<string, string>
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

function isSkipAuth(context: Record<string, unknown>): boolean {
  return context.skipAuth === true
}

const api = ky.create({
  baseUrl: getApiBaseUrl(),
  // Keep a single attempt so 401 logout, login failures, and network errors stay as they were with fetch.
  retry: { limit: 0 },
  timeout: false,
  hooks: {
    beforeRequest: [
      ({ request, options }) => {
        if (!isSkipAuth(options.context) && accessToken !== null) {
          request.headers.set('Authorization', `Bearer ${accessToken}`)
        }
      },
    ],
    beforeError: [
      ({ error, options }) => {
        if (isHTTPError(error)) {
          if (error.response.status === 401) {
            if (!isSkipAuth(options.context)) {
              unauthorizedHandler()
            }

            return new ApiError('unauthorized', 401, 'Unauthorized')
          }

          if (error.response.status === 400) {
            const parsed = parseValidationBody(error.data)
            if (parsed !== null) {
              return new ApiError('validation', 400, parsed.message, parsed.fieldErrors)
            }
          }

          if (error.response.status === 404) {
            return new ApiError('not-found', 404, 'Not found')
          }

          return new ApiError('unknown', error.response.status, 'Request failed')
        }

        if (isNetworkError(error) || error instanceof TypeError) {
          return new ApiError('network', 0, 'Network request failed')
        }

        return error
      },
    ],
  },
})

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { skipAuth = false, body, method, searchParams } = init

  return api(path, {
    method,
    ...(body === undefined ? {} : { json: body }),
    ...(searchParams === undefined ? {} : { searchParams }),
    context: { skipAuth },
  }).json<T>()
}

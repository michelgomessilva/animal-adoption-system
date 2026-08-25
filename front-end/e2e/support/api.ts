import type { APIRequestContext, APIResponse } from '@playwright/test'

import type { Animal, AnimalListQuery, AnimalWriteInput } from '../../src/shared/types/animal'
import { toAnimalListSearchParams } from '../../src/shared/types/animal'

import { randomAnimalInput } from './animal'
import { requireE2eCredentials } from './env'

const API_UNAVAILABLE_MESSAGE =
  'A API não está acessível. Suba o backend antes dos E2E (ver e2e/README.md).'

export interface ApiSession {
  token: string
  username: string
}

function isConnectionFailure(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  const message = error.message.toLowerCase()
  return (
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('econnreset') ||
    message.includes('etimedout')
  )
}

async function sendJson(
  request: APIRequestContext,
  method: 'GET' | 'POST',
  url: string,
  options: { data?: unknown; headers?: Record<string, string>; params?: Record<string, string> },
  onFailure: (status: number, body: string) => string,
): Promise<APIResponse> {
  let response
  try {
    response =
      method === 'GET'
        ? await request.get(url, { headers: options.headers, params: options.params })
        : await request.post(url, { data: options.data, headers: options.headers })
  } catch (error: unknown) {
    if (isConnectionFailure(error)) {
      throw new Error(API_UNAVAILABLE_MESSAGE, { cause: error })
    }

    throw error
  }

  if (response.status() === 502 || response.status() === 503) {
    throw new Error(API_UNAVAILABLE_MESSAGE)
  }

  if (!response.ok()) {
    let body = ''
    try {
      body = await response.text()
    } catch {
      body = ''
    }

    throw new Error(onFailure(response.status(), body))
  }

  return response
}

export async function loginViaApi(request: APIRequestContext): Promise<ApiSession> {
  const { username, password } = requireE2eCredentials()
  const response = await sendJson(
    request,
    'POST',
    '/auth/login',
    { data: { username, password } },
    (status, body) =>
      status === 401
        ? 'Login failed (401). Check that E2E_USERNAME and E2E_PASSWORD match ADMIN_SEED_* of the running API (see e2e/README.md).'
        : `Login failed with ${String(status)}${body ? `: ${body}` : '.'}`,
  )

  const payload: unknown = await response.json()
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('token' in payload) ||
    typeof payload.token !== 'string'
  ) {
    throw new Error('Login succeeded but the response did not include a token.')
  }

  return { token: payload.token, username }
}

export async function createAnimalViaApi(
  request: APIRequestContext,
  token: string,
  overrides: Partial<AnimalWriteInput> = {},
): Promise<Animal> {
  const body = randomAnimalInput(overrides)

  const response = await sendJson(
    request,
    'POST',
    '/api/animals',
    { headers: { Authorization: `Bearer ${token}` }, data: body },
    (status, errorBody) =>
      `POST /api/animals failed with ${String(status)}${errorBody ? `: ${errorBody}` : '.'}`,
  )

  return (await response.json()) as Animal
}

export async function listAnimalsViaApi(
  request: APIRequestContext,
  query: AnimalListQuery = {},
  token?: string,
): Promise<Animal[]> {
  const params = toAnimalListSearchParams(query)
  const response = await sendJson(
    request,
    'GET',
    '/api/animals',
    {
      params,
      headers: token === undefined ? undefined : { Authorization: `Bearer ${token}` },
    },
    (status, errorBody) =>
      `GET /api/animals failed with ${String(status)}${errorBody ? `: ${errorBody}` : '.'}`,
  )

  return (await response.json()) as Animal[]
}

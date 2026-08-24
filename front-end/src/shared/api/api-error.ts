export type ApiErrorCode = 'unauthorized' | 'network' | 'validation' | 'unknown'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(
    code: ApiErrorCode,
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

function toCamelCase(key: string): string {
  if (key.length === 0) {
    return key
  }

  return key.charAt(0).toLowerCase() + key.slice(1)
}

function firstErrorText(value: unknown): string {
  if (Array.isArray(value)) {
    const first = value[0]
    return typeof first === 'string' ? first : ''
  }

  return typeof value === 'string' ? value : ''
}

export function parseValidationBody(
  body: unknown,
): { message: string; fieldErrors: Record<string, string> } | null {
  if (typeof body !== 'object' || body === null) {
    return null
  }

  const record = body as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}

  if (typeof record.errors === 'object' && record.errors !== null) {
    for (const [key, value] of Object.entries(record.errors as Record<string, unknown>)) {
      const text = firstErrorText(value)
      if (text.length > 0) {
        fieldErrors[toCamelCase(key)] = text
      }
    }
  }

  if (typeof record.message === 'string' && record.message.length > 0) {
    return { message: record.message, fieldErrors }
  }

  const firstFieldMessage = Object.values(fieldErrors)[0]
  if (firstFieldMessage !== undefined) {
    return { message: firstFieldMessage, fieldErrors }
  }

  if (typeof record.title === 'string' && record.title.length > 0) {
    return { message: record.title, fieldErrors }
  }

  return null
}

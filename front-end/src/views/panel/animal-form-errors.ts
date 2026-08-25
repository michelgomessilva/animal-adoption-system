import type { ApiErrorCode } from '@/shared/api/api-error'

/** Shared copy for animal create/update form failures (write path). */
export const ANIMAL_WRITE_COMMON_ERRORS: Pick<
  Record<ApiErrorCode, string>,
  'validation' | 'network'
> = {
  validation: 'Revise os dados do cadastro.',
  network: 'Não foi possível conectar. Tente novamente.',
}

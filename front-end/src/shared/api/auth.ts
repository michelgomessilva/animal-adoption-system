import { apiRequest } from '@/shared/api/http'

export interface LoginResponse {
  token: string
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: { username, password },
  })
}

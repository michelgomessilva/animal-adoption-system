import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { login as loginRequest } from '@/shared/api/auth'
import { setAccessToken } from '@/shared/api/http'

export const AUTH_SESSION_KEY = 'poa.auth.session'

export interface AuthSession {
  token: string
  username: string
}

export interface LoginInput {
  username: string
  password: string
  rememberMe: boolean
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<AuthSession>
  return typeof candidate.token === 'string' && typeof candidate.username === 'string'
}

function persist(session: AuthSession | null, rememberMe: boolean): void {
  localStorage.removeItem(AUTH_SESSION_KEY)
  sessionStorage.removeItem(AUTH_SESSION_KEY)

  if (session === null) {
    return
  }

  const raw = JSON.stringify(session)
  if (rememberMe) {
    localStorage.setItem(AUTH_SESSION_KEY, raw)
    return
  }

  sessionStorage.setItem(AUTH_SESSION_KEY, raw)
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthSession | null>(null)
  const isAuthenticated = computed(() => session.value !== null)

  function applySession(next: AuthSession | null): void {
    session.value = next
    setAccessToken(next?.token ?? null)
  }

  async function login(input: LoginInput): Promise<void> {
    const result = await loginRequest(input.username, input.password)
    const next: AuthSession = { token: result.token, username: input.username }
    applySession(next)
    persist(next, input.rememberMe)
  }

  function logout(): void {
    applySession(null)
    persist(null, false)
  }

  function hydrate(): void {
    const raw = localStorage.getItem(AUTH_SESSION_KEY) ?? sessionStorage.getItem(AUTH_SESSION_KEY)

    if (raw === null) {
      applySession(null)
      return
    }

    try {
      const parsed: unknown = JSON.parse(raw)
      if (!isAuthSession(parsed)) {
        logout()
        return
      }

      applySession(parsed)
    } catch {
      logout()
    }
  }

  return { session, isAuthenticated, login, logout, hydrate }
})

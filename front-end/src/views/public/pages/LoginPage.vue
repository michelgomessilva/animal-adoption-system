<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { isApiError, type ApiErrorCode } from '@/shared/api/api-error'
import AppIcon from '@/shared/components/AppIcon.vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import LoginSupportPanel from '@/views/public/components/LoginSupportPanel.vue'

const LOGIN_ERROR_MESSAGE: Partial<Record<ApiErrorCode, string>> = {
  unauthorized: 'Usuário ou senha inválidos.',
  network: 'Não foi possível conectar. Tente novamente.',
  unknown: 'Não foi possível entrar. Tente novamente.',
}

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isPasswordVisible = ref(false)
const isSubmitting = ref(false)
const formError = ref<string | null>(null)

const passwordToggle = computed(() =>
  isPasswordVisible.value
    ? { inputType: 'text' as const, label: 'Ocultar senha', icon: 'eye-off' as const }
    : { inputType: 'password' as const, label: 'Mostrar senha', icon: 'eye' as const },
)

function togglePasswordVisibility(): void {
  isPasswordVisible.value = !isPasswordVisible.value
}

async function onSubmit(): Promise<void> {
  isSubmitting.value = true
  formError.value = null

  try {
    await auth.login({
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value,
    })

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    await router.replace(redirect ?? { name: 'painel-animais' })
  } catch (error: unknown) {
    if (!isApiError(error)) {
      throw error
    }

    const message = LOGIN_ERROR_MESSAGE[error.code]
    if (message === undefined) {
      throw error
    }

    formError.value = message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <LoginSupportPanel />
    <section class="login-page-form" aria-labelledby="login-title">
      <h1 id="login-title">Login</h1>
      <form class="login-form" @submit.prevent="onSubmit">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Usuário</legend>
          <input
            v-model="username"
            class="input w-full"
            type="text"
            name="username"
            autocomplete="username"
            placeholder="seu usuário"
            required
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Senha</legend>
          <label class="input w-full">
            <input
              v-model="password"
              :type="passwordToggle.inputType"
              name="password"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="btn btn-ghost btn-xs"
              :aria-label="passwordToggle.label"
              @click="togglePasswordVisibility"
            >
              <AppIcon :name="passwordToggle.icon" />
            </button>
          </label>
        </fieldset>

        <div class="login-form-row">
          <label class="label cursor-pointer gap-2">
            <input v-model="rememberMe" type="checkbox" class="checkbox" />
            Manter conectado
          </label>
        </div>

        <button class="btn btn-primary btn-block" type="submit" :disabled="isSubmitting">
          Entrar
        </button>
      </form>

      <div v-if="formError !== null" role="alert" class="alert alert-error">
        {{ formError }}
      </div>

      <p>
        Não tem conta?
        <RouterLink :to="{ name: 'register-ong' }" class="link">Cadastre a ONG</RouterLink>
      </p>
    </section>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.login-page {
  @apply grid min-h-[calc(100dvh-4rem)] grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2 lg:items-center;
}

.login-page-form {
  @apply mx-auto flex w-full max-w-md flex-col gap-4;
}

.login-page-form h1 {
  @apply text-4xl font-bold;
}

.login-form {
  @apply flex flex-col gap-3;
}

.login-form-row {
  @apply flex items-center justify-between;
}
</style>

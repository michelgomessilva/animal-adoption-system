import type { NavigationGuard } from 'vue-router'

import { useAuthStore } from '@/shared/stores/auth.store'

export const authNavigationGuard: NavigationGuard = (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'panel-animals' }
  }

  return true
}

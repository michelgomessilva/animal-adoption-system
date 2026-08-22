import { createRouter, createWebHistory } from 'vue-router'

import { authNavigationGuard } from './auth-guard'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(authNavigationGuard)

export default router

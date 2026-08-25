import { createRouter, createWebHistory } from 'vue-router'

import { authNavigationGuard } from './auth-guard'
import { documentTitleFor } from './document-title'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(authNavigationGuard)
router.afterEach((to) => {
  document.title = documentTitleFor(to.meta.title)
})

export default router

import type { RouteRecordRaw } from 'vue-router'

import NotFoundPage from '@/views/public/pages/NotFoundPage.vue'

import { panelRoutes } from './routes/panel'
import { publicRoutes } from './routes/public'

export const routes: RouteRecordRaw[] = [
  publicRoutes,
  panelRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { title: 'Página não encontrada' },
  },
]

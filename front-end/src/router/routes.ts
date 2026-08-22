import type { RouteRecordRaw } from 'vue-router'

import NotFoundPage from '@/views/public/pages/NotFoundPage.vue'

import { painelRoutes } from './routes/painel'
import { publicRoutes } from './routes/public'

export const routes: RouteRecordRaw[] = [
  publicRoutes,
  painelRoutes,
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]

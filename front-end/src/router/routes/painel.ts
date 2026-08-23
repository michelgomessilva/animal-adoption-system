import type { RouteRecordRaw } from 'vue-router'

import PainelLayout from '@/views/painel/PainelLayout.vue'
import AnimalCreatePage from '@/views/painel/pages/AnimalCreatePage.vue'
import AnimalListPage from '@/views/painel/pages/AnimalListPage.vue'

export const painelRoutes: RouteRecordRaw = {
  path: '/painel',
  component: PainelLayout,
  meta: { requiresAuth: true },
  children: [
    { path: '', redirect: { name: 'painel-animais' } },
    { path: 'animais', name: 'painel-animais', component: AnimalListPage },
    { path: 'animais/novo', name: 'painel-animais-novo', component: AnimalCreatePage },
  ],
}

import type { RouteRecordRaw } from 'vue-router'

import PanelLayout from '@/views/panel/PanelLayout.vue'
import AnimalCreatePage from '@/views/panel/pages/AnimalCreatePage.vue'
import AnimalListPage from '@/views/panel/pages/AnimalListPage.vue'

export const panelRoutes: RouteRecordRaw = {
  path: '/panel',
  component: PanelLayout,
  meta: { requiresAuth: true },
  children: [
    { path: '', redirect: { name: 'panel-animals' } },
    {
      path: 'animals',
      name: 'panel-animals',
      component: AnimalListPage,
      meta: { title: 'Meus pets' },
    },
    {
      path: 'animals/new',
      name: 'panel-animals-new',
      component: AnimalCreatePage,
      meta: { title: 'Cadastro do pet' },
    },
  ],
}

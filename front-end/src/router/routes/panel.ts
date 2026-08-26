import type { RouteRecordRaw } from 'vue-router'

type PanelViewName = keyof typeof import('@/views/panel/panel-views')

function loadPanelView(name: PanelViewName) {
  return () => import('@/views/panel/panel-views').then((views) => views[name])
}

export const panelRoutes: RouteRecordRaw = {
  path: '/panel',
  component: loadPanelView('PanelLayout'),
  meta: { requiresAuth: true },
  children: [
    { path: '', redirect: { name: 'panel-animals' } },
    {
      path: 'animals',
      name: 'panel-animals',
      component: loadPanelView('AnimalListPage'),
      meta: { title: 'Meus pets' },
    },
    {
      path: 'animals/new',
      name: 'panel-animals-new',
      component: loadPanelView('AnimalCreatePage'),
      meta: { title: 'Cadastro do pet' },
    },
    {
      path: 'animals/:id/edit',
      name: 'panel-animals-edit',
      component: loadPanelView('AnimalEditPage'),
      meta: { title: 'Editar pet' },
    },
  ],
}

import type { RouteRecordRaw } from 'vue-router'

import PublicLayout from '@/views/public/PublicLayout.vue'
import HowItWorksPage from '@/views/public/pages/HowItWorksPage.vue'
import HomePage from '@/views/public/pages/HomePage.vue'
import LoginPage from '@/views/public/pages/LoginPage.vue'
import OrganizationPage from '@/views/public/pages/OrganizationPage.vue'

export const publicRoutes: RouteRecordRaw = {
  path: '/',
  component: PublicLayout,
  children: [
    { path: '', name: 'home', component: HomePage, meta: { title: 'Adote um pet' } },
    { path: 'adotar', redirect: { name: 'home' } },
    {
      path: 'ongs',
      name: 'organization',
      component: OrganizationPage,
      meta: { title: 'A ONG' },
    },
    {
      path: 'como-funciona',
      name: 'how-it-works',
      component: HowItWorksPage,
      meta: { title: 'Como funciona' },
    },
    {
      path: 'entrar',
      name: 'login',
      component: LoginPage,
      meta: { guestOnly: true, title: 'Área da ONG' },
    },
    { path: 'login', redirect: { name: 'login' } },
  ],
}

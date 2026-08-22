import type { RouteRecordRaw } from 'vue-router'

import PublicLayout from '@/views/public/PublicLayout.vue'
import HowItWorksPage from '@/views/public/pages/HowItWorksPage.vue'
import HomePage from '@/views/public/pages/HomePage.vue'
import LoginPage from '@/views/public/pages/LoginPage.vue'
import OngsPage from '@/views/public/pages/OngsPage.vue'
import RegisterOngPage from '@/views/public/pages/RegisterOngPage.vue'

export const publicRoutes: RouteRecordRaw = {
  path: '/',
  component: PublicLayout,
  children: [
    { path: '', name: 'home', component: HomePage },
    { path: 'adotar', redirect: { name: 'home' } },
    { path: 'ongs', name: 'ongs', component: OngsPage },
    { path: 'como-funciona', name: 'how-it-works', component: HowItWorksPage },
    { path: 'entrar', name: 'login', component: LoginPage, meta: { guestOnly: true } },
    { path: 'login', redirect: { name: 'login' } },
    { path: 'cadastrar-ong', name: 'register-ong', component: RegisterOngPage },
  ],
}

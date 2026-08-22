import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import { setUnauthorizedHandler } from '@/shared/api/http'
import { useAuthStore } from '@/shared/stores/auth.store'
import '@/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const auth = useAuthStore()
auth.hydrate()
setUnauthorizedHandler(() => {
  auth.logout()
  void router.push({ name: 'login' })
})

app.use(router)
app.mount('#app')

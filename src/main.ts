import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'
import { authService } from './services/authService'

// Importar Tailwind CSS
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
})

// Initialize session refresh on app load
async function initializeAuth() {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  try {
    // Call getSession() on the current Cognito user to refresh tokens automatically
    const tokens = await authService.refreshSession()
    if (tokens) {
      // Update auth store with refreshed tokens
      authStore.setAuthData(tokens.accessToken, tokens.refreshToken, tokens.idToken)
    } else {
      // No valid session, clear auth and user data
      authStore.clearAuthData()
      userStore.clearUser()
    }
  } catch (error) {
    console.error('Failed to refresh session on app load:', error)
    // If refresh fails, clear auth and user data to prevent stale tokens
    authStore.clearAuthData()
    userStore.clearUser()
  }
}

// Call refresh session before mounting the app
initializeAuth().then(() => {
  app.mount('#app')
})

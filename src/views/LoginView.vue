<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-gray-800 rounded-lg p-8 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Bienvenido a MatchMarket</h1>
        <p class="text-gray-400">Inicia sesión o regístrate para continuar</p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Login button -->
      <button
        @click="handleLogin"
        :disabled="isLoading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <template v-if="isLoading">
          <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
          Cargando...
        </template>
        <template v-else>
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
          Iniciar sesión / Registrarse
        </template>
      </button>

      <div class="mt-6 text-center">
        <p class="text-gray-400 text-sm">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad
        </p>
      </div>

      <!-- Optional: Back to home link -->
      <div class="mt-6 text-center">
        <router-link to="/" class="text-blue-400 hover:text-blue-300 text-sm">
          ← Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  // If already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    router.push('/')
  }

  // Check for error in URL
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(hash)
  const errorParam = params.get('error')

  if (errorParam) {
    error.value = decodeURIComponent(errorParam)
    // Clear error from URL
    window.history.replaceState(null, '', window.location.pathname)
  }
})

const handleLogin = () => {
  try {
    isLoading.value = true
    error.value = null

    // Get Cognito configuration from environment
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
    const redirectUri = import.meta.env.VITE_REDIRECT_URI

    if (!cognitoDomain || !clientId || !redirectUri) {
      throw new Error('Configuración de autenticación incompleta. Por favor, contacta al administrador.')
    }

    // Build Cognito Hosted UI URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'openid email profile',
    })

    console.log('params', params.toString())
    console.log('cognitoDomain', cognitoDomain)
    console.log('clientId', clientId)
    console.log('redirectUri', redirectUri)

    const loginUrl = `https://${cognitoDomain}.auth.${import.meta.env.VITE_AWS_REGION || 'us-east-1'}.amazoncognito.com/oauth2/authorize?${params.toString()}`

    // Redirect to Cognito Hosted UI
    window.location.href = loginUrl
  } catch (err) {
    console.error('Error redirecting to login:', err)
    error.value = err instanceof Error ? err.message : 'Error al iniciar sesión'
    isLoading.value = false
  }
}
</script>


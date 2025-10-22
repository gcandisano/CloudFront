<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <div v-if="isLoading" class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-white text-lg">Procesando autenticación...</p>
      </div>

      <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
        <h2 class="text-red-400 text-xl font-semibold mb-2">Error de autenticación</h2>
        <p class="text-red-300">{{ error }}</p>
        <router-link
          to="/"
          class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Volver al inicio
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
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // Parse tokens from URL hash
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const accessToken = params.get('access_token')
    const idToken = params.get('id_token')
    const refreshToken = params.get('refresh_token')
    const errorParam = params.get('error')

    if (errorParam) {
      error.value = decodeURIComponent(errorParam)
      isLoading.value = false
      return
    }

    if (!accessToken || !idToken) {
      error.value = 'No se recibieron tokens de autenticación'
      isLoading.value = false
      return
    }

    // Store tokens
    authStore.setAuthData(accessToken, refreshToken || undefined)

    // Fetch user data
    await authStore.getCurrentUser()

    // Clear hash from URL
    window.history.replaceState(null, '', window.location.pathname)

    // Redirect to home
    router.push('/')
  } catch (err) {
    console.error('Error processing callback:', err)
    error.value = err instanceof Error ? err.message : 'Error procesando la autenticación'
    isLoading.value = false
  }
})
</script>


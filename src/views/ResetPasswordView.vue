<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-gray-800 rounded-lg p-8 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Restablecer Contraseña</h1>
        <p class="text-gray-400">Ingresa tu nueva contraseña</p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-2">
            Nueva Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-white mb-2">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Repite tu contraseña"
          />
        </div>

        <div v-if="password && confirmPassword && password !== confirmPassword" class="text-red-400 text-sm">
          Las contraseñas no coinciden
        </div>

        <button
          type="submit"
          :disabled="isLoading || password !== confirmPassword || !password || !confirmPassword"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <template v-if="isLoading">
            <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Restableciendo...
          </template>
          <template v-else>
            Restablecer Contraseña
          </template>
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/login" class="text-blue-400 hover:text-blue-300 text-sm">
          ← Volver al login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const token = ref<string | null>(null)

onMounted(() => {
  // Obtener token de la URL
  const tokenParam = route.query.token as string
  if (!tokenParam) {
    error.value = 'Token de recuperación no válido'
  } else {
    token.value = tokenParam
  }
})

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  try {
    isLoading.value = true
    error.value = null

    // TODO: Implementar cuando tengas el backend
    // const response = await authService.resetPassword(token.value!, password.value)
    
    // Por ahora, simular respuesta
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Contraseña restablecida correctamente')
    router.push('/login')
  } catch (err) {
    console.error('Error resetting password:', err)
    error.value = err instanceof Error ? err.message : 'Error al restablecer la contraseña'
    toast.error('Error al restablecer la contraseña')
  } finally {
    isLoading.value = false
  }
}
</script>


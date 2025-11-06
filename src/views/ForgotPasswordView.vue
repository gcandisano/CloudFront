<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-gray-800 rounded-lg p-8 shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h1>
        <p class="text-gray-400">Ingresa tu email para recibir un enlace de recuperación</p>
      </div>

      <!-- Success message -->
      <div v-if="success" class="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
        <p class="text-green-400 text-sm">{{ success }}</p>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-white mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <template v-if="isLoading">
            <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Enviando...
          </template>
          <template v-else>
            Enviar enlace de recuperación
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const email = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = null
    success.value = null

    // TODO: Implementar cuando tengas el backend
    // const response = await authService.forgotPassword(email.value)
    
    // Por ahora, simular respuesta
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    success.value = 'Si el email existe, recibirás un enlace para recuperar tu contraseña.'
    toast.success('Email enviado correctamente')
    
    // Limpiar el formulario
    email.value = ''
  } catch (err) {
    console.error('Error sending forgot password email:', err)
    error.value = err instanceof Error ? err.message : 'Error al enviar el email'
    toast.error('Error al enviar el email')
  } finally {
    isLoading.value = false
  }
}
</script>


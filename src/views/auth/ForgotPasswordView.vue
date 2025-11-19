<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 class="text-2xl font-semibold text-white text-center mb-2">Recuperar Contraseña</h2>

      <p class="text-gray-400 text-sm text-center mb-6">
        Ingresa tu email y te enviaremos un código para restablecer tu contraseña
      </p>

      <!-- General error display -->
      <div v-if="generalError" class="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-400 text-sm">{{ generalError }}</p>
      </div>

      <!-- Success message -->
      <div v-if="emailSent" class="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-lg">
        <p class="text-green-400 text-sm">
          Se ha enviado un código de verificación a <span class="font-medium">{{ form.email }}</span
          >. Por favor revisa tu email.
        </p>
      </div>

      <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email field -->
        <FormInput
          id="email"
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="tu@email.com"
          :error="errors.email"
          :disabled="loading"
          required
          @blur="validateEmail"
        />

        <!-- Submit button -->
        <FormButton type="submit" :loading="loading" :disabled="loading">
          Enviar Código
        </FormButton>
      </form>

      <!-- Action links -->
      <div class="mt-6 flex flex-col items-center space-y-2">
        <FormButton v-if="emailSent" type="button" :disabled="loading" @click="handleContinue">
          Continuar con el restablecimiento
        </FormButton>

        <button
          type="button"
          :disabled="loading"
          @click="handleBackToLogin"
          class="text-gray-400 hover:text-gray-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthForm, type ForgotPasswordForm } from '@/composables/useAuthForm'
import FormInput from '@/components/form/FormInput.vue'
import FormButton from '@/components/form/FormButton.vue'
import { useToast } from 'vue-toastification'
import { authService } from '@/services/authService'

const router = useRouter()
const toast = useToast()

const emailSent = ref(false)

const initialForm: ForgotPasswordForm = {
  email: '',
}

const {
  form,
  errors,
  generalError,
  loading,
  validateEmail,
  handleSubmit: submitForm,
} = useAuthForm(initialForm, async (formData: ForgotPasswordForm) => {
  try {
    await authService.forgotPassword(formData.email)
    emailSent.value = true
    toast.success('Código de verificación enviado. Revisa tu email.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Forgot password error:', error)
    const errorMessage = error.message || 'Error al solicitar el restablecimiento de contraseña'
    toast.error(errorMessage)
    throw error
  }
})

const handleSubmit = async () => {
  if (!validateEmail()) {
    toast.error('Por favor ingresa un email válido')
    return
  }
  await submitForm(() => true) // Bypass full login validation
}

const handleContinue = () => {
  router.push({
    path: '/reset-password',
    query: { email: form.value.email },
  })
}

const handleBackToLogin = () => {
  router.push('/login')
}
</script>

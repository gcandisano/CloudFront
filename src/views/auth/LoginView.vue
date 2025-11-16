<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 class="text-2xl font-semibold text-white text-center mb-6">Iniciar Sesión</h2>

      <!-- General error display -->
      <div v-if="generalError" class="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-400 text-sm">{{ generalError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
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

        <!-- Password field -->
        <PasswordInput
          id="password"
          v-model="form.password"
          label="Contraseña"
          placeholder="••••••••"
          :error="errors.password"
          :disabled="loading"
          required
          @blur="validatePassword(true)"
        />

        <!-- Submit button -->
        <FormButton type="submit" :loading="loading" :disabled="loading">
          Iniciar Sesión
        </FormButton>
      </form>

      <!-- Action links -->
      <div class="mt-6 space-y-2 text-center">
        <button
          type="button"
          :disabled="loading"
          @click="handleForgotPassword"
          class="text-blue-400 hover:text-blue-500 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <div class="text-gray-400 text-sm">
          ¿No tienes cuenta?
          <button
            type="button"
            :disabled="loading"
            @click="handleSignUp"
            class="text-blue-400 hover:text-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthForm, type LoginForm } from '@/composables/useAuthForm'
import FormInput from '@/components/FormInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import FormButton from '@/components/FormButton.vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { authService } from '@/services/authService'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const userStore = useUserStore()

const initialForm: LoginForm = {
  email: '',
  password: '',
}

const {
  form,
  errors,
  generalError,
  loading,
  validateEmail,
  validatePassword,
  validateLoginForm,
  handleSubmit: submitForm,
} = useAuthForm(initialForm, async (formData: LoginForm) => {
  try {
    const tokens = await authService.login({
      email: formData.email,
      password: formData.password,
    })

    authStore.setAuthData(tokens.accessToken, tokens.refreshToken, tokens.idToken)
    await userStore.fetchCurrentUser()
    router.push('/')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Login failed:', error)

    // Handle new password required case
    if (error.message?.includes('NEW_PASSWORD_REQUIRED')) {
      toast.info('Debes establecer una nueva contraseña.')
      router.push('/reset-password')
      return
    }

    toast.error(error.message || 'Error al iniciar sesión')
    throw error
  }
})

const handleSubmit = async () => {
  await submitForm(validateLoginForm)
}

const handleForgotPassword = () => {
  router.push('/forgot-password')
}

const handleSignUp = () => {
  router.push('/register')
}
</script>

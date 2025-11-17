<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 class="text-2xl font-semibold text-white text-center mb-6">Crear Cuenta</h2>

      <!-- General error display -->
      <div v-if="generalError" class="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-400 text-sm">{{ generalError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- First Name field -->
        <FormInput
          id="firstName"
          v-model="form.firstName"
          label="Nombre"
          type="text"
          placeholder="Juan"
          :error="errors.firstName"
          :disabled="loading"
          required
          @blur="validateFirstName"
        />

        <!-- Last Name field -->
        <FormInput
          id="lastName"
          v-model="form.lastName"
          label="Apellido"
          type="text"
          placeholder="Pérez"
          :error="errors.lastName"
          :disabled="loading"
          required
          @blur="validateLastName"
        />

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

        <!-- Phone Number field -->
        <FormInput
          id="phoneNumber"
          v-model="form.phoneNumber"
          label="Teléfono"
          type="tel"
          placeholder="+54 11 1234-5678"
          :error="errors.phoneNumber"
          :disabled="loading"
          required
          @blur="validatePhoneNumber"
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
          @blur="validatePassword"
        />

        <!-- Confirm Password field -->
        <PasswordInput
          id="confirmPassword"
          v-model="form.confirmPassword"
          label="Confirmar Contraseña"
          placeholder="••••••••"
          :error="errors.confirmPassword"
          :disabled="loading"
          required
          @blur="validateConfirmPassword"
        />

        <!-- Submit button -->
        <FormButton type="submit" :loading="loading" :disabled="loading"> Registrarse </FormButton>
      </form>

      <!-- Action links -->
      <div class="mt-6 text-center">
        <div class="text-gray-400 text-sm">
          ¿Ya tienes cuenta?
          <button
            type="button"
            :disabled="loading"
            @click="handleLogin"
            class="text-blue-400 hover:text-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Inicia Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthForm, type RegisterForm } from '@/composables/useAuthForm'
import FormInput from '@/components/form/FormInput.vue'
import PasswordInput from '@/components/form/PasswordInput.vue'
import FormButton from '@/components/form/FormButton.vue'
import { useToast } from 'vue-toastification'
import { authService } from '@/services/authService'

const router = useRouter()
const toast = useToast()

// Initialize form with composable
const initialForm: RegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
}

const {
  form,
  errors,
  generalError,
  loading,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateConfirmPassword,
  validateRegisterForm,
  handleSubmit: submitForm,
} = useAuthForm(initialForm, async (formData: RegisterForm) => {
  try {
    await authService.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
    })

    toast.success('Registro exitoso. Verifica tu email para continuar.')
    router.push({ path: '/verify-email', query: { email: formData.email } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Registration error:', error)
    toast.error(error.message || 'Error al registrar el usuario')
    throw error
  }
})

// Form submission handler
const handleSubmit = async () => {
  await submitForm(validateRegisterForm)
}

// Navigation handlers
const handleLogin = () => {
  router.push('/login')
}
</script>

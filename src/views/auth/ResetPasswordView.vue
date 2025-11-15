<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
    <div class="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 class="text-2xl font-semibold text-white text-center mb-2">Restablecer Contraseña</h2>

      <p class="text-gray-400 text-sm text-center mb-6">
        Ingresa el código de verificación enviado a
        <span class="text-white font-medium">{{ email || 'tu email' }}</span>
        y tu nueva contraseña
      </p>

      <!-- General error display -->
      <div v-if="generalError" class="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
        <p class="text-red-400 text-sm">{{ generalError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Verification Code field -->
        <div>
          <label class="text-white mb-3 block text-center">Código de verificación</label>
          <VerificationCodeInput
            v-model="form.code"
            :error="codeError"
            :disabled="loading"
          />
          <p v-if="codeError" class="text-red-400 text-sm mt-2 text-center">{{ codeError }}</p>
        </div>

        <!-- New Password field -->
        <PasswordInput
          id="newPassword"
          v-model="form.newPassword"
          label="Nueva Contraseña"
          placeholder="••••••••"
          :error="errors.newPassword"
          :disabled="loading"
          required
          @blur="validateNewPassword"
        />

        <!-- Confirm Password field -->
        <PasswordInput
          id="confirmPassword"
          v-model="form.confirmPassword"
          label="Confirmar Nueva Contraseña"
          placeholder="••••••••"
          :error="errors.confirmPassword"
          :disabled="loading"
          required
          @blur="validateConfirmPassword"
        />

        <!-- Submit button -->
        <FormButton
          type="submit"
          :loading="loading"
          :disabled="loading || !isFormValid"
        >
          Restablecer Contraseña
        </FormButton>
      </form>

      <!-- Action links -->
      <div class="mt-6 space-y-2 text-center">
        <button
          type="button"
          :disabled="loading || resending"
          @click="handleResendCode"
          class="text-blue-400 hover:text-blue-500 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="resending">Enviando...</span>
          <span v-else>¿No recibiste el código? Reenviar</span>
        </button>

        <div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PasswordInput from '@/components/PasswordInput.vue'
import FormButton from '@/components/FormButton.vue'
import VerificationCodeInput from '@/components/VerificationCodeInput.vue'
import { useToast } from 'vue-toastification'
import { useResetPasswordForm } from '@/composables/useResetPasswordForm'
import { authService } from '@/services/authService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const email = ref<string>('')
const resending = ref(false)
const loading = ref(false)

const {
  form,
  errors,
  codeError,
  generalError,
  validateNewPassword,
  validateConfirmPassword,
  validateResetPasswordForm,
  isFormValid,
} = useResetPasswordForm()

onMounted(() => {
  const emailParam = route.query.email as string
  if (emailParam) {
    email.value = emailParam
  } else {
    toast.error('Email no proporcionado')
    router.push('/forgot-password')
  }
})

const handleSubmit = async () => {
  generalError.value = null
  codeError.value = ''

  if (!validateResetPasswordForm()) {
    toast.error('Por favor corrige los errores en el formulario')
    return
  }

  if (!email.value) {
    generalError.value = 'Email no encontrado'
    return
  }

  loading.value = true
  try {
    await authService.resetPassword({
      email: email.value,
      code: form.value.code,
      newPassword: form.value.newPassword,
    })
    toast.success('Contraseña restablecida exitosamente')
    router.push('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Reset password error:', error)
    const errorMessage = error.message || 'Error al restablecer la contraseña'
    generalError.value = errorMessage
    codeError.value = errorMessage
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const handleResendCode = async () => {
  if (!email.value) {
    toast.error('Email no encontrado')
    return
  }

  resending.value = true
  try {
    await authService.resendPasswordResetCode(email.value)
    toast.success('Código reenviado. Revisa tu email.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Resend code error:', error)
    toast.error(error.message || 'Error al reenviar el código')
  } finally {
    resending.value = false
  }
}

const handleBackToLogin = () => {
  router.push('/login')
}
</script>


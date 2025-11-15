import { ref, computed } from 'vue'

export interface ResetPasswordForm {
  code: string
  newPassword: string
  confirmPassword: string
}

export function useResetPasswordForm(initialForm: ResetPasswordForm = {
  code: '',
  newPassword: '',
  confirmPassword: '',
}) {
  const form = ref<ResetPasswordForm>({ ...initialForm })
  const errors = ref<{
    newPassword?: string
    confirmPassword?: string
  }>({})
  const codeError = ref('')
  const generalError = ref<string | null>(null)

  // Validation functions
  const validateNewPassword = (): boolean => {
    const password = form.value.newPassword
    if (!password) {
      errors.value.newPassword = 'La contraseña es requerida'
      return false
    }
    if (password.length < 8) {
      errors.value.newPassword = 'La contraseña debe tener al menos 8 caracteres'
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.value.newPassword =
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      return false
    }
    errors.value.newPassword = ''
    return true
  }

  const validateConfirmPassword = (): boolean => {
    const confirmPassword = form.value.confirmPassword
    if (!confirmPassword) {
      errors.value.confirmPassword = 'La confirmación de contraseña es requerida'
      return false
    }
    if (confirmPassword !== form.value.newPassword) {
      errors.value.confirmPassword = 'Las contraseñas no coinciden'
      return false
    }
    errors.value.confirmPassword = ''
    return true
  }

  const validateCode = (): boolean => {
    if (!form.value.code || form.value.code.length !== 6) {
      codeError.value = 'El código debe tener 6 dígitos'
      return false
    }
    codeError.value = ''
    return true
  }

  const validateResetPasswordForm = (): boolean => {
    const codeValid = validateCode()
    const passwordValid = validateNewPassword()
    const confirmPasswordValid = validateConfirmPassword()
    return codeValid && passwordValid && confirmPasswordValid
  }

  const isFormValid = computed(() => {
    return (
      form.value.code.length === 6 &&
      form.value.newPassword.length >= 8 &&
      form.value.confirmPassword.length >= 8 &&
      form.value.newPassword === form.value.confirmPassword
    )
  })

  // Clear errors
  const clearErrors = () => {
    errors.value = {}
    codeError.value = ''
    generalError.value = null
  }

  // Reset form
  const resetForm = () => {
    form.value = { ...initialForm }
    clearErrors()
  }

  return {
    // State
    form,
    errors,
    codeError,
    generalError,

    // Validation functions
    validateNewPassword,
    validateConfirmPassword,
    validateCode,
    validateResetPasswordForm,

    // Computed
    isFormValid,

    // Methods
    clearErrors,
    resetForm,
  }
}


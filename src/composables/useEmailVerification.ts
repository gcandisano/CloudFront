import { ref, computed } from 'vue'

export function useEmailVerification() {

  // State
  const email = ref<string>('')
  const code = ref<string>('')
  const codeError = ref<string>('')
  const generalError = ref<string | null>(null)
  const loading = ref(false)
  const resending = ref(false)

  // Computed
  const isCodeComplete = computed(() => code.value.length === 6)

  // Set email
  const setEmail = (emailValue: string) => {
    email.value = emailValue
  }

  // Validate code
  const validateCode = (): boolean => {
    codeError.value = ''
    if (!code.value) {
      codeError.value = 'El código es requerido'
      return false
    }
    if (code.value.length !== 6) {
      codeError.value = 'El código debe tener 6 dígitos'
      return false
    }
    if (!/^\d{6}$/.test(code.value)) {
      codeError.value = 'El código solo debe contener números'
      return false
    }
    return true
  }

  // Clear errors
  const clearErrors = () => {
    codeError.value = ''
    generalError.value = null
  }

  // Reset state
  const reset = () => {
    code.value = ''
    codeError.value = ''
    generalError.value = null
    loading.value = false
    resending.value = false
  }

  return {
    // State
    email,
    code,
    codeError,
    generalError,
    loading,
    resending,

    // Computed
    isCodeComplete,

    // Methods
    setEmail,
    validateCode,
    clearErrors,
    reset,
  }
}


/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordForm {
  email: string
}

export type AuthForm = LoginForm | RegisterForm | ForgotPasswordForm

export function useAuthForm<T extends AuthForm>(
  initialForm: T,
  submitHandler: (form: T) => Promise<void>,
) {
  const toast = useToast()

  // Form state
  const form = ref<T>({ ...initialForm } as T)
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const generalError = ref<string | null>(null)
  const loading = ref(false)

  // Validation functions
  const validateEmail = () => {
    const email = (form.value as any).email
    if (!email || !email.trim()) {
      ;(errors.value as any).email = 'El email es requerido'
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ;(errors.value as any).email = 'El email no tiene un formato válido'
      return false
    }
    ;(errors.value as any).email = ''
    return true
  }

  const validatePassword = (isLogin = false) => {
    const password = (form.value as any).password
    if (!password) {
      ;(errors.value as any).password = 'La contraseña es requerida'
      return false
    }
    if (password.length < 8) {
      ;(errors.value as any).password = 'La contraseña debe tener al menos 8 caracteres'
      return false
    }
    if (!isLogin) {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/.test(password)) {
        ;(errors.value as any).password =
          'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
        return false
      }
    }
    ;(errors.value as any).password = ''
    return true
  }

  const validateFirstName = () => {
    const firstName = (form.value as RegisterForm).firstName
    if (!firstName || !firstName.trim()) {
      ;(errors.value as any).firstName = 'El nombre es requerido'
      return false
    }
    if (firstName.trim().length < 2) {
      ;(errors.value as any).firstName = 'El nombre debe tener al menos 2 caracteres'
      return false
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName.trim())) {
      ;(errors.value as any).firstName = 'El nombre solo puede contener letras'
      return false
    }
    ;(errors.value as any).firstName = ''
    return true
  }

  const validateLastName = () => {
    const lastName = (form.value as RegisterForm).lastName
    if (!lastName || !lastName.trim()) {
      ;(errors.value as any).lastName = 'El apellido es requerido'
      return false
    }
    if (lastName.trim().length < 2) {
      ;(errors.value as any).lastName = 'El apellido debe tener al menos 2 caracteres'
      return false
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName.trim())) {
      ;(errors.value as any).lastName = 'El apellido solo puede contener letras'
      return false
    }
    ;(errors.value as any).lastName = ''
    return true
  }

  const validatePhoneNumber = () => {
    const phoneNumber = (form.value as RegisterForm).phoneNumber
    if (!phoneNumber || !phoneNumber.trim()) {
      ;(errors.value as any).phoneNumber = 'El teléfono es requerido'
      return false
    }
    // E.164 format: starts with +, then 10-15 digits, first digit after + is not 0
    if (!/^\+[1-9]\d{9,14}$/.test(phoneNumber.trim())) {
      ;(errors.value as any).phoneNumber = 'El teléfono debe estar en formato internacional (E.164), por ejemplo: +12345678901'
      return false
    }
    ;(errors.value as any).phoneNumber = ''
    return true
  }

  const validateConfirmPassword = () => {
    const registerForm = form.value as RegisterForm
    const confirmPassword = registerForm.confirmPassword
    if (!confirmPassword) {
      ;(errors.value as any).confirmPassword = 'La confirmación de contraseña es requerida'
      return false
    }
    if (confirmPassword !== registerForm.password) {
      ;(errors.value as any).confirmPassword = 'Las contraseñas no coinciden'
      return false
    }
    ;(errors.value as any).confirmPassword = ''
    return true
  }

  // Validation for login form
  const validateLoginForm = (): boolean => {
    const emailValid = validateEmail()
    const passwordValid = validatePassword(true)
    return emailValid && passwordValid
  }

  // Validation for register form
  const validateRegisterForm = (): boolean => {
    const firstNameValid = validateFirstName()
    const lastNameValid = validateLastName()
    const emailValid = validateEmail()
    const phoneValid = validatePhoneNumber()
    const passwordValid = validatePassword(false)
    const confirmPasswordValid = validateConfirmPassword()
    return (
      firstNameValid &&
      lastNameValid &&
      emailValid &&
      phoneValid &&
      passwordValid &&
      confirmPasswordValid
    )
  }

  // Generic form submission
  const handleSubmit = async (validateFn: () => boolean) => {
    generalError.value = null

    if (!validateFn()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    loading.value = true
    try {
      await submitHandler(form.value)
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al procesar la solicitud. Por favor intenta nuevamente.'
      generalError.value = errorMessage
      toast.error(errorMessage)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Reset form
  const resetForm = () => {
    form.value = { ...initialForm } as T
    errors.value = {}
    generalError.value = null
  }

  // Clear errors
  const clearErrors = () => {
    errors.value = {}
    generalError.value = null
  }

  return {
    // State
    form,
    errors,
    generalError,
    loading,

    // Validation functions
    validateEmail,
    validatePassword,
    validateFirstName,
    validateLastName,
    validatePhoneNumber,
    validateConfirmPassword,
    validateLoginForm,
    validateRegisterForm,

    // Methods
    handleSubmit,
    resetForm,
    clearErrors,
  }
}

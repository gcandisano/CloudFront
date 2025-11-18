import { ref } from 'vue'
import type { CreateProductForm } from '@/types'

export function useFormValidation() {
  const errors = ref<Partial<Record<keyof CreateProductForm, string>>>({})

  const validateProductForm = (form: CreateProductForm): boolean => {
    errors.value = {}
    let isValid = true

    if (!form.name) {
      errors.value.name = 'El nombre es requerido'
      isValid = false
    } else if (!form.name.trim()) {
      errors.value.name = 'El nombre es requerido'
      isValid = false
    } else if (form.name.length > 128) {
      errors.value.name = 'El nombre no debe superar los 128 caracteres'
      isValid = false
    }

    if (form.description && form.description.length > 2048) {
      errors.value.description = 'La descripción no debe superar los 2048 caracteres'
      isValid = false
    }

    if (!form.category) {
      errors.value.category = 'La categoría es requerida'
      isValid = false
    }

    if (!form.price || form.price <= 0) {
      errors.value.price = 'El precio debe ser mayor a 0'
      isValid = false
    } else if (form.price > 999999.99) {
      errors.value.price = 'El precio no puede ser mayor a 999,999.99'
      isValid = false
    }

    // Validate stock if present
    if (form.stock !== undefined) {
      if (!Number.isInteger(form.stock) || form.stock < 0) {
        errors.value.stock = 'El stock debe ser un número entero >= 0'
        isValid = false
      }
    }

    return isValid
  }

  return {
    errors,
    validateProductForm,
  }
}

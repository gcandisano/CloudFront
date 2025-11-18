<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleClose"
    >
      <div
        class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div
          class="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center"
        >
          <h2 class="text-2xl font-bold text-white">Agregar Dirección</h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
            :disabled="isSubmitting"
          >
            <CloseIcon />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Error message -->
          <div v-if="error" class="p-3 bg-red-900/20 border border-red-500 rounded-lg">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>

          <!-- Info message -->
          <div class="p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
            <p class="text-blue-400 text-sm">
              Necesitas agregar una dirección de envío para completar tu compra.
            </p>
          </div>

          <!-- Address Input -->
          <FormTextarea
            id="address"
            v-model="address"
            label="Dirección de envío"
            placeholder="Ingresa tu dirección completa (calle, número, ciudad, código postal, etc.)"
            :rows="4"
            :error="addressError || undefined"
            :required="true"
          />
        </div>

        <!-- Footer -->
        <div
          class="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-end gap-3"
        >
          <FormButton variant="secondary" @click="handleClose" :disabled="isSubmitting">
            Cancelar
          </FormButton>
          <FormButton
            @click="handleSubmit"
            :disabled="isSubmitting || !canSubmit"
            :loading="isSubmitting"
          >
            Guardar Dirección
          </FormButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { userService } from '@/services/userService'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import FormTextarea from '@/components/form/FormTextarea.vue'
import FormButton from '@/components/form/FormButton.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const toast = useToast()
const userStore = useUserStore()
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const address = ref('')
const addressError = ref<string | null>(null)

// Initialize address with current user address if available
if (userStore.user?.address) {
  address.value = userStore.user.address
}

const canSubmit = computed(() => {
  return address.value.trim().length > 0
})

const handleClose = () => {
  if (!isSubmitting.value) {
    error.value = null
    addressError.value = null
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value || isSubmitting.value) return

  // Validate address
  addressError.value = null
  const trimmedAddress = address.value.trim()

  if (trimmedAddress.length === 0) {
    addressError.value = 'La dirección es requerida'
    return
  }

  if (trimmedAddress.length < 10) {
    addressError.value = 'Por favor, ingresa una dirección más completa'
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    const response = await userService.updateUser({
      address: trimmedAddress,
    })

    if (response.success && response.data) {
      // Update user store with new address
      userStore.setUser(response.data)
      toast.success(response.message || 'Dirección guardada exitosamente')
      emit('saved')
      emit('close')
    } else {
      error.value = response.message || 'Error al guardar la dirección'
      toast.error(response.message || 'Error al guardar la dirección')
    }
  } catch (err) {
    console.error('Error saving address:', err)
    error.value = 'Error inesperado al guardar la dirección'
    toast.error('Error inesperado al guardar la dirección')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>


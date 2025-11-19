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
          <h2 class="text-2xl font-bold text-white">Editar Tienda</h2>
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

          <!-- Store Name -->
          <FormInput
            id="store-name"
            v-model="formData.store_name"
            label="Nombre de la tienda"
            placeholder="Nombre de la tienda"
          />

          <!-- Description -->
          <FormTextarea
            id="description"
            v-model="formData.description"
            label="Descripción"
            placeholder="Describe tu tienda..."
            :rows="4"
          />

          <!-- Store Image -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Imagen de la tienda
            </label>
            <div class="flex items-center gap-4">
              <div
                v-if="storeImagePreview || store.store_image_url"
                class="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600"
              >
                <img
                  :src="storeImagePreview || store.store_image_url || ''"
                  alt="Store image preview"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <input
                  id="store-image"
                  type="file"
                  accept="image/*"
                  @change="handleStoreImageChange"
                  class="hidden"
                />
                <label
                  for="store-image"
                  class="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors"
                >
                  {{ storeImageFile ? 'Cambiar imagen' : 'Seleccionar imagen' }}
                </label>
                <p v-if="storeImageError" class="text-red-400 text-sm mt-1">
                  {{ storeImageError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Cover Image -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"> Imagen de portada </label>
            <div class="flex items-center gap-4">
              <div
                v-if="coverImagePreview || store.cover_image_url"
                class="w-48 h-24 rounded-lg overflow-hidden border-2 border-gray-600"
              >
                <img
                  :src="coverImagePreview || store.cover_image_url || ''"
                  alt="Cover image preview"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <input
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  @change="handleCoverImageChange"
                  class="hidden"
                />
                <label
                  for="cover-image"
                  class="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors"
                >
                  {{ coverImageFile ? 'Cambiar imagen' : 'Seleccionar imagen' }}
                </label>
                <p v-if="coverImageError" class="text-red-400 text-sm mt-1">
                  {{ coverImageError }}
                </p>
              </div>
            </div>
          </div>
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
            :disabled="isSubmitting || !hasChanges"
            :loading="isSubmitting"
          >
            Guardar Cambios
          </FormButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { StoreResponse } from '@/types'
import { storeService } from '@/services/storeService'
import { uploadToS3 } from '@/services/s3Service'
import { useToast } from 'vue-toastification'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import FormInput from '@/components/form/FormInput.vue'
import FormTextarea from '@/components/form/FormTextarea.vue'
import FormButton from '@/components/form/FormButton.vue'

interface Props {
  isOpen: boolean
  store: StoreResponse
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  updated: [store: StoreResponse]
}>()

const toast = useToast()
const isSubmitting = ref(false)
const error = ref<string | null>(null)

const formData = ref({
  store_name: '',
  description: '',
})

const storeImageFile = ref<File | null>(null)
const storeImagePreview = ref<string | null>(null)
const storeImageError = ref<string | null>(null)

const coverImageFile = ref<File | null>(null)
const coverImagePreview = ref<string | null>(null)
const coverImageError = ref<string | null>(null)

// Initialize form data when store changes
watch(
  () => props.store,
  (newStore) => {
    if (newStore) {
      formData.value = {
        store_name: newStore.store_name || '',
        description: newStore.description || '',
      }
    }
  },
  { immediate: true },
)

// Reset form when modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
    }
  },
)

const hasChanges = computed(() => {
  const hasFormChanges =
    formData.value.store_name !== (props.store.store_name || '') ||
    formData.value.description !== (props.store.description || '')
  const hasImageChanges = !!storeImageFile.value || !!coverImageFile.value
  return hasFormChanges || hasImageChanges
})

const handleStoreImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    storeImageError.value = 'El archivo debe ser una imagen'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    storeImageError.value = 'La imagen no debe superar los 5MB'
    return
  }

  storeImageFile.value = file
  storeImagePreview.value = URL.createObjectURL(file)
  storeImageError.value = null
}

const handleCoverImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    coverImageError.value = 'El archivo debe ser una imagen'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    coverImageError.value = 'La imagen no debe superar los 5MB'
    return
  }

  coverImageFile.value = file
  coverImagePreview.value = URL.createObjectURL(file)
  coverImageError.value = null
}

const resetForm = () => {
  if (storeImagePreview.value) {
    URL.revokeObjectURL(storeImagePreview.value)
  }
  if (coverImagePreview.value) {
    URL.revokeObjectURL(coverImagePreview.value)
  }
  storeImageFile.value = null
  storeImagePreview.value = null
  storeImageError.value = null
  coverImageFile.value = null
  coverImagePreview.value = null
  coverImageError.value = null
  error.value = null
}

const handleClose = () => {
  if (!isSubmitting.value) {
    resetForm()
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!hasChanges.value || isSubmitting.value) return

  isSubmitting.value = true
  error.value = null

  try {
    const updateData: {
      store_name?: string
      description?: string | null
      store_image_url?: string
      cover_image_url?: string
    } = {}

    // Update form fields if changed
    if (formData.value.store_name !== (props.store.store_name || '')) {
      updateData.store_name = formData.value.store_name.trim()
    }

    if (formData.value.description !== (props.store.description || '')) {
      const trimmedDescription = formData.value.description.trim()
      updateData.description = trimmedDescription || null
    }

    // Upload store image if changed
    if (storeImageFile.value) {
      const uploadResult = await uploadToS3(storeImageFile.value)
      if (uploadResult.success && uploadResult.url) {
        updateData.store_image_url = uploadResult.url
      } else {
        error.value = uploadResult.error || 'Error al subir la imagen de la tienda'
        isSubmitting.value = false
        return
      }
    }

    // Upload cover image if changed
    if (coverImageFile.value) {
      const uploadResult = await uploadToS3(coverImageFile.value)
      if (uploadResult.success && uploadResult.url) {
        updateData.cover_image_url = uploadResult.url
      } else {
        error.value = uploadResult.error || 'Error al subir la imagen de portada'
        isSubmitting.value = false
        return
      }
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      isSubmitting.value = false
      return
    }

    const response = await storeService.updateStore(props.store.store_id.toString(), updateData)

    if (response.success && response.data) {
      toast.success(response.message || 'Tienda actualizada exitosamente')
      emit('updated', response.data)
      emit('close')
    } else {
      error.value = response.message || 'Error al actualizar la tienda'
      toast.error(response.message || 'Error al actualizar la tienda')
    }
  } catch (err) {
    console.error('Error updating store:', err)
    error.value = 'Error inesperado al actualizar la tienda'
    toast.error('Error inesperado al actualizar la tienda')
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

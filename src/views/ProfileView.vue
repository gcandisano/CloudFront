<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-white mb-8">Mi Perfil</h1>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Profile form -->
      <div v-else-if="user" class="bg-gray-800 rounded-lg p-6 space-y-6">
        <!-- General error display -->
        <div v-if="generalError" class="p-3 bg-red-900/20 border border-red-500 rounded-lg">
          <p class="text-red-400 text-sm">{{ generalError }}</p>
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="p-3 bg-green-900/20 border border-green-500 rounded-lg">
          <p class="text-green-400 text-sm">{{ successMessage }}</p>
        </div>

        <!-- Profile Picture -->
        <div class="flex justify-center">
          <ProfilePictureUpload
            :current-image="user.profile_picture"
            :error="imageError"
            @file-change="handleImageFileChange"
            ref="profilePictureRef"
          />
        </div>

        <!-- Read-only user information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Nombre" :value="user.given_name" />
          <ReadOnlyField label="Apellido" :value="user.family_name" />
          <ReadOnlyField label="Email" :value="user.email" class="md:col-span-2" />
          <ReadOnlyField label="Teléfono" :value="user.phone_number" class="md:col-span-2" />
        </div>

        <!-- Editable Address -->
        <FormTextarea
          id="address"
          v-model="address"
          label="Dirección"
          placeholder="Ingresa tu dirección"
          :rows="2"
        />

        <!-- Submit button -->
        <div class="flex justify-end gap-3 pt-4">
          <FormButton variant="secondary" @click="handleCancel" :disabled="isSubmitting">
            Cancelar
          </FormButton>
          <FormButton
            @click="handleSubmit"
            :disabled="isSubmitting || !hasChanges"
            :loading="isSubmitting"
          >
            {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
          </FormButton>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="text-center text-white py-20">
        <p class="text-xl">Error al cargar el perfil</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { userService } from '@/services/userService'
import { uploadToS3 } from '@/services/s3Service'
import { useImageUpload } from '@/composables/useImageUpload'
import { useToast } from 'vue-toastification'
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload.vue'
import ReadOnlyField from '@/components/profile/ReadOnlyField.vue'
import FormTextarea from '@/components/form/FormTextarea.vue'
import FormButton from '@/components/form/FormButton.vue'

const userStore = useUserStore()
const toast = useToast()

const loading = ref(false)
const isSubmitting = ref(false)
const generalError = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const address = ref('')
const profilePictureRef = ref<InstanceType<typeof ProfilePictureUpload> | null>(null)
const imageFile = ref<File | null>(null)

const {
  imageError,
} = useImageUpload()

const user = computed(() => userStore.user)

const hasChanges = computed(() => {
  const hasImageChange = !!imageFile.value
  const hasAddressChange = address.value !== (user.value?.address || '')
  return hasImageChange || hasAddressChange
})

onMounted(async () => {
  await loadUserProfile()
})

const loadUserProfile = async () => {
  loading.value = true
  generalError.value = null

  try {
    if (!user.value) {
      await userStore.fetchCurrentUser(true)
    }

    if (user.value) {
      address.value = user.value.address || ''
    } else {
      generalError.value = 'No se pudo cargar la información del usuario'
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
    generalError.value = 'Error al cargar el perfil'
  } finally {
    loading.value = false
  }
}

const handleImageFileChange = (file: File) => {
  imageFile.value = file
}

const handleCancel = () => {
  if (user.value) {
    address.value = user.value.address || ''
  }
  imageFile.value = null
  profilePictureRef.value?.clearPreview()
  generalError.value = null
  successMessage.value = null
}

const handleSubmit = async () => {
  if (!user.value || isSubmitting.value || !hasChanges.value) return

  isSubmitting.value = true
  generalError.value = null
  successMessage.value = null

  try {
    const updateData: { profile_picture?: string; address?: string } = {}

    // Upload image if there's a new one
    if (imageFile.value) {
      const uploadResult = await uploadToS3(imageFile.value)

      if (uploadResult.success && uploadResult.url) {
        updateData.profile_picture = uploadResult.url
      } else {
        generalError.value = uploadResult.error || 'Error al subir la imagen'
        isSubmitting.value = false
        return
      }
    }

    // Add address if changed
    if (address.value !== (user.value.address || '')) {
      updateData.address = address.value.trim() || undefined
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      isSubmitting.value = false
      return
    }

    const response = await userService.updateUser(updateData)

    if (response.success && response.data) {
      // Update user store with new data
      userStore.setUser(response.data)
      toast.success(response.message || 'Perfil actualizado exitosamente')
      successMessage.value = 'Perfil actualizado exitosamente'
      imageFile.value = null
      profilePictureRef.value?.clearPreview()
    } else {
      generalError.value = response.message || 'Error al actualizar el perfil'
      toast.error(response.message || 'Error al actualizar el perfil')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    generalError.value = 'Error inesperado al actualizar el perfil'
    toast.error('Error inesperado al actualizar el perfil')
  } finally {
    isSubmitting.value = false
  }
}
</script>


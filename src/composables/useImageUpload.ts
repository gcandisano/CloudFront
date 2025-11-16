import { ref } from 'vue'
import { uploadToS3 } from '@/services/s3Service'

export function useImageUpload() {
  const previewImage = ref<string | null>(null)
  const imageFile = ref<File | null>(null)
  const imageError = ref<string | null>(null)
  const uploadUrl = ref<string | null>(null)
  const isUploading = ref(false)

  const handleImageChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return

    const file = input.files[0]
    if (!file.type.startsWith('image/')) {
      imageError.value = 'El archivo debe ser una imagen'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      imageError.value = 'La imagen no debe superar los 5MB'
      return
    }

    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
    imageError.value = null
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile.value) {
      imageError.value = 'No hay imagen para subir'
      return null
    }

    isUploading.value = true
    imageError.value = null

    try {
      const result = await uploadToS3(imageFile.value)
      console.log('result', result)

      if (result.success && result.url) {
        uploadUrl.value = result.url
        return result.url
      } else {
        imageError.value = result.error || 'Error al subir la imagen'
        return null
      }
    } catch (error) {
      imageError.value =
        error instanceof Error ? error.message : 'Error inesperado al subir la imagen'
      return null
    } finally {
      isUploading.value = false
    }
  }

  const resetImage = () => {
    if (previewImage.value) {
      URL.revokeObjectURL(previewImage.value)
    }
    previewImage.value = null
    imageFile.value = null
    imageError.value = null
    uploadUrl.value = null
    isUploading.value = false
  }

  return {
    previewImage,
    imageFile,
    imageError,
    uploadUrl,
    isUploading,
    handleImageChange,
    uploadImage,
    resetImage,
  }
}

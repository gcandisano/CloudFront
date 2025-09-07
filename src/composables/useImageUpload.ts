import { ref } from 'vue'

export function useImageUpload() {
  const previewImage = ref<string | null>(null)
  const imageFile = ref<File | null>(null)
  const imageError = ref<string | null>(null)

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

  const resetImage = () => {
    if (previewImage.value) {
      URL.revokeObjectURL(previewImage.value)
    }
    previewImage.value = null
    imageFile.value = null
    imageError.value = null
  }

  return {
    previewImage,
    imageFile,
    imageError,
    handleImageChange,
    resetImage,
  }
}

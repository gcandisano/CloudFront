<template>
  <div class="min-h-screen bg-gray-900">
    <div class="flex flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white text-center mb-6">Agrega tu producto</h2>

        <!-- General error display -->
        <div v-if="generalError" class="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
          <p class="text-red-400 text-sm">{{ generalError }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Foto -->
          <div>
            <label class="text-white mb-2 block">Foto</label>
            <div
              class="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors"
              @click="fileInput?.click()">
              <img v-if="previewImage" :src="previewImage" alt="Preview"
                class="w-32 h-32 object-cover rounded-lg mb-2" />
              <div v-else class="w-32 h-32 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" stroke="currentColor"
                    stroke-width="2" />
                </svg>
              </div>
              <span class="text-blue-500 text-sm mt-2">Sube un archivo</span>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageChange" />
            </div>
            <p v-if="imageError" class="text-red-400 text-sm mt-1">{{ imageError }}</p>
          </div>

          <!-- Nombre del producto -->
          <div>
            <label class="text-white mb-2 block">Nombre del producto</label>
            <input v-model="form.name" type="text"
              :class="[
                'w-full bg-gray-700 text-white rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                errors.name ? 'border-red-500' : 'border-gray-600'
              ]"
              placeholder="Jean Azul Marino" />
            <p v-if="errors.name" class="text-red-400 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Descripción -->
          <div>
            <label class="text-white mb-2 block">Descripción</label>
            <textarea v-model="form.description" rows="3"
              :class="[
                'w-full bg-gray-700 text-white rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                errors.description ? 'border-red-500' : 'border-gray-600'
              ]"
              placeholder="Describe tu producto"></textarea>
            <p v-if="errors.description" class="text-red-400 text-sm mt-1">{{ errors.description }}</p>
          </div>

          <!-- Categoría -->
          <div>
            <label class="text-white mb-2 block">Categoría</label>
            <select v-model="form.category"
              :class="[
                'w-full bg-gray-700 text-white rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                errors.category ? 'border-red-500' : 'border-gray-600'
              ]">
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="category in Object.values(Categories)" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <p v-if="errors.category" class="text-red-400 text-sm mt-1">{{ errors.category }}</p>
          </div>

          <!-- Precio -->
          <div>
            <label class="text-white mb-2 block">Precio</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01"
              :class="[
                'w-full bg-gray-700 text-white rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                errors.price ? 'border-red-500' : 'border-gray-600'
              ]"
              placeholder="0.0" />
            <p v-if="errors.price" class="text-red-400 text-sm mt-1">{{ errors.price }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="text-white mb-2 block">Email</label>
            <input v-model="form.email" type="email"
              :class="[
                'w-full bg-gray-700 text-white rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                errors.email ? 'border-red-500' : 'border-gray-600'
              ]"
              placeholder="tu@email.com" />
            <p v-if="errors.email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <!-- Botón de submit -->
          <button type="submit" :disabled="loading || isUploading"
            class="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
            <template v-if="loading || isUploading">
              <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
            </template>
            <template v-else>Publicar</template>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useImageUpload } from '@/composables/useImageUpload'
import { useFormValidation } from '@/composables/useFormValidation'
import type { CreateProductForm } from '@/types'
import { useToast } from "vue-toastification";
import { productService } from '@/services/productService'
import { Categories } from '@/constants/category'

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)

// Composables
const { previewImage, handleImageChange, resetImage, uploadImage, isUploading, imageError } = useImageUpload()
const { errors, validateProductForm } = useFormValidation()
const toast = useToast()

const form = ref<CreateProductForm>({} as CreateProductForm)
const loading = ref(false)
const generalError = ref<string | null>(null)

// Methods
const handleSubmit = async () => {
  // Clear previous errors
  generalError.value = null

  if (!validateProductForm(form.value)) {
    toast.error('Por favor corrige los errores en el formulario')
    return
  }

  // Upload image to S3 if available
  if (previewImage.value) {
    const imageUrl = await uploadImage()
    if (imageUrl) {
      form.value.image_url = imageUrl
    } else {
      toast.error('Error al subir la imagen. Intenta nuevamente.')
      // return
    }
  }
  

  loading.value = true
  try {
    const response = await productService.createProduct(form.value)

    if (!response.success) {
      // Handle API errors
      const errorMessage = response.error || response.message || 'Error al crear el producto'
      generalError.value = errorMessage
      toast.error(errorMessage)
      return
    }

    toast.success(response.message || 'Producto creado exitosamente')
    router.push(`/product/${response.data?.id}`)

  } catch (error) {
    console.error('Error creating product:', error)

    // Handle different types of errors
    let errorMessage = 'Error inesperado al crear el producto'

    if (error instanceof Error) {
      if (error.message.includes('Authentication required')) {
        errorMessage = 'Debes iniciar sesión para crear productos'
        toast.error(errorMessage)
        router.push('/login')
        return
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente'
      } else {
        errorMessage = `Error: ${error.message}`
      }
    }

    generalError.value = errorMessage
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

// Cleanup
onUnmounted(() => {
  resetImage()
})
</script>

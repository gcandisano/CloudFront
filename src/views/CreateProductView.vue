<template>
  <div class="min-h-screen bg-gray-900">
    <div class="flex flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white text-center mb-6">Agrega tu producto</h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Foto -->
          <div>
            <label class="text-white mb-2 block">Foto</label>
            <div
              class="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors"
              @click="$refs.fileInput.click()"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Preview"
                class="w-32 h-32 object-cover rounded-lg mb-2"
              />
              <div v-else class="w-32 h-32 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <span class="text-blue-500 text-sm mt-2">Sube un archivo</span>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageChange"
              />
            </div>
          </div>

          <!-- Nombre del producto -->
          <div>
            <label class="text-white mb-2 block">Nombre del producto</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jean Azul Marino"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="text-white mb-2 block">Descripción</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe tu producto"
            ></textarea>
          </div>

          <!-- Categoría -->
          <div>
            <label class="text-white mb-2 block">Categoría</label>
            <select
              v-model="form.category"
              class="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Precio -->
          <div>
            <label class="text-white mb-2 block">Precio</label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              class="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>

          <!-- Botón de submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <template v-if="loading">
              <div
                class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"
              ></div>
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
import { useProductStore } from '@/stores/product'
import { useImageUpload } from '@/composables/useImageUpload'
import { useFormValidation } from '@/composables/useFormValidation'
import type { CreateProductForm } from '@/types'
import { useToast } from "vue-toastification";

const router = useRouter()
const productStore = useProductStore()
const categories = productStore.categories
const fileInput = ref<HTMLInputElement | null>(null)

// Composables
const { previewImage, imageFile, imageError, handleImageChange, resetImage } = useImageUpload()
const { errors, validateProductForm } = useFormValidation()

const toast = useToast()

// Estado del formulario
const form = ref<CreateProductForm>({
  name: '',
  description: '',
  category: '',
  price: 0,
  image: null,
})

// Estado de la UI
const loading = ref(false)

// Métodos
const handleSubmit = async () => {
  if (!validateProductForm(form.value)) return
  form.value.image = imageFile.value

  loading.value = true
  try {
    const product = await productStore.createProduct(form.value)
    router.push(`/product/${product.id}`)
  } catch (error) {
    console.error('Error creating product:', error)
    toast.error('Error creating product')
  } finally {
    loading.value = false
  }
}

// Cleanup
onUnmounted(() => {
  resetImage()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="flex justify-center items-center my-2">
        <div class="w-full max-w-lg p-4 border bg-gray-800 border-gray-700 rounded-lg shadow-xl sm:p-6 md:p-8">
          <h2 class="my-5 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Editar Producto
          </h2>

          <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          <form v-else @submit.prevent="handleSubmit" enctype="multipart/form-data" id="productForm">
            <!-- Image -->
            <div class="col-span-full mb-4">
              <label class="block text-sm font-medium leading-6 text-white mb-2">Imagen del producto</label>
              <div class="mt-2 flex justify-center rounded-lg border border-gray-500 px-6 py-2 bg-gray-700">
                <div class="text-center">
                  <img
                    id="cover-photo"
                    :src="imagePreview || (product?.image_url || `${apiBaseUrl}/icon/gallery.png`)"
                    class="mx-auto h-auto w-24 rounded-sm text-white"
                    alt="Preview"
                  />
                  <div class="mt-4 text-sm leading-6 text-gray-400">
                    <label for="image" class="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 hover:text-blue-500">
                      <span>Subir imagen</span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        class="sr-only"
                        @change="handleImageChange"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Name -->
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium leading-6 text-white mb-2">Nombre</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="bg-gray-700 block w-full rounded-md py-1.5 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="Nombre del producto"
                maxlength="128"
              />
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium leading-6 text-white mb-2">Descripción</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="bg-gray-700 block w-full rounded-md py-1.5 pl-3 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="Descripción del producto"
                maxlength="2048"
              ></textarea>
            </div>

            <!-- Category -->
            <div class="mb-4">
              <label for="category" class="block text-sm font-medium leading-6 text-white mb-2">Categoría</label>
              <select
                id="category"
                v-model="form.category"
                required
                class="bg-gray-700 block w-full rounded-md py-1.5 pl-3 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Electronics">Electrónica</option>
                <option value="Clothing">Ropa</option>
                <option value="Home">Hogar</option>
                <option value="Sports">Deportes</option>
                <option value="Books">Libros</option>
                <option value="Toys">Juguetes</option>
              </select>
            </div>

            <!-- Price -->
            <div class="mb-4">
              <label for="price" class="block text-sm font-medium leading-6 text-white mb-2">Precio</label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                min="1"
                step="1"
                required
                class="bg-gray-700 block w-full rounded-md py-1.5 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="0"
              />
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
            </button>

            <router-link
              to="/store/profile"
              class="mt-5 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Cancelar
            </router-link>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services'
import type { Product } from '@/types'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const product = ref<Product | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const imagePreview = ref<string | null>(null)
const form = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
  image: null as File | null,
})

onMounted(async () => {
  await loadProduct()
})

const loadProduct = async () => {
  try {
    loading.value = true
    const productId = route.params.id as string
    const response = await productService.fetchProduct(productId)
    if (response.success && response.data) {
      product.value = response.data
      form.value = {
        name: response.data.name || '',
        description: response.data.description || '',
        category: response.data.category || '',
        price: response.data.price || 0,
        image: null,
      }
    } else {
      toast.error('Error al cargar el producto')
    }
  } catch (error) {
    console.error('Error loading product:', error)
    toast.error('Error al cargar el producto')
  } finally {
    loading.value = false
  }
}

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    form.value.image = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    // TODO: Implementar cuando tengas el backend
    // const response = await productService.updateProduct(route.params.id as string, form.value)
    toast.success('Producto actualizado correctamente')
    router.push('/store/profile')
  } catch (error) {
    console.error('Error updating product:', error)
    toast.error('Error al actualizar el producto')
  } finally {
    isSubmitting.value = false
  }
}
</script>



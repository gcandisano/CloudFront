<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-white">Editar Tienda</h1>
      <hr class="h-px my-6 border-0 bg-gray-700" />

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="mx-auto sm:w-full max-w-sm md:max-w-lg border rounded-md shadow bg-gray-800 border-gray-700 p-8 mt-5" enctype="multipart/form-data">
        <!-- Cover Image -->
        <div class="col-span-full mb-4">
          <label class="block text-sm font-medium leading-6 text-white mb-2">Imagen de portada</label>
          <div class="mt-2 flex justify-center rounded-lg border border-gray-500 px-6 py-2 bg-gray-700">
            <div class="text-center">
              <img
                :id="'cover-photo'"
                :src="coverImagePreview || (store?.coverImageId ? `${apiBaseUrl}/image/${store.coverImageId}` : `${apiBaseUrl}/icon/gallery.png`)"
                class="mx-auto h-auto w-24 rounded-sm text-white"
                alt="Preview"
              />
              <div class="mt-4 text-sm leading-6 text-gray-400">
                <label for="coverImage" class="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 hover:text-blue-500">
                  <span>Subir imagen de portada</span>
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="handleCoverImageChange"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Store Image -->
        <div class="col-span-full mb-4">
          <label class="block text-sm font-medium leading-6 text-white mb-2">Imagen de tienda</label>
          <div class="mt-2 flex justify-center rounded-lg border border-gray-500 px-6 py-2 bg-gray-700">
            <div class="text-center">
              <img
                :id="'store-photo'"
                :src="storeImagePreview || (store?.storeImageId ? `${apiBaseUrl}/image/${store.storeImageId}` : `${apiBaseUrl}/icon/gallery.png`)"
                class="mx-auto h-auto w-24 rounded-sm text-white"
                alt="Preview"
              />
              <div class="mt-4 text-sm leading-6 text-gray-400">
                <label for="storeImage" class="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 hover:text-blue-500">
                  <span>Subir imagen de tienda</span>
                  <input
                    id="storeImage"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="handleStoreImageChange"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Store Name -->
        <div class="mb-4">
          <label for="storeName" class="block mb-2 text-sm font-medium text-white">Nombre de la tienda</label>
          <input
            id="storeName"
            v-model="form.storeName"
            type="text"
            class="bg-gray-700 block w-full rounded-md py-1.5 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            placeholder="Nombre de la tienda"
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
            placeholder="Descripción de la tienda"
            maxlength="2048"
          ></textarea>
        </div>

        <!-- CBU -->
        <div class="mb-4">
          <label for="cbu" class="block mb-2 text-sm font-medium text-white">CBU</label>
          <input
            id="cbu"
            v-model="form.cbu"
            type="text"
            class="bg-gray-700 block w-full rounded-md py-1.5 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            placeholder="1234567890123456789012"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="mx-auto w-4/5 flex justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-5 disabled:opacity-50"
        >
          <svg v-if="!isSubmitting" class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 11.917 9.724 16.5 19 7.5"></path>
          </svg>
          {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>

        <router-link
          to="/store/profile"
          class="mx-auto w-4/5 flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-5"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 17.94 6M18 18 6.06 6"></path>
          </svg>
          Cancelar
        </router-link>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeService, type Store, type UpdateStoreForm } from '@/services'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const store = ref<Store | null>(null)
const loading = ref(true)
const isSubmitting = ref(false)
const coverImagePreview = ref<string | null>(null)
const storeImagePreview = ref<string | null>(null)
const form = ref<UpdateStoreForm>({
  storeName: '',
  description: '',
  cbu: '',
})

onMounted(async () => {
  await loadStore()
})

const loadStore = async () => {
  try {
    loading.value = true
    const response = await storeService.getStore()
    if (response.success && response.data) {
      store.value = response.data
      form.value = {
        storeName: response.data.storeName || '',
        description: response.data.description || '',
        cbu: response.data.cbu || '',
      }
    } else {
      toast.error('Error al cargar la tienda')
    }
  } catch (error) {
    console.error('Error loading store:', error)
    toast.error('Error al cargar la tienda')
  } finally {
    loading.value = false
  }
}

const handleCoverImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    form.value.coverImage = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      coverImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

const handleStoreImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    form.value.storeImage = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      storeImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const response = await storeService.updateStore(form.value)
    if (response.success) {
      toast.success('Tienda actualizada correctamente')
      router.push('/store/profile')
    } else {
      toast.error(response.message || 'Error al actualizar la tienda')
    }
  } catch (error) {
    console.error('Error updating store:', error)
    toast.error('Error al actualizar la tienda')
  } finally {
    isSubmitting.value = false
  }
}
</script>


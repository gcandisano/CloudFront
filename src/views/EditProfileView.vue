<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-white">Editar Perfil</h1>
      <hr class="h-px my-6 border-0 bg-gray-700" />

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="mx-auto sm:w-full sm:max-w-sm border rounded-md shadow bg-gray-800 border-gray-700 p-8 mt-5">
        <div class="mx-auto w-full">
          <label for="first_name" class="block mb-2 text-sm font-medium text-white">Nombre</label>
          <input
            id="first_name"
            v-model="form.first_name"
            type="text"
            required
            class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            placeholder="Nombre"
          />
        </div>

        <div class="mx-auto w-full mt-5">
          <label for="last_name" class="block mb-2 text-sm font-medium text-white">Apellido</label>
          <input
            id="last_name"
            v-model="form.last_name"
            type="text"
            required
            class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            placeholder="Apellido"
          />
        </div>

        <div class="mx-auto w-full mt-5">
          <label for="phone" class="block mb-2 text-sm font-medium text-white">Teléfono</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            placeholder="+1234567890"
          />
        </div>

        <div class="mx-auto w-full mt-5">
          <label for="address" class="block mb-2 text-sm font-medium text-white">Dirección</label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            placeholder="Calle y número"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="mx-auto w-4/5 flex justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-5 disabled:opacity-50"
        >
          <svg v-if="!isSubmitting" class="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 11.917 9.724 16.5 19 7.5"></path>
          </svg>
          {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>

        <router-link
          to="/profile"
          class="mx-auto w-4/5 flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 mt-5"
        >
          <svg class="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 17.94 6M18 18 6.06 6"></path>
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
import { userService, type UpdateProfileForm } from '@/services'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const loading = ref(true)
const isSubmitting = ref(false)
const form = ref<UpdateProfileForm>({
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
})

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  try {
    loading.value = true
    const response = await userService.getProfile()
    if (response.success && response.data) {
      form.value = {
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        phone: response.data.phone || '',
        address: response.data.address || '',
      }
    } else {
      toast.error(response.message || 'Error al cargar el perfil')
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    toast.error('Error al cargar el perfil')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const response = await userService.updateProfile(form.value)
    if (response.success) {
      toast.success('Perfil actualizado correctamente')
      router.push('/profile')
    } else {
      toast.error(response.message || 'Error al actualizar el perfil')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error('Error al actualizar el perfil')
  } finally {
    isSubmitting.value = false
  }
}
</script>


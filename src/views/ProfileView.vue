<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-white">Mi Perfil</h1>
      <hr class="h-px my-6 border-0 bg-gray-700" />

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="profile" class="mx-auto sm:w-full sm:max-w-sm border rounded-md shadow bg-gray-800 border-gray-700 p-8 mt-5 text-center">
        <h2 class="text-xl font-bold tracking-tight text-white mt-4">
          {{ profile.first_name }} {{ profile.last_name }}
        </h2>
        <h2 class="text-lg font-normal tracking-tight text-gray-400 mt-2">
          {{ profile.email }}
        </h2>
        <dl class="divide-y text-white divide-gray-700 mt-3">
          <div class="flex flex-col">
            <dt class="mb-1 md:text-md text-gray-400">Teléfono</dt>
            <dd class="mb-3 text-md font-medium">{{ profile.phone || 'No especificado' }}</dd>
            <dt class="mb-1 md:text-md text-gray-400">Dirección</dt>
            <dd class="mb-3 text-md font-medium">{{ profile.address || 'No especificada' }}</dd>
          </div>
        </dl>

        <router-link
          to="/profile/edit"
          class="mx-auto mt-5 flex w-4/5 justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <svg class="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
          </svg>
          Editar Perfil
        </router-link>

        <button
          @click="showDeleteModal = true"
          class="mx-auto mt-5 flex w-4/5 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <svg class="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"></path>
          </svg>
          Eliminar Cuenta
        </button>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Eliminar Cuenta</h3>
            <button @click="showDeleteModal = false" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-gray-400 mb-6">¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
          <div class="flex gap-4">
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {{ deleting ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
            <button
              @click="showDeleteModal = false"
              class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userService, type UserProfile } from '@/services'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const profile = ref<UserProfile | null>(null)
const loading = ref(true)
const showDeleteModal = ref(false)
const deleting = ref(false)

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  try {
    loading.value = true
    const response = await userService.getProfile()
    if (response.success && response.data) {
      profile.value = response.data
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

const handleDelete = async () => {
  try {
    deleting.value = true
    const response = await userService.deleteProfile()
    if (response.success) {
      toast.success('Cuenta eliminada correctamente')
      authStore.logout()
      router.push('/')
    } else {
      toast.error(response.message || 'Error al eliminar la cuenta')
    }
  } catch (error) {
    console.error('Error deleting profile:', error)
    toast.error('Error al eliminar la cuenta')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}
</script>


<template>
  <div class="bg-gray-900">
    <!-- Cover photo -->
    <div class="relative">
      <img
        v-if="store.coverImageId"
        :src="`${apiBaseUrl}/image/${store.coverImageId}`"
        :alt="store.storeId"
        class="w-full h-72 object-cover"
      />
      <img
        v-else
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwCZuPEj9h143VuSs4O2SLOSLzwsYKQnA1mXOqedRdfw&s"
        alt="Cover Photo"
        class="w-full h-72 object-cover"
      />

      <!-- Store image -->
      <img
        v-if="store.storeImageId"
        :src="`${apiBaseUrl}/image/${store.storeImageId}`"
        :alt="store.storeId"
        class="w-1/5 md:w-36 aspect-square rounded-full absolute bottom-2 left-4 border-4 border-white z-10 shadow-lg py-1"
      />
      <img
        v-else
        :src="`${apiBaseUrl}/icon/store.svg`"
        alt="Store Icon"
        class="w-1/5 md:w-36 aspect-square rounded-full absolute bottom-2 left-4 border-4 border-white z-10 shadow-lg py-1"
      />
    </div>

    <!-- Store info -->
    <div class="flex items-center justify-between pl-6 mt-3">
      <div class="text-left text-5xl font-bold">
        <h1 class="text-white">
          {{ getStoreDisplayName() }}
        </h1>
      </div>

      <!-- Botón "Ir a mi tienda" si el usuario es el propietario -->
      <router-link
        v-if="isOwner"
        to="/store"
        class="text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3 mx-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
      >
        Ir a mi tienda
      </router-link>
    </div>

    <!-- Descripción de la tienda -->
    <div v-if="store.description" class="mt-2 px-8">
      <p class="text-white text-lg break-words whitespace-pre-wrap text-pretty">
        {{ store.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Store, User } from '@/types'

// Props
interface Props {
  store: Store
  currentUser: User | null
}

const props = defineProps<Props>()

// Configuración de la API
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Computed
const isOwner = computed(() => {
  return props.currentUser && props.store.storeId === props.currentUser.id
})

// Métodos
const getStoreDisplayName = (): string => {
  if (props.store.storeName) {
    return props.store.storeName
  }

  if (props.store.user.firstName) {
    return `Tienda de ${props.store.user.firstName}`
  }

  return `Tienda ${props.store.storeId}`
}
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>

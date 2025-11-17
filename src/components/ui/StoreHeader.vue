<template>
  <div class="bg-gray-900">
    <!-- Cover photo -->
    <div class="relative">
      <img
        v-if="store.cover_image_url"
        :src="store.cover_image_url"
        :alt="store.store_name"
        class="w-full h-72 object-cover"
      />
      <div
        v-else
        class="w-full h-72 bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center"
      >
        <p class="text-gray-500 text-lg">Sin imagen de portada</p>
      </div>

      <!-- Store image -->
      <div class="absolute bottom-2 left-4">
        <StoreImage
          :store-image-url="store.store_image_url"
          :store-name="store.store_name"
          size="circle"
        />
      </div>
    </div>

    <!-- Store info -->
    <div class="flex items-center justify-between pl-6 mt-3">
      <div class="text-left text-5xl font-bold">
        <h1 class="text-white">
          {{ store.store_name }}
        </h1>
      </div>

      <!-- Botón de editar si el usuario es el propietario -->
      <button
        v-if="isOwner"
        @click="$emit('edit')"
        class="text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-3 mx-4 bg-gray-700 hover:bg-gray-600 flex items-center gap-2 transition-colors"
        aria-label="Editar tienda"
      >
        <PencilIcon size="w-5 h-5" />
        <span>Editar</span>
      </button>
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
import type { StoreResponse, User } from '@/types'
import { useUserStore } from '@/stores/user'
import StoreImage from '@/components/stores/StoreImage.vue'
import PencilIcon from '@/components/icons/PencilIcon.vue'

// Props
interface Props {
  store: StoreResponse
  currentUser?: User | null
}

const props = withDefaults(defineProps<Props>(), {
  currentUser: null,
})

// Emits
defineEmits<{
  edit: []
}>()

const userStore = useUserStore()

// Computed
const isOwner = computed(() => {
  const user = props.currentUser || userStore.user
  return user && (user.id === props.store.store_id || false)
})
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>

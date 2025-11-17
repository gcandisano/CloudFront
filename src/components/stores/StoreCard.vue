<template>
  <div
    class="group relative"
    @mouseenter="isHoveringCard = true"
    @mouseleave="isHoveringCard = false"
  >
    <router-link :to="`/store/${store.store_id}`">
      <div class="border bg-gray-800 border-gray-700 rounded-lg shadow-xl">
        <!-- Store Profile Picture -->
        <div
          class="transition-opacity duration-200"
          :class="{ 'opacity-75': isHoveringCard }"
        >
          <StoreImage
            :store-image-url="store.store_image_url"
            :store-name="store.store_name"
            size="card"
          />
        </div>

        <!-- Store Name -->
        <div class="mt-4 mx-4 mb-3">
          <p class="truncate text-md font-medium text-white ml-0">
            {{ store.store_name }}
          </p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { StoreResponse } from '@/types'
import StoreImage from '@/components/stores/StoreImage.vue'

// Props
interface StoreCardProps {
  store: StoreResponse
}

defineProps<StoreCardProps>()

// State
const isHoveringCard = ref(false)
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>


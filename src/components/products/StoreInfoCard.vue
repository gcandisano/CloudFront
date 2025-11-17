<template>
  <router-link
    v-if="product.store_id"
    :to="`/store/${product.store_id}`"
    class="block border border-gray-700 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200"
  >
    <div class="flex items-center gap-4">
      <StoreImage
        :store-image-url="product.store_image_url"
        :store-name="product.store_name"
        size="circle"
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-400 mb-1">Vendido por</p>
        <p class="text-lg font-medium text-white truncate">
          {{ product.store_name }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Product } from '@/types'
import StoreImage from '@/components/stores/StoreImage.vue'

interface Props {
  product: Product
}

defineProps<Props>()
</script>

<style scoped>
/* Additional styles if needed */
</style>

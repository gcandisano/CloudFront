<template>
  <div class="group relative">
    <router-link :to="`/product/${product.id}`">
      <div class="border bg-gray-800 border-gray-700 rounded-lg shadow-xl">
        <!-- Imagen del producto -->
        <div
          class="aspect-h-1 h-80 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none group-hover:opacity-75"
        >
          <img
            v-if="product.imageId && product.imageId.startsWith('http')"
            :src="product.imageId"
            :alt="product.name"
            class="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
          <img
            v-else-if="product.imageId"
            :src="`${apiBaseUrl}/image/${product.imageId}`"
            :alt="product.name"
            class="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
          <img
            v-else
            src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
            :alt="`Foto de ${product.name}`"
            class="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>

        <!-- Información del producto -->
        <div class="mt-4 mx-4 mb-3 flex justify-between">
          <p class="truncate text-md font-medium text-white ml-0">
            {{ product.name }}
          </p>
          <p class="text-md font-medium text-white">
            {{ formatPrice(product.price) }}
          </p>
        </div>

        <!-- Información de la tienda (solo si showStore es true) -->
        <router-link v-if="showStore" :to="`/store/${product.sellerId}`">
          <div
            class="py-1 mx-3 hover:mx-0 hover:px-3 flex border-t border-gray-700 hover:bg-gray-700 hover:rounded-md"
          >
            <div class="h-12 w-12 rounded-full overflow-hidden p-1 mr-3">
              <img
                v-if="product.seller.store.storeImageId"
                :src="`${apiBaseUrl}/image/${product.seller.store.storeImageId}`"
                alt="Store Icon"
                class="rounded-full h-full w-full object-cover"
              />
              <img
                v-else
                :src="`${apiBaseUrl}/icon/store.svg`"
                alt="Store Icon"
                class="rounded-full h-full w-full object-cover"
              />
            </div>

            <div class="my-auto">
              <p class="text-sm text-white">
                {{ getStoreDisplayName() }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'

// Props
interface Props {
  product: Product
  showStore: boolean
}

const props = defineProps<Props>()

// Configuración de la API
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Computed
const getStoreDisplayName = () => {
  const store = props.product.seller.store
  const storeName = store.storeName

  if (storeName) {
    return storeName
  }

  if (props.product.seller.firstName) {
    return `Tienda de ${props.product.seller.firstName}`
  }

  return `Tienda ${store.storeId}`
}

// Métodos
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>

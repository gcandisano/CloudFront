<template>
  <div class="mt-6 sm:mt-8 lg:mt-0">
    <h1 class="text-xl font-semibold sm:text-2xl text-white">
      {{ product.name }}
    </h1>

    <!-- Categoría -->
    <p class="my-4">
      Categoría:
      <router-link
        :to="`/?category=${product.category}`"
        class="text-blue-400 hover:text-blue-500"
      >
        {{ product.category }}
      </router-link>
    </p>

    <!-- Precio y rating -->
    <div class="mt-4 sm:items-center sm:gap-4 sm:flex">
      <p class="text-2xl font-extrabold sm:text-3xl text-white">
        {{ formatPrice(product.price) }}
      </p>

      <div class="flex items-center gap-2 mt-2 sm:mt-0">
        <div
          v-if="product.ratingCount && product.ratingCount > 0"
          class="flex items-center gap-1"
        >
          <!-- Estrellas -->
          <template v-for="i in 5" :key="`star-${i}`">
            <StarIcon
              :class="[
                'w-4 h-4',
                i <= Math.floor(product.rating || 0) ? 'text-yellow-300' : 'text-gray-500',
              ]"
              size="w-4 h-4"
            />
          </template>

          <p class="text-sm font-medium leading-none text-gray-400">
            ({{ product.rating?.toFixed(2) || '0.00' }})
          </p>

          <a
            href="#reviews"
            class="text-sm font-medium leading-none underline hover:no-underline text-white"
          >
            {{
              product.ratingCount && product.ratingCount === 1
                ? '1 reseña'
                : `${product.ratingCount} reseñas`
            }}
          </a>
        </div>

        <div v-else>
          <p class="text-sm font-medium leading-none text-gray-400">Sin reseñas</p>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div
      v-if="!isOwner && !product.paused && isAuthenticated"
      class="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:mt-8"
    >
      <!-- Botón de favoritos -->
      <button
        @click="$emit('toggle-favorite')"
        class="w-full sm:w-auto flex items-center justify-center py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
      >
        <span v-if="!isLiked" class="-ms-2 me-2">
          <HeartIcon :filled="false" size="w-5 h-5" />
        </span>
        <span v-else class="-ms-2 me-2 text-red-500">
          <HeartIcon :filled="true" size="w-5 h-5" />
        </span>
        <span v-if="!isLiked">Agregar a favoritos</span>
        <span v-else>Quitar de favoritos</span>
      </button>

      <!-- Botón de comprar ahora -->
      <button
        @click="$emit('buy-now')"
        class="w-full sm:w-auto text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 flex items-center justify-center"
      >
        <span class="-ms-2 me-2">
          <ShoppingCartIcon size="w-5 h-5" />
        </span>
        Comprar ahora
      </button>
    </div>

    <div v-else-if="!isOwner && product.paused" class="mt-6 sm:mt-8">
      <p class="mb-6 text-gray-400 break-words text-pretty">
        Este producto no está disponible actualmente
      </p>
    </div>

    <div v-else-if="isOwner" class="mt-6 sm:mt-8">
      <router-link
        to="/store"
        class="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 flex items-center justify-center w-full sm:w-auto"
      >
        Mis productos
      </router-link>
    </div>

    <hr class="my-6 md:my-8 border-gray-800" />

    <!-- Descripción -->
    <p class="mb-6 text-gray-400 break-words text-pretty">
      {{ product.description || 'Este producto no tiene descripción.' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types'
import { formatPrice } from '@/utils/formatting'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import ShoppingCartIcon from '@/components/icons/ShoppingCartIcon.vue'

interface Props {
  product: Product
  isOwner: boolean
  isAuthenticated: boolean
  isLiked: boolean
}

defineProps<Props>()

defineEmits<{
  'toggle-favorite': []
  'buy-now': []
}>()
</script>


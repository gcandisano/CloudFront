<template>
  <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
    <!-- Header: Order ID, Date, Status -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2 sm:mb-0">
        <h3 class="text-lg font-semibold text-white">Orden #{{ order.id }}</h3>
        <span class="text-sm text-gray-400">
          {{ formatDate(order.date) }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusClass(order.status)]">
          {{ formatStatus(order.status) }}
        </span>
        <span class="text-xl font-bold text-white">
          {{ formatPrice(order.total_amount) }}
        </span>
      </div>
    </div>

    <!-- Address -->
    <div v-if="order.address" class="mb-4">
      <p class="text-sm text-gray-400 mb-1">Dirección de entrega:</p>
      <p class="text-sm text-white">{{ order.address }}</p>
    </div>

    <!-- Note -->
    <div v-if="order.note" class="mb-4">
      <p class="text-sm text-gray-400 mb-1">Nota:</p>
      <p class="text-sm text-white italic">{{ order.note }}</p>
    </div>

    <!-- Products List -->
    <div class="space-y-3">
      <p class="text-sm font-medium text-gray-400 mb-2">Productos:</p>
      <div v-for="product in order.products" :key="product.product_id"
        class="flex items-start gap-4 p-3 bg-gray-900 rounded-lg">
        <!-- Product Image -->
        <div class="flex-shrink-0">
          <img v-if="product.product_image_url" :src="product.product_image_url" :alt="product.product_name"
            class="w-16 h-16 object-cover rounded-lg" />
          <div v-else class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <span class="text-gray-500 text-xs">Sin imagen</span>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-white truncate">
            {{ product.product_name }}
          </h4>
          <p v-if="product.product_description" class="text-xs text-gray-400 mt-1 line-clamp-2">
            {{ product.product_description }}
          </p>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs text-gray-500">
              {{ product.product_category }}
            </span>
            <span class="text-xs text-gray-500">•</span>
            <span class="text-xs text-gray-500"> Cantidad: {{ product.quantity }} </span>
          </div>
        </div>

        <!-- Product Price and Actions -->
        <div class="flex-shrink-0 text-right flex flex-col items-end gap-2">
          <div>
            <p class="text-sm font-medium text-white">
              {{ formatPrice(product.unit_price) }}
            </p>
            <p class="text-xs text-gray-400">Total: {{ formatPrice(product.total_price) }}</p>
          </div>

          <button v-if="!product.hasReviewed" @click="$emit('review', product)"
            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
            Reseñar
          </button>
        </div>
      </div>
    </div>

    <!-- Invoice ID -->
    <div v-if="order.invoice_id" class="mt-4 pt-4 border-t border-gray-700">
      <p class="text-sm text-gray-400">
        Factura ID: <span class="text-white">{{ order.invoice_id }}</span>
      </p>
    </div>

    <!-- Slot para acciones adicionales (como botón de reseña) -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { SaleWithProducts, SaleProduct } from '@/types'
import { formatPrice, formatDate } from '@/utils/formatting'

interface Props {
  order: SaleWithProducts
}

defineProps<Props>()

defineEmits<{
  review: [product: SaleProduct]
}>()

const formatStatus = (status: string): string => {
  const statusLower = status.toLowerCase()
  let statusText = statusLower

  if (statusLower.includes('pending')) statusText = 'pendiente'
  else if (statusLower.includes('completed')) statusText = 'completado'
  else if (statusLower.includes('cancelled') || statusLower.includes('canceled')) statusText = 'cancelado'
  else if (statusLower.includes('shipped')) statusText = 'enviado'
  else if (statusLower.includes('processing')) statusText = 'procesando'

  return statusText.charAt(0).toUpperCase() + statusText.slice(1)
}

const getStatusClass = (status: string): string => {
  const statusLower = status.toLowerCase()
  if (statusLower.includes('pendiente') || statusLower.includes('pending')) {
    return 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/50'
  }
  if (statusLower.includes('completado') || statusLower.includes('completed')) {
    return 'bg-green-900/30 text-green-300 border border-green-500/50'
  }
  if (statusLower.includes('cancelado') || statusLower.includes('cancelled')) {
    return 'bg-red-900/30 text-red-300 border border-red-500/50'
  }
  if (statusLower.includes('enviado') || statusLower.includes('shipped')) {
    return 'bg-blue-900/30 text-blue-300 border border-blue-500/50'
  }
  return 'bg-gray-700 text-gray-300 border border-gray-600'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-4">
    <h2 class="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>

    <!-- Address Section -->
    <div class="mb-6 pb-6 border-b border-gray-700">
      <h3 class="text-sm font-semibold text-gray-400 mb-2">Dirección de envío</h3>
      <div v-if="address" class="text-white text-sm">
        <p class="break-words">{{ address }}</p>
        <button
          @click="$emit('edit-address')"
          class="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Cambiar dirección
        </button>
      </div>
      <div v-else>
        <p class="text-gray-400 text-sm mb-2">No hay dirección registrada</p>
        <button
          @click="$emit('add-address')"
          class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Agregar dirección
        </button>
      </div>
    </div>

    <!-- Price Summary -->
    <div class="space-y-3 mb-6">
      <div class="flex justify-between text-gray-400 text-sm">
        <span>Subtotal ({{ totalItems }} {{ totalItems === 1 ? 'artículo' : 'artículos' }})</span>
        <span>{{ formatPrice(totalPrice) }}</span>
      </div>
      <div class="flex justify-between text-white font-bold text-lg pt-3 border-t border-gray-700">
        <span>Total</span>
        <span>{{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <!-- Checkout Button -->
    <button
      @click="$emit('checkout')"
      :disabled="!canCheckout || isProcessing"
      class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
    >
      <span v-if="isProcessing" class="flex items-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        Procesando...
      </span>
      <span v-else>Completar Compra</span>
    </button>

    <!-- Continue Shopping -->
    <router-link
      to="/"
      class="block mt-4 text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
    >
      Continuar comprando
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '@/utils/formatting'

interface Props {
  address?: string
  totalItems: number
  totalPrice: number
  canCheckout: boolean
  isProcessing: boolean
}

defineProps<Props>()

defineEmits<{
  'edit-address': []
  'add-address': []
  checkout: []
}>()
</script>


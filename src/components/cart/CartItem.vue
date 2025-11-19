<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Product Image -->
      <div class="flex-shrink-0">
        <router-link :to="`/product/${item.product.id}`">
          <img
            v-if="item.product.image_url"
            :src="item.product.image_url"
            :alt="item.product.name"
            class="w-24 h-24 object-cover rounded-lg"
          />
          <div
            v-else
            class="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <span class="text-gray-500 text-xs">Sin imagen</span>
          </div>
        </router-link>
      </div>

      <!-- Product Info -->
      <div class="flex-1 min-w-0">
        <router-link
          :to="`/product/${item.product.id}`"
          class="text-white font-semibold text-lg hover:text-blue-400 transition-colors"
        >
          {{ item.product.name }}
        </router-link>
        <p class="text-gray-400 text-sm mt-1">{{ item.product.category }}</p>
        <p class="text-white font-bold text-xl mt-2">
          {{ formatPrice(item.product.price) }}
        </p>

        <!-- Quantity Controls -->
        <div class="flex items-center gap-4 mt-4">
          <label class="text-gray-400 text-sm">Cantidad:</label>
          <div class="flex items-center gap-2">
            <button
              @click="handleDecrease"
              class="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="item.quantity <= 1"
            >
              -
            </button>
            <span class="text-white font-medium w-8 text-center">{{ item.quantity }}</span>
            <button
              @click="handleIncrease"
              class="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="item.product.stock !== undefined && item.quantity >= item.product.stock"
            >
              +
            </button>
          </div>
        </div>

        <!-- Remove button -->
        <button
          @click="$emit('remove')"
          class="mt-4 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
        >
          Eliminar
        </button>
      </div>

      <!-- Item Total -->
      <div class="flex-shrink-0 text-right">
        <p class="text-gray-400 text-sm">Total</p>
        <p class="text-white font-bold text-xl">
          {{ formatPrice(item.product.price * item.quantity) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '@/stores/cart'
import { formatPrice } from '@/utils/formatting'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-quantity': [productId: number, quantity: number]
  remove: []
}>()

const handleDecrease = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.product.id, props.item.quantity - 1)
  }
}

const handleIncrease = () => {
  const maxStock = props.item.product.stock
  if (maxStock === undefined || props.item.quantity < maxStock) {
    emit('update-quantity', props.item.product.id, props.item.quantity + 1)
  }
}
</script>


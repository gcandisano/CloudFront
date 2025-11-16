<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-white">Carrito de Compras</h1>
      <hr class="h-px my-6 border-0 bg-gray-700" />

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="cartItems.length === 0" class="text-center text-white py-20">
        <h2 class="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <router-link to="/" class="text-blue-400 hover:text-blue-300">
          Continuar comprando →
        </router-link>
      </div>

      <div v-else class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
        <!-- Lista de productos -->
        <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
          <div class="space-y-6">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm md:p-6"
            >
              <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                <router-link :to="`/product/${item.product_id}`" class="shrink-0 md:order-1">
                  <img
                    class="h-20 w-20 rounded-md"
                    :src="item.product.image_url || 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg'"
                    :alt="item.product.name"
                  />
                </router-link>

                <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                  <router-link
                    :to="`/product/${item.product_id}`"
                    class="text-base font-medium text-white hover:underline"
                  >
                    {{ item.product.name }}
                  </router-link>

                  <div class="flex items-center gap-4">
                    <button
                      @click="handleRemove(item.product_id)"
                      class="inline-flex items-center text-sm font-medium text-red-500 hover:underline"
                    >
                      <svg class="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"></path>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between md:order-3 md:justify-end">
                  <div class="flex items-center">
                    <button
                      @click="handleDecrease(item.product_id)"
                      :disabled="updating"
                      class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50"
                    >
                      <svg class="h-2.5 w-2.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"></path>
                      </svg>
                    </button>
                    <input
                      type="text"
                      :value="item.amount"
                      readonly
                      class="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-white focus:outline-none focus:ring-0"
                    />
                    <button
                      @click="handleIncrease(item.product_id)"
                      :disabled="updating"
                      class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50"
                    >
                      <svg class="h-2.5 w-2.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="text-end md:order-4 md:w-32 ml-4">
                    <p class="text-base font-bold text-white">
                      {{ formatPrice((item.item_total || item.product.price * item.amount)) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
          <div class="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6">
            <p class="text-xl font-semibold text-white">Resumen del Pedido</p>

            <div class="space-y-4">
              <div class="space-y-2">
                <dl
                  v-for="item in cartItems"
                  :key="item.id"
                  class="flex items-center justify-between gap-4"
                >
                  <dt class="text-base font-normal text-gray-400">{{ item.product.name }} x{{ item.amount }}</dt>
                  <dd class="text-base font-medium text-white">
                    {{ formatPrice((item.item_total || item.product.price * item.amount)) }}
                  </dd>
                </dl>
              </div>
              <dl class="flex items-center justify-between gap-4 border-t border-gray-700 pt-2">
                <dt class="text-base font-bold text-white">Total</dt>
                <dd class="text-base font-bold text-white">{{ formatPrice(cartTotal) }}</dd>
              </dl>
            </div>

            <button
              @click="showBuyModal = true"
              class="hover:cursor-pointer flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
            >
              Comprar
            </button>

            <div class="flex items-center justify-center gap-2">
              <span class="text-sm font-normal text-gray-400">o</span>
              <router-link to="/" class="inline-flex items-center gap-2 text-sm font-medium text-blue-500 underline hover:no-underline">
                Continuar comprando
                <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de compra -->
      <div
        v-if="showBuyModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showBuyModal = false"
      >
        <div class="bg-gray-700 rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Realizar Compra</h3>
            <button @click="showBuyModal = false" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleBuy" class="space-y-4">
            <div>
              <label for="address" class="block mb-2 text-sm font-medium text-white">Dirección de entrega</label>
              <input
                id="address"
                v-model="buyForm.address"
                type="text"
                required
                autocomplete="street-address"
                class="border text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                placeholder="Calle y número"
                maxlength="255"
              />
            </div>

            <div>
              <label for="note" class="block mb-2 text-sm font-medium text-white">Nota (opcional)</label>
              <input
                id="note"
                v-model="buyForm.note"
                type="text"
                class="border text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                placeholder="Instrucciones especiales"
                maxlength="144"
              />
            </div>

            <button
              type="submit"
              :disabled="buying"
              class="text-white inline-flex items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 disabled:opacity-50 w-full justify-center"
            >
              {{ buying ? 'Procesando...' : 'Confirmar Compra' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartService, saleService } from '@/services'
import type { CartItem } from '@/types/cart'
import { formatPrice } from '@/utils/formatting'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const cartItems = ref<CartItem[]>([])
const loading = ref(true)
const updating = ref(false)
const showBuyModal = ref(false)
const buying = ref(false)
const buyForm = ref({
  address: '',
  note: '',
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.item_total || item.product.price * item.amount)
  }, 0)
})

onMounted(async () => {
  await loadCart()
})

const loadCart = async () => {
  try {
    loading.value = true
    const response = await cartService.getCart()
    if (response.success && response.data) {
      cartItems.value = response.data.cart || []
    } else {
      toast.error(response.message || 'Error al cargar el carrito')
    }
  } catch (error) {
    console.error('Error loading cart:', error)
    toast.error('Error al cargar el carrito')
  } finally {
    loading.value = false
  }
}

const handleIncrease = async (productId: number) => {
  try {
    updating.value = true
    const item = cartItems.value.find(i => i.product_id === productId)
    if (item) {
      const response = await cartService.updateCartItem(productId, { amount: item.amount + 1 })
      if (response.success) {
        await loadCart()
      } else {
        toast.error('Error al actualizar el carrito')
      }
    }
  } catch (error) {
    console.error('Error increasing item:', error)
    toast.error('Error al actualizar el carrito')
  } finally {
    updating.value = false
  }
}

const handleDecrease = async (productId: number) => {
  try {
    updating.value = true
    const item = cartItems.value.find(i => i.product_id === productId)
    if (item && item.amount > 1) {
      const response = await cartService.updateCartItem(productId, { amount: item.amount - 1 })
      if (response.success) {
        await loadCart()
      } else {
        toast.error('Error al actualizar el carrito')
      }
    }
  } catch (error) {
    console.error('Error decreasing item:', error)
    toast.error('Error al actualizar el carrito')
  } finally {
    updating.value = false
  }
}

const handleRemove = async (productId: number) => {
  try {
    updating.value = true
    const response = await cartService.removeFromCart(productId)
    if (response.success) {
      await loadCart()
      toast.success('Producto eliminado del carrito')
    } else {
      toast.error('Error al eliminar el producto')
    }
  } catch (error) {
    console.error('Error removing item:', error)
    toast.error('Error al eliminar el producto')
  } finally {
    updating.value = false
  }
}

const handleBuy = async () => {
  try {
    buying.value = true
    const response = await saleService.createSale({
      total: cartTotal.value,
      address: buyForm.value.address,
      note: buyForm.value.note || undefined,
      cart_product_ids: cartItems.value.map(item => item.product_id),
    })

    if (response.success && response.data) {
      toast.success('Compra realizada correctamente')
      showBuyModal.value = false
      await cartService.clearCart()
      router.push(`/orders/${response.data.id}`)
    } else {
      toast.error(response.message || 'Error al realizar la compra')
    }
  } catch (error) {
    console.error('Error buying:', error)
    toast.error('Error al realizar la compra')
  } finally {
    buying.value = false
  }
}
</script>



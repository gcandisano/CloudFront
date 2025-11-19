<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-white mb-8">Mi Carrito</h1>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Empty cart -->
      <EmptyCart v-else-if="cartStore.isEmpty" />

      <!-- Cart with items -->
      <div v-else class="lg:grid lg:grid-cols-3 lg:gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <CartItem v-for="item in cartStore.items" :key="item.product.id" :item="item"
            @update-quantity="updateQuantity" @remove="removeItem(item.product.id)" />
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1 mt-8 lg:mt-0">
          <CartSummary :address="userStore.user?.address" :total-items="cartStore.totalItems"
            :total-price="cartStore.totalPrice" :can-checkout="canCheckout" :is-processing="isProcessing"
            @edit-address="showAddressModal = true" @add-address="showAddressModal = true" @checkout="handleCheckout" />
        </div>
      </div>
    </div>

    <!-- Add Address Modal -->
    <AddAddressModal :is-open="showAddressModal" @close="showAddressModal = false" @saved="handleAddressSaved" />

    <SaleReviewModal :is-open="showReviewModal" :products="currentReviewProducts" @close="handleReviewNext"
      @submitted="handleReviewNext" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { saleService } from '@/services/saleService'
import { useToast } from 'vue-toastification'
import AddAddressModal from '@/components/ui/AddAddressModal.vue'
import SaleReviewModal from '@/components/ui/SaleReviewModal.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import EmptyCart from '@/components/cart/EmptyCart.vue'
import type { SaleProduct } from '@/types'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const isProcessing = ref(false)
const showAddressModal = ref(false)

// Review Modal State
const showReviewModal = ref(false)
const reviewQueue = ref<SaleProduct[]>([])
const currentReviewProducts = ref<SaleProduct[]>([])

// Computed properties
const canCheckout = computed(() => {
  return (
    !cartStore.isEmpty &&
    !!userStore.user?.address &&
    userStore.user.address.trim().length > 0
  )
})

// Methods
onMounted(async () => {
  loading.value = true
  try {
    // Ensure user data is loaded
    if (authStore.isAuthenticated && !userStore.user) {
      await userStore.fetchCurrentUser()
    }

    // Load cart from backend and merge with frontend cart
    if (authStore.isAuthenticated) {
      await cartStore.mergeCarts()
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  } finally {
    loading.value = false
  }
})

const updateQuantity = (productId: number, quantity: number) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeItem = (productId: number) => {
  cartStore.removeItem(productId)
}

const handleAddressSaved = async () => {
  showAddressModal.value = false
  // User store is already updated by the modal
  toast.success('Dirección guardada exitosamente')
}

const startReviewProcess = () => {
  if (reviewQueue.value.length === 0) {
    router.push('/orders')
    return
  }

  // Take the next product from the queue
  const nextProduct = reviewQueue.value[0]
  currentReviewProducts.value = [nextProduct]
  showReviewModal.value = true
}

const handleReviewNext = () => {
  showReviewModal.value = false
  // Remove the processed product
  reviewQueue.value.shift()

  // Small delay to allow modal to close visually before opening next
  setTimeout(() => {
    startReviewProcess()
  }, 300)
}

const handleCheckout = async () => {
  if (!canCheckout.value || isProcessing.value) return

  // Check if user has an address
  if (!userStore.user?.address || userStore.user.address.trim().length === 0) {
    showAddressModal.value = true
    return
  }

  isProcessing.value = true

  try {
    // Sync cart to backend first (ensure latest state)
    await cartStore.syncToBackend(true)

    // Validate cart before checkout
    const validation = await cartStore.validateCart()
    if (!validation.valid) {
      toast.error(validation.errors?.[0] || 'El carrito contiene productos inválidos')
      // Reload cart from backend to get corrected quantities/prices
      await cartStore.loadFromBackend()
      return
    }

    // Prepare sale data
    const saleData = {
      products: cartStore.items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      address: userStore.user.address,
    }

    const response = await saleService.createSale(saleData)

    if (!response.success || !response.data) {
      toast.error(response.message || 'Error al realizar la compra')
      return
    }

    toast.success(response.data.message || 'Compra realizada exitosamente')

    // Prepare products for review before clearing cart
    reviewQueue.value = cartStore.items.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
      product_name: item.product.name,
      product_description: item.product.description,
      product_category: item.product.category,
      product_image_url: item.product.image_url
    }))

    // Clear cart
    await cartStore.clearCart()

    // Start the review process instead of redirecting immediately
    startReviewProcess()

  } catch (error) {
    console.error('Error processing checkout:', error)
    toast.error('Error al procesar la compra')
  } finally {
    isProcessing.value = false
  }
}
</script>

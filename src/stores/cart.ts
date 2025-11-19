import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types'
import { cartService } from '@/services/cartService'
import { useAuthStore } from './auth'

export interface CartItem {
  product: Product
  quantity: number
}

const CART_STORAGE_KEY = 'cart_items'
const SYNC_DEBOUNCE_MS = 1000 // Wait 1 second after last change before syncing

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isSyncing = ref(false)
  const lastSyncTime = ref<number | null>(null)
  const syncTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
  const authStore = useAuthStore()

  // Load cart from localStorage on initialization
  const loadCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      items.value = []
    }
  }

  // Save cart to localStorage
  const saveCart = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }

  // Convert CartItem[] to backend format (product_id, quantity)
  const toBackendFormat = (cartItems: CartItem[]) => {
    return cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }))
  }

  // Convert backend format to CartItem[]
  const fromBackendFormat = (backendItems: Array<{ product_id: number; quantity: number; product: Product }>) => {
    return backendItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }))
  }

  // Sync cart to backend (debounced)
  const syncToBackend = async (immediate: boolean = false) => {
    // Only sync if authenticated
    if (!authStore.isAuthenticated) {
      return
    }

    // Clear existing timeout if debouncing
    if (syncTimeout.value) {
      clearTimeout(syncTimeout.value)
      syncTimeout.value = null
    }

    const performSync = async () => {
      if (isSyncing.value) {
        return
      }

      isSyncing.value = true
      try {
        const backendItems = toBackendFormat(items.value)
        const response = await cartService.updateCart(backendItems)

        if (response.success && response.data) {
          // Update items with backend response (in case backend modified quantities due to stock limits)
          items.value = fromBackendFormat(response.data.items)
          saveCart()
          lastSyncTime.value = Date.now()
        } else {
          console.error('❌ Failed to sync cart:', response.message, response.error)
          throw new Error(response.message || 'Failed to sync cart')
        }
      } catch (error) {
        console.error('❌ Error syncing cart to backend:', error)
        // Don't throw - we want cart to work even if sync fails
        // The cart is still saved locally
      } finally {
        isSyncing.value = false
      }
    }

    if (immediate) {
      await performSync()
    } else {
      // Debounce the sync
      syncTimeout.value = setTimeout(performSync, SYNC_DEBOUNCE_MS)
    }
  }

  // Load cart from backend
  const loadFromBackend = async () => {
    if (!authStore.isAuthenticated) {
      return
    }

    isSyncing.value = true
    try {
      const response = await cartService.fetchCart()

      if (response.success && response.data) {
        items.value = fromBackendFormat(response.data.items)
        saveCart()
        lastSyncTime.value = Date.now()
      } else {
        console.error('Failed to load cart from backend:', response.message)
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error)
    } finally {
      isSyncing.value = false
    }
  }

  // Merge frontend and backend carts (backend takes precedence for conflicts)
  const mergeCarts = async () => {
    if (!authStore.isAuthenticated) {
      return
    }

    isSyncing.value = true
    try {
      const backendResponse = await cartService.fetchCart()

      if (backendResponse.success && backendResponse.data) {
        const backendItems = fromBackendFormat(backendResponse.data.items)
        const frontendItems = items.value

        // Create a map of backend items by product_id
        const backendMap = new Map(backendItems.map((item) => [item.product.id, item]))

        // Merge: backend items take precedence, but keep frontend items not in backend
        const merged: CartItem[] = []

        // Add all backend items
        backendItems.forEach((item) => merged.push(item))

        // Add frontend items that aren't in backend
        frontendItems.forEach((item) => {
          if (!backendMap.has(item.product.id)) {
            merged.push(item)
          }
        })

        items.value = merged
        saveCart()

        // Sync merged cart back to backend
        await syncToBackend(true)
      }
    } catch (error) {
      console.error('Error merging carts:', error)
    } finally {
      isSyncing.value = false
    }
  }

  // Validate cart before checkout
  const validateCart = async () => {
    if (!authStore.isAuthenticated) {
      return { valid: false, errors: ['User not authenticated'] }
    }

    try {
      const response = await cartService.validateCart()
      return {
        valid: response.data?.valid ?? false,
        errors: response.data?.errors || [],
      }
    } catch (error) {
      console.error('Error validating cart:', error)
      return { valid: false, errors: ['Error validating cart'] }
    }
  }

  // Initialize cart from localStorage
  loadCart()

  // Watch for authentication changes to sync cart
  watch(
    () => authStore.isAuthenticated,
    async (isAuthenticated) => {
      if (isAuthenticated) {
        // When user logs in, merge frontend and backend carts
        await mergeCarts()
      } else {
        // When user logs out, clear sync timeout
        if (syncTimeout.value) {
          clearTimeout(syncTimeout.value)
          syncTimeout.value = null
        }
      }
    },
  )

  // Computed properties
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  })

  const isEmpty = computed(() => {
    return items.value.length === 0
  })

  // Methods
  const addItem = async (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find((item) => item.product.id === product.id)

    if (existingItem) {
      // If item already exists, increase quantity
      existingItem.quantity += quantity
    } else {
      // Add new item
      items.value.push({
        product,
        quantity,
      })
    }

    saveCart()

    // Sync to backend (with error handling)
    try {
      if (authStore.isAuthenticated) {
        // If authenticated, sync immediately for better UX when adding items
        await syncToBackend(true)
      }
    } catch (error) {
      console.error('❌ Error syncing cart after adding item:', error)
      // Don't throw - item is still in cart locally
    }
  }

  const removeItem = async (productId: number) => {
    const index = items.value.findIndex((item) => item.product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveCart()
      await syncToBackend()
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        await removeItem(productId)
      } else {
        item.quantity = quantity
        saveCart()
        await syncToBackend()
      }
    }
  }

  const clearCart = async () => {
    items.value = []
    saveCart()

    // Clear backend cart if authenticated
    if (authStore.isAuthenticated) {
      try {
        await cartService.clearCart()
        lastSyncTime.value = Date.now()
      } catch (error) {
        console.error('Error clearing backend cart:', error)
      }
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    isSyncing,
    lastSyncTime,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadFromBackend,
    mergeCarts,
    syncToBackend,
    validateCart,
  }
})

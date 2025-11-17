<template>
  <div
    class="group relative"
    @mouseenter="isHoveringCard = true"
    @mouseleave="isHoveringCard = false"
  >
    <!-- Favorite Button (outside router-link to prevent navigation) -->
    <div
      v-if="shouldShowFavoriteButton"
      class="absolute top-2 right-2 z-10"
      @mouseenter="isHoveringFavorite = true"
      @mouseleave="isHoveringFavorite = false"
    >
      <FavoriteButton :is-favorited="isFavorite" @click="handleFavoriteClick" />
    </div>

    <router-link :to="`/product/${product.id}`">
      <div class="border bg-gray-800 border-gray-700 rounded-lg shadow-xl">
        <!-- Imagen del producto -->
        <div
          class="transition-opacity duration-200"
          :class="{ 'opacity-75': isHoveringCard && !isHoveringFavorite }"
        >
          <ProductImage
            :image-url="product.image_url"
            :product-name="product.name"
            size="card"
          />
        </div>

        <!-- Información del producto -->
        <div class="mt-4 mx-4 mb-3">
          <div class="flex justify-between">
            <p class="truncate text-md font-medium text-white ml-0">
              {{ product.name }}
            </p>
            <p class="text-md font-medium text-white">
              {{ formatPrice(product.price) }}
            </p>
          </div>

          <!-- Rating -->
          <div v-if="product.ratingCount && product.ratingCount > 0" class="flex items-center gap-1 mt-2">
            <!-- Estrellas -->
            <template v-for="i in 5" :key="`star-${i}`">
              <StarIcon
                :class="i <= Math.floor(product.rating || 0) ? 'text-yellow-300' : 'text-gray-500'"
                size="w-3 h-3"
              />
            </template>

            <p class="text-xs font-medium leading-none text-gray-400 ml-1">
              {{ product.rating?.toFixed(1) || '0.0' }}
              <span class="text-gray-500">
                ({{ product.ratingCount === 1 ? '1' : product.ratingCount }})
              </span>
            </p>
          </div>

          <div v-else class="mt-2">
            <p class="text-xs font-medium leading-none text-gray-500">Sin reseñas</p>
          </div>
        </div>

        <!-- Información de la tienda (solo si showStore es true) -->
        <!-- <router-link v-if="showStore" :to="`/store/${product.seller_id}`">
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
        </router-link> -->
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/formatting'
import StarIcon from '@/components/icons/StarIcon.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import ProductImage from '@/components/products/ProductImage.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { favoriteService } from '@/services/favoriteService'
import { useToast } from 'vue-toastification'

// Props
interface ProductCardProps {
  product: Product
  showStore: boolean
}

const props = defineProps<ProductCardProps>()

// Emits
const emit = defineEmits<{
  favoriteToggled: [productId: number, isFavorite: boolean]
}>()

// Stores
const authStore = useAuthStore()
const userStore = useUserStore()
const toast = useToast()

// State
const isHoveringCard = ref(false)
const isHoveringFavorite = ref(false)
const isFavorite = ref(props.product.is_favorite ?? false)
const isToggling = ref(false)

// Sync local state with prop changes
watch(
  () => props.product.is_favorite,
  (newValue) => {
    isFavorite.value = newValue ?? false
  }
)

// Computed
const shouldShowFavoriteButton = computed(() => {
  if (!authStore.isAuthenticated) return false
  if (!userStore.user) return false
  return props.product.seller_id !== userStore.user.id
})

// Methods
const handleFavoriteClick = async () => {
  if (isToggling.value) return

  try {
    isToggling.value = true
    const response = await favoriteService.toggleFavorite(props.product.id)

    if (!response.success || !response.data) {
      toast.error(response.message || 'Error al actualizar favorito')
      return
    }

    isFavorite.value = response.data.is_favorite
    emit('favoriteToggled', props.product.id, response.data.is_favorite)
  } catch (error) {
    console.error('Error toggling favorite:', error)
    toast.error('Error al actualizar favorito')
  } finally {
    isToggling.value = false
  }
}

/* const getStoreDisplayName = () => {
  const store = props.product.seller.store
  const storeName = store.storeName

  if (storeName) {
    return storeName
  }

  if (props.product.seller.firstName) {
    return `Tienda de ${props.product.seller.firstName}`
  }

  return `Tienda ${store.storeId}`
} */
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>

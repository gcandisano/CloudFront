<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <section v-else-if="product" class="py-8 md:py-16 bg-gray-900 antialiased">
      <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <!-- Imagen del producto -->
          <ProductImage :image-url="product.image_url" :product-name="product.name" />

          <!-- Información del producto -->
          <div class="space-y-6">
            <ProductInfo
              :product="product"
              :is-owner="isOwner"
              :is-authenticated="authStore.isAuthenticated"
              :is-liked="isLiked"
              @toggle-favorite="toggleFavorite"
              @buy-now="buyNow"
            />

            <!-- Store Info Card -->
            <StoreInfoCard v-if="product" :product="product" />
          </div>
        </div>
      </div>
    </section>

    <!-- Error state -->
    <div v-else class="flex justify-center items-center py-20">
      <div class="text-white text-xl">Producto no encontrado</div>
    </div>

    <!-- Sección de reseñas -->
    <ProductReviews
      v-if="product"
      :reviews="reviews"
      :current-page="reviewsCurrentPage"
      :total-pages="reviewsTotalPages"
      @page-changed="handleReviewsPageChange"
    />

    <!-- Productos relacionados -->
    <RelatedProducts v-if="product" :products="relatedProducts" />

    <!-- Sale Review Modal -->
    <SaleReviewModal
      :is-open="showReviewModal"
      :products="saleProducts"
      @close="showReviewModal = false"
      @submitted="handleReviewsSubmitted"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { Product, Review } from '@/types'
import { productService } from '@/services/productService'
import { reviewService } from '@/services/reviewService'
import { favoriteService } from '@/services/favoriteService'
import { useToast } from 'vue-toastification'
import SaleReviewModal from '@/components/ui/SaleReviewModal.vue'
import ProductImage from '@/components/products/ProductImage.vue'
import ProductInfo from '@/components/products/ProductInfo.vue'
import ProductReviews from '@/components/products/ProductReviews.vue'
import RelatedProducts from '@/components/products/RelatedProducts.vue'
import StoreInfoCard from '@/components/products/StoreInfoCard.vue'
import type { SaleProduct } from '@/types'

const toast = useToast()

// Props y configuración
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

// Estado reactivo
const product = ref<Product | null>(null)
const reviews = ref<Review[]>([])
const relatedProducts = ref<Product[]>([])
const isLiked = ref(false)
const loading = ref(true)
const showReviewModal = ref(false)
const saleProducts = ref<SaleProduct[]>([])
const isTogglingFavorite = ref(false)
const reviewsCurrentPage = ref(1)
const reviewsTotalPages = ref(0)
const reviewsLimit = ref(10)

// Computed properties
const isOwner = computed(() => {
  if (!product.value || !userStore.user) return false
  return product.value.seller_id === userStore.user.id
})

// Lifecycle
onMounted(async () => {
  // Initialize user data if authenticated
  if (authStore.isAuthenticated) {
    await userStore.initializeUser()
  }
  await loadProduct()
  if (product.value) {
    await loadReviews()
    await loadRelatedProducts()
  }
})

// Métodos
const loadProduct = async () => {
  try {
    const response = await productService.fetchProduct(route.params.id as string)

    if (!response.success) {
      toast.error(response.message || 'Error al cargar el producto')
      return
    }

    product.value = response.data
    // Initialize isLiked from product data
    if (product.value) {
      isLiked.value = product.value.is_favorite ?? false
    }
  } catch (error) {
    console.error('Error cargando producto:', error)
  } finally {
    loading.value = false
  }
}

const loadReviews = async (page: number = reviewsCurrentPage.value) => {
  try {
    if (!product.value) return

    const response = await reviewService.fetchProductReviews({
      product_id: product.value.id,
      page: page.toString(),
      limit: reviewsLimit.value.toString(),
    })

    if (!response.success || !response.data) {
      toast.error(response.message || 'Error al cargar las reseñas')
      return
    }

    reviews.value = response.data.reviews
    reviewsCurrentPage.value = response.data.pagination.page
    reviewsTotalPages.value = response.data.pagination.totalPages
  } catch (error) {
    console.error('Error cargando reseñas:', error)
    toast.error('Error al cargar las reseñas')
  }
}

const handleReviewsPageChange = async (page: number) => {
  reviewsCurrentPage.value = page
  await loadReviews(page)
  // Scroll to reviews section
  const reviewsSection = document.getElementById('reviews')
  if (reviewsSection) {
    reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const loadRelatedProducts = async () => {
  try {
    // TODO: Descomentar cuando tengas la API lista
    // relatedProducts.value = await productStore.fetchRelatedProducts(route.params.id as string)

    // Datos hardcodeados de productos relacionados
    relatedProducts.value = [
      {
        id: 2,
        name: 'MacBook Air M2',
        price: 1199.99,
        image_url:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        seller_id: 1,
        category: 'Electronics',
        rating: 0,
        ratingCount: 0,
        paused: false,
        store_id: 1,
        store_name: 'TechStore',
        store_image_url:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      },
      {
        id: 3,
        name: 'AirPods Pro',
        price: 249.99,
        image_url:
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
        seller_id: 2,
        category: 'Electronics',
        rating: 0,
        ratingCount: 0,
        paused: false,
        store_id: 2,
        store_name: 'AudioWorld',
        store_image_url:
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
      },
      {
        id: 4,
        name: 'iPad Air',
        price: 599.99,
        image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        seller_id: 3,
        category: 'Electronics',
        rating: 0,
        ratingCount: 0,
        paused: false,
        store_id: 3,
        store_name: 'GadgetZone',
        store_image_url:
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
      },
    ]
  } catch (error) {
    console.error('Error cargando productos relacionados:', error)
  }
}

const toggleFavorite = async () => {
  if (!product.value || isTogglingFavorite.value) return

  try {
    isTogglingFavorite.value = true
    const response = await favoriteService.toggleFavorite(product.value.id)

    if (!response.success || !response.data) {
      toast.error(response.message || 'Error al actualizar favorito')
      return
    }

    isLiked.value = response.data.is_favorite
    if (product.value) {
      product.value.is_favorite = response.data.is_favorite
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    toast.error('Error al actualizar favorito')
  } finally {
    isTogglingFavorite.value = false
  }
}

const buyNow = async () => {
  try {
    if (!product.value) {
      toast.error('No se pudo cargar la información del producto')
      return
    }

    if (!authStore.isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar una compra')
      router.push('/login')
      return
    }

    // Add product to cart
    await cartStore.addItem(product.value, 1)
    toast.success('Producto agregado al carrito')

    // Navigate to cart
    router.push('/cart')
  } catch (error) {
    console.error('Error agregando producto al carrito:', error)
    toast.error('Error al agregar producto al carrito')
  }
}

const handleReviewsSubmitted = async () => {
  reviewsCurrentPage.value = 1
  await loadReviews(1)
  showReviewModal.value = false
}
</script>

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
          <div
            class="relative transition-transform duration-300 rounded-lg transform hover:scale-103"
          >
            <img
              v-if="product.image_url && product.image_url.startsWith('http')"
              :src="product.image_url"
              :alt="product.name"
              class="w-4/5 mx-auto rounded-lg shadow-xxl shadow-gray-200"
            />
            <img
              v-else-if="product.image_url"
              :src="`${apiBaseUrl}/image/${product.image_url}`"
              :alt="product.name"
              class="w-4/5 mx-auto rounded-lg shadow-xxl shadow-gray-200"
            />
            <img
              v-else
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
              :alt="product.name"
              class="rounded-lg shadow-xxl shadow-gray-200"
            />
          </div>

          <!-- Información del producto -->
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
                    <svg
                      :class="[
                        'w-4 h-4',
                        i <= Math.floor(product.rating || 0) ? 'text-yellow-300' : 'text-gray-500',
                      ]"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                      ></path>
                    </svg>
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
              v-if="!isOwner && !product.paused"
              class="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:mt-8"
            >
              <!-- Botón de favoritos -->
              <button
                v-if="!isLiked"
                @click="toggleFavorite"
                class="w-full sm:w-auto flex items-center justify-center py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
              >
                <svg
                  class="w-5 h-5 -ms-2 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                  ></path>
                </svg>
                Agregar a favoritos
              </button>

              <button
                v-else
                @click="toggleFavorite"
                class="w-full sm:w-auto flex items-center justify-center py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
              >
                <svg
                  class="w-5 h-5 -ms-2 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="pink"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                  ></path>
                </svg>
                Quitar de favoritos
              </button>

              <!-- Botón de agregar al carrito -->
              <button
                @click="addToCart"
                class="w-full sm:w-auto text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 -ms-2 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                  ></path>
                </svg>
                Agregar al carrito
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

            <!-- Botón de la tienda -->
            <!-- <router-link :to="`/store/${product.seller_id}`">
              <button
                class="text-white mx-auto my-4 w-full inline-flex items-center bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
              >
                <span class="h-20 w-20 rounded-full overflow-hidden p-2 mr-3">
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
                </span>
                <span class="mx-2 pr-4 text-md">
                  {{ getStoreDisplayName() }}
                </span>
              </button>
            </router-link> -->
          </div>
        </div>
      </div>
    </section>

    <!-- Error state -->
    <div v-else class="flex justify-center items-center py-20">
      <div class="text-white text-xl">Producto no encontrado</div>
    </div>

    <!-- Sección de reseñas -->
    <section
      v-if="product && reviews.length > 0"
      id="reviews"
      class="py-8 antialiased bg-gray-900 mx-auto px-4 my-6 mt-10 max-w-screen-2xl"
    >
      <div class="mx-auto max-w-screen-xl px-4 2xl">
        <h1 class="text-3xl font-bold tracking-tight text-white mr-2">Reseñas</h1>

        <div class="mb-6 divide-y divide-gray-700">
          <div v-for="review in reviews" :key="review.id" class="gap-3 py-6 sm:flex sm:items-start">
            <div class="shrink-0 space-y-2 sm:w-48 md:w-72">
              <div class="flex items-center gap-0.5">
                <!-- Estrellas -->
                <template v-for="i in 5" :key="`review-star-${i}`">
                  <svg
                    :class="[
                      'h-4 w-4',
                      i <= Math.floor(review.rating) ? 'text-yellow-300' : 'text-gray-500',
                    ]"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                    ></path>
                  </svg>
                </template>
              </div>

              <div class="space-y-0.5">
                <p class="text-base font-semibold text-white">
                  {{ review.user.firstName }} {{ review.user.lastName }}
                </p>
                <p class="text-sm font-normal text-gray-400">{{ review.timestamp }}</p>
              </div>
            </div>

            <div class="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
              <p class="text-base font-normal text-gray-400">{{ review.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Productos relacionados -->
    <div
      v-if="product && relatedProducts.length > 0"
      class="mx-auto px-4 my-6 mt-10 max-w-screen-2xl"
    >
      <span class="m-4 mt-8 self-center text-2xl font-semibold whitespace-nowrap text-white">
        También te puede gustar
      </span>
      <div class="mx-4 border-t border-gray-700 pt-6 mt-3 my-2 p-2">
        <div
          class="overflow-x-scroll scrollbar-hide mb-4 relative px-0.5"
          style="overflow-y: hidden"
        >
          <div class="slider scrollbar-hide gap-4">
            <div
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              class="group relative w-80"
            >
              <router-link :to="`/product/${relatedProduct.id}`">
                <div class="border bg-gray-800 border-gray-700 rounded-lg shadow-xl">
                  <div
                    class="aspect-h-1 h-96 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
                  >
                    <img
                      v-if="relatedProduct.image_url && relatedProduct.image_url.startsWith('http')"
                      :src="relatedProduct.image_url"
                      :alt="relatedProduct.name"
                      class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                    <img
                      v-else-if="relatedProduct.image_url"
                      :src="`${apiBaseUrl}/image/${relatedProduct.image_url}`"
                      :alt="relatedProduct.name"
                      class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                    <img
                      v-else
                      src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
                      :alt="relatedProduct.name"
                      class="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div class="mt-4 mx-4 mb-3 flex justify-between max-w-xs">
                    <p class="truncate text-md font-medium text-white ml-0">
                      {{ relatedProduct.name }}
                    </p>
                    <p class="text-md font-medium text-white">
                      {{ formatPrice(relatedProduct.price) }}
                    </p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { Product, Review } from '@/types'
import { formatPrice } from '@/utils/formatting'
import { productService } from '@/services/productService'
import { useToast } from 'vue-toastification'

const toast = useToast()

// Props y configuración
const route = useRoute()
const userStore = useUserStore()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Estado reactivo
const product = ref<Product | null>(null)
const reviews = ref<Review[]>([])
const relatedProducts = ref<Product[]>([])
const isLiked = ref(false)
const loading = ref(false)

// Computed properties
const isOwner = computed(() => {
  if (!product.value || !userStore.user) return false
  return product.value.seller_sub === userStore.user.sub
})

// Lifecycle
onMounted(async () => {
  await loadProduct()
  if (product.value) {
    await Promise.all([loadReviews(), loadRelatedProducts()])
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
  } catch (error) {
    console.error('Error cargando producto:', error)
  } finally {
    loading.value = false
  }
}

const loadReviews = async () => {
  try {
    // TODO: Descomentar cuando tengas la API lista
    // reviews.value = await reviewStore.fetchProductReviews(route.params.id as string)

    // Datos hardcodeados de reseñas
    reviews.value = [
      {
        id: '1',
        rating: 5,
        description:
          'Excelente producto, muy buena calidad. La entrega fue rápida y el vendedor muy profesional.',
        timestamp: '2024-01-15',
        user: {
          id: 'user1',
          firstName: 'María',
          lastName: 'García',
        },
      },
      {
        id: '2',
        rating: 4,
        description:
          'Muy buen teléfono, la cámara es increíble. Solo le doy 4 estrellas porque la batería podría durar un poco más.',
        timestamp: '2024-01-10',
        user: {
          id: 'user2',
          firstName: 'Carlos',
          lastName: 'López',
        },
      },
      {
        id: '3',
        rating: 5,
        description:
          'Perfecto en todos los aspectos. Super rápido, excelente cámara y muy buena duración de batería.',
        timestamp: '2024-01-05',
        user: {
          id: 'user3',
          firstName: 'Ana',
          lastName: 'Martínez',
        },
      },
    ]
  } catch (error) {
    console.error('Error cargando reseñas:', error)
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
        seller_sub: '1',
        category: 'Electronics',
        rating: 0,
        ratingCount: 0,
        paused: false,
        /* seller: {
          firstName: 'Juan',
          store: {
            storeId: 'store1',
            storeName: 'TechStore',
            storeImageId: null,
          },
        }, */
      },
      {
        id: 3,
        name: 'AirPods Pro',
        price: 249.99,
        image_url:
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
        seller_sub: '2',
        category: 'Electronics',
        rating: 0,
        ratingCount: 0,
        paused: false,
        /* seller: {
          firstName: 'María',
          store: {
            storeId: 'store2',
            storeName: 'AudioWorld',
            storeImageId: null,
          },
        }, */
      },
      {
        id: 4,
        name: 'iPad Air',
        price: 599.99,
        image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        seller_sub: '3',
        category: 'Electronics',
        rating: 0,
        ratingCount: 0,
        paused: false,
      },
    ]
  } catch (error) {
    console.error('Error cargando productos relacionados:', error)
  }
}

const toggleFavorite = async () => {
  try {
    // TODO: Implementar cuando tengas la API lista
    // await productStore.toggleLike(product.value!.id)
    isLiked.value = !isLiked.value
    console.log('Favorito toggled:', isLiked.value)
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

const addToCart = async () => {
  try {
    // TODO: Implementar cuando tengas la API lista
    // await cartStore.addToCart(product.value!.id)
    console.log('Producto agregado al carrito:', product.value!.id)
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

/* const getStoreDisplayName = () => {
  if (!product.value) return ''

  const store = product.value.seller.store
  const storeName = store.storeName

  if (storeName) {
    return storeName
  }

  if (product.value.seller.firstName) {
    return `Tienda de ${product.value.seller.firstName}`
  }

  return `Tienda ${store.storeId}`
} */
</script>

<style scoped>
/* Estilos específicos de la vista si son necesarios */
.shadow-xxl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.slider {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.slider > div {
  flex-shrink: 0;
}
</style>

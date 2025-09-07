<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header de tienda (cuando se está viendo una tienda específica) -->
    <StoreHeader v-if="store" :store="store" :current-user="currentUser" />

    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <!-- Formulario de búsqueda y filtros -->
      <SearchFilters
        :categories="categories"
        :current-filters="filters"
        :is-authenticated="isAuthenticated"
        :has-store="!!store"
        @filters-changed="handleFiltersChange"
      />

      <!-- Grid de productos -->
      <section
        class="mt-6 py-10 grid grid-cols-1 gap-x-6 gap-y-10 md:gap-y-20 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 xl:gap-y-10"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :show-store="!store"
        />
      </section>

      <!-- Paginación -->
      <Pagination
        v-if="products.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />

      <!-- Mensaje cuando no hay productos -->
      <div v-if="products.length === 0" class="text-center text-white w-full">
        <h2 class="text-2xl font-bold">No se encontraron productos</h2>
      </div>
    </main>

    <!-- Notificaciones -->
    <NotificationToast
      v-if="notification"
      :notification="notification"
      @close="clearNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StoreHeader from '@/components/StoreHeader.vue'
import SearchFilters from '@/components/SearchFilters.vue'
import ProductCard from '@/components/ProductCard.vue'
import Pagination from '@/components/Pagination.vue'
import NotificationToast from '@/components/NotificationToast.vue'
import { useProductStore } from '@/stores/product'
import { useAuthStore } from '@/stores/auth'
import type { Product, Store, User, Notification } from '@/types'

// Stores
const productStore = useProductStore()
const authStore = useAuthStore()

// Router
const route = useRoute()
const router = useRouter()

// Estado reactivo
const products = ref<Product[]>([])
const store = ref<Store | null>(null)
const categories = ref<string[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const notification = ref<Notification | null>(null)
const loading = ref(false)

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)

// Filtros actuales
const filters = computed(() => ({
  search: (route.query.search as string) || '',
  category: (route.query.category as string) || '',
  sort: (route.query.sort as string) || 'rating desc',
  liked: route.query.liked === 'true',
  page: parseInt(route.query.page as string) || 1,
}))

// Métodos
const loadProducts = async () => {
  try {
    loading.value = true

    // DATOS HARDCODEADOS PARA DEMOSTRACIÓN
    // TODO: Descomentar cuando tengas la API lista
    /*
    const response = await productStore.fetchProducts({
      ...filters.value,
      storeId: route.params.storeId as string,
    })

    products.value = response.products
    totalPages.value = response.totalPages
    currentPage.value = response.currentPage
    */

    // Datos de ejemplo
    products.value = [
      {
        id: '1',
        name: 'iPhone 15 Pro Max',
        price: 1299.99,
        imageId:
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        sellerId: 'store1',
        category: 'Electronics',
        rating: 4.5,
        ratingCount: 127,
        paused: false,
        seller: {
          firstName: 'Juan',
          store: {
            storeId: 'store1',
            storeName: 'TechStore',
            storeImageId: null,
          },
        },
      },
      {
        id: '2',
        name: 'MacBook Air M2',
        price: 1199.99,
        imageId:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        sellerId: 'store1',
        seller: {
          firstName: 'Juan',
          store: {
            storeId: 'store1',
            storeName: 'TechStore',
            storeImageId: null,
          },
        },
      },
      {
        id: '3',
        name: 'AirPods Pro',
        price: 249.99,
        imageId:
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
        sellerId: 'store2',
        seller: {
          firstName: 'María',
          store: {
            storeId: 'store2',
            storeName: 'AudioWorld',
            storeImageId: null,
          },
        },
      },
      {
        id: '4',
        name: 'iPad Air',
        price: 599.99,
        imageId: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        sellerId: 'store1',
        seller: {
          firstName: 'Juan',
          store: {
            storeId: 'store1',
            storeName: 'TechStore',
            storeImageId: null,
          },
        },
      },
      {
        id: '5',
        name: 'Samsung Galaxy S24',
        price: 999.99,
        imageId:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        sellerId: 'store3',
        seller: {
          firstName: 'Carlos',
          store: {
            storeId: 'store3',
            storeName: 'MobileHub',
            storeImageId: null,
          },
        },
      },
      {
        id: '6',
        name: 'Sony WH-1000XM5',
        price: 349.99,
        imageId:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        sellerId: 'store2',
        seller: {
          firstName: 'María',
          store: {
            storeId: 'store2',
            storeName: 'AudioWorld',
            storeImageId: null,
          },
        },
      },
      {
        id: '7',
        name: 'Nike Air Max 270',
        price: 129.99,
        imageId: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        sellerId: 'store4',
        seller: {
          firstName: 'Ana',
          store: {
            storeId: 'store4',
            storeName: 'SportStyle',
            storeImageId: null,
          },
        },
      },
      {
        id: '8',
        name: 'Adidas Ultraboost 22',
        price: 179.99,
        imageId:
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
        sellerId: 'store4',
        seller: {
          firstName: 'Ana',
          store: {
            storeId: 'store4',
            storeName: 'SportStyle',
            storeImageId: null,
          },
        },
      },
    ]

    totalPages.value = 1
    currentPage.value = 1
  } catch (error) {
    console.error('Error cargando productos:', error)
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'No se pudieron cargar los productos',
    })
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    // TODO: Descomentar cuando tengas la API lista
    // categories.value = await productStore.fetchCategories()

    // Categorías de ejemplo
    categories.value = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

const loadStore = async () => {
  if (route.params.storeId) {
    try {
      // TODO: Descomentar cuando tengas la API lista
      // store.value = await productStore.fetchStore(route.params.storeId as string)

      // Datos de tienda de ejemplo
      store.value = {
        storeId: route.params.storeId as string,
        storeName: 'TechStore',
        description:
          'Tu tienda de confianza para productos tecnológicos de última generación. Ofrecemos la mejor calidad y los precios más competitivos del mercado.',
        coverImageId: null,
        storeImageId: null,
        user: {
          id: 'user1',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@techstore.com',
        },
      }
    } catch (error) {
      console.error('Error cargando tienda:', error)
    }
  }
}

const handleFiltersChange = (newFilters: any) => {
  const query = { ...route.query, ...newFilters }

  // Remover parámetros vacíos
  Object.keys(query).forEach((key) => {
    if (!query[key] || query[key] === '') {
      delete query[key]
    }
  })

  router.push({ query })
}

const handlePageChange = (page: number) => {
  handleFiltersChange({ page })
}

const showNotification = (notif: Notification) => {
  notification.value = notif
}

const clearNotification = () => {
  notification.value = null
}

// Verificar notificaciones de la URL
const checkUrlNotifications = () => {
  const status = route.query.status as string
  if (status) {
    const notifications: Record<string, Notification> = {
      success: {
        type: 'success',
        title: 'Compra exitosa',
        message: 'Tu compra se ha realizado correctamente',
      },
      passwordchanged: {
        type: 'success',
        title: 'Correo enviado',
        message: 'Se ha enviado un correo con las instrucciones',
      },
      registered: {
        type: 'success',
        title: 'Registro exitoso',
        message: 'Revisa tu correo para confirmar tu cuenta',
      },
      invalidtoken: {
        type: 'error',
        title: 'Token inválido',
        message: 'El token de verificación no es válido',
      },
      confirmed: {
        type: 'success',
        title: 'Cuenta confirmada',
        message: 'Tu cuenta ha sido confirmada exitosamente',
      },
    }

    if (notifications[status]) {
      showNotification(notifications[status])
      // Limpiar el parámetro de la URL
      const query = { ...route.query }
      delete query.status
      router.replace({ query })
    }
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadCategories(), loadStore(), loadProducts()])
  checkUrlNotifications()
})

// Watchers
watch(
  () => route.query,
  () => {
    loadProducts()
  },
  { deep: true },
)

watch(
  () => route.params.storeId,
  () => {
    loadStore()
    loadProducts()
  },
)
</script>

<style scoped>
/* Estilos específicos de la vista si son necesarios */
</style>

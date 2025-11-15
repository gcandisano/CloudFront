<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header de tienda (cuando se está viendo una tienda específica) -->
    <StoreHeader v-if="store" :store="store" :current-user="currentUser" />

    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <!-- Formulario de búsqueda y filtros -->
      <SearchFilters :current-filters="filters" :is-authenticated="isAuthenticated"
        :has-store="!!store" @filters-changed="handleFiltersChange" />

      <!-- Grid de productos -->
      <section
        class="mt-6 py-10 grid grid-cols-1 gap-x-6 gap-y-10 md:gap-y-20 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 xl:gap-y-10">
        <ProductCard v-for="product in products" :key="product.id" :product="product" :show-store="!!store" />
      </section>

      <!-- Paginación -->
      <Pagination v-if="products.length > 0" :current-page="currentPage" :total-pages="totalPages"
        @page-changed="handlePageChange" />

      <!-- Mensaje cuando no hay productos -->
      <div v-if="products.length === 0" class="text-center text-white w-full">
        <h2 class="text-2xl font-bold">No se encontraron productos</h2>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StoreHeader from '@/components/StoreHeader.vue'
import SearchFilters from '@/components/SearchFilters.vue'
import ProductCard from '@/components/ProductCard.vue'
import Pagination from '@/components/Pagination.vue'
import { useAuthStore } from '@/stores/auth'
import { productService } from '@/services/productService'
import type { Product, Store, ProductFilters } from '@/types'
import { useToast } from "vue-toastification";
import { useUserStore } from '@/stores/user'

// Composables
const toast = useToast()

// Stores
const authStore = useAuthStore()
const userStore = useUserStore()

// Router
const route = useRoute()
const router = useRouter()

// Estado reactivo
const products = ref<Product[]>([])
const store = ref<Store | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const filters = ref<ProductFilters>({
  search: (route.query.search as string) || '',
  category: (route.query.category as string) || '',
  sort: (route.query.sort as string) || 'rating desc',
  page: parseInt(route.query.page as string) || 1,
})

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => userStore.user)


onMounted(async () => {
  await loadProducts()
})

// Métodos
const loadProducts = async () => {

  loading.value = true

  try {
    const productFilters: ProductFilters = {
      page: filters.value.page,
      sort: filters.value.sort || undefined,
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
    }

    const response = await productService.fetchProducts(productFilters)

    if (!response.success) {
      toast.error(response.message || 'Error al cargar los productos')
      return
    }

    products.value = response.data?.products || []
    totalPages.value = response.data?.pagination.totalPages || 1
    currentPage.value = response.data?.pagination.page || 1

  } catch (error) {
    toast.error('Error al cargar los productos')
    console.error('Error cargando productos:', error)
  } finally {
    loading.value = false
  }
}

const handleFiltersChange = (newFilters: ProductFilters) => {
  filters.value = newFilters

  // Update URL with query parameters
  const query: Record<string, string> = {}
  Object.entries(newFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = typeof value === 'boolean' ? value.toString() : String(value)
    }
  })

  router.push({ query })
  loadProducts()
}

const handlePageChange = (page: number) => {
  handleFiltersChange({ ...filters.value, page })
}
</script>

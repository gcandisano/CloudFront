<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Loading state -->
    <div v-if="loadingStore" class="text-center py-20">
      <p class="text-xl text-gray-400">Cargando tienda...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="storeError" class="bg-red-900/20 border border-red-500 rounded-lg p-4 m-6">
      <p class="text-red-400">{{ storeError }}</p>
    </div>

    <!-- Store content -->
    <div v-else-if="store">
      <!-- Store Header -->
      <StoreHeader :store="store" :current-user="userStore.user" @edit="showEditModal = true" />

      <!-- Search Filters -->
      <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 mb-6">
        <SearchFilters
          :current-filters="currentFilters"
          :is-authenticated="authStore.isAuthenticated"
          :has-store="false"
          @filters-changed="handleFiltersChanged"
        />
      </div>

      <!-- Products Section -->
      <main class="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <!-- Loading products -->
        <div v-if="loadingProducts" class="text-center py-20">
          <p class="text-xl text-gray-400">Cargando productos...</p>
        </div>

        <!-- Error loading products -->
        <div
          v-else-if="productsError"
          class="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6"
        >
          <p class="text-red-400">{{ productsError }}</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="products && products.length > 0" class="space-y-6">
          <section
            class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @favorite-toggled="handleFavoriteToggled"
            />
          </section>

          <!-- Pagination -->
          <Pagination
            v-if="pagination && pagination.totalPages > 1"
            :current-page="pagination.page"
            :total-pages="pagination.totalPages"
            @page-changed="handlePageChange"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20">
          <p class="text-xl text-gray-400">No se encontraron productos</p>
        </div>
      </main>

      <!-- Edit Store Modal -->
      <EditStoreModal
        v-if="store"
        :is-open="showEditModal"
        :store="store"
        @close="showEditModal = false"
        @updated="handleStoreUpdated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeService } from '@/services/storeService'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import type { StoreResponse, Product, PaginationResponse, ProductFilters } from '@/types'
import StoreHeader from '@/components/ui/StoreHeader.vue'
import EditStoreModal from '@/components/ui/EditStoreModal.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SearchFilters from '@/components/ui/SearchFilters.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

// Store state
const loadingStore = ref(false)
const storeError = ref<string | null>(null)
const store = ref<StoreResponse | null>(null)

// Products state
const loadingProducts = ref(false)
const productsError = ref<string | null>(null)
const products = ref<Product[]>([])
const pagination = ref<PaginationResponse | null>(null)

// Edit modal state
const showEditModal = ref(false)

// Filters
const currentFilters = ref<ProductFilters>({
  page: 1,
  limit: 20,
})

// Computed
const storeId = computed(() => route.params.id as string)

// Initialize from query params
onMounted(() => {
  const pageParam = route.query.page as string | undefined
  const limitParam = route.query.limit as string | undefined
  const categoryParam = route.query.category as string | undefined
  const searchParam = route.query.search as string | undefined
  const likedParam = route.query.liked as string | undefined

  currentFilters.value = {
    page: pageParam ? Math.max(1, parseInt(pageParam) || 1) : 1,
    limit: limitParam ? Math.max(1, parseInt(limitParam) || 20) : 20,
    category: categoryParam || undefined,
    search: searchParam || undefined,
    liked: likedParam === 'true' || undefined,
  }

  fetchStore()
  fetchProducts()
})

// Watch for route changes
watch(
  () => route.params.id,
  () => {
    fetchStore()
    fetchProducts()
  },
)

watch(
  () => route.query,
  () => {
    const pageParam = route.query.page as string | undefined
    const limitParam = route.query.limit as string | undefined
    const categoryParam = route.query.category as string | undefined
    const searchParam = route.query.search as string | undefined
    const likedParam = route.query.liked as string | undefined

    currentFilters.value = {
      page: pageParam ? Math.max(1, parseInt(pageParam) || 1) : 1,
      limit: limitParam ? Math.max(1, parseInt(limitParam) || 20) : 20,
      category: categoryParam || undefined,
      search: searchParam || undefined,
      liked: likedParam === 'true' || undefined,
    }

    fetchProducts()
  },
  { deep: true },
)

// Methods
const fetchStore = async () => {
  loadingStore.value = true
  storeError.value = null

  try {
    const response = await storeService.fetchSingleStore(storeId.value)

    if (response.success && response.data) {
      store.value = response.data
    } else {
      storeError.value = response.message || 'Error al cargar la tienda'
      store.value = null
    }
  } catch (err) {
    console.error('Error fetching store:', err)
    storeError.value = 'Error inesperado al cargar la tienda'
    store.value = null
  } finally {
    loadingStore.value = false
  }
}

const fetchProducts = async () => {
  loadingProducts.value = true
  productsError.value = null

  try {
    const response = await storeService.fetchStoreProducts(storeId.value, currentFilters.value)

    if (response.success && response.data) {
      products.value = response.data.products
      pagination.value = response.data.pagination
    } else {
      productsError.value = response.message || 'Error al cargar los productos'
      products.value = []
      pagination.value = null
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    productsError.value = 'Error inesperado al cargar los productos'
    products.value = []
    pagination.value = null
  } finally {
    loadingProducts.value = false
  }
}

const handleFiltersChanged = (filters: ProductFilters) => {
  currentFilters.value = { ...filters }
  updateQueryParams(filters)
}

const handlePageChange = (page: number) => {
  const newFilters = { ...currentFilters.value, page }
  currentFilters.value = newFilters
  updateQueryParams(newFilters)
}

const handleFavoriteToggled = (productId: number, isFavorite: boolean) => {
  const product = products.value.find((p) => p.id === productId)
  if (product) {
    product.is_favorite = isFavorite
  }
}

const handleStoreUpdated = (updatedStore: StoreResponse) => {
  store.value = updatedStore
  showEditModal.value = false
}

const updateQueryParams = (filters: ProductFilters) => {
  const query: Record<string, string> = {}

  if (filters.page && filters.page > 1) {
    query.page = filters.page.toString()
  }

  if (filters.limit && filters.limit !== 20) {
    query.limit = filters.limit.toString()
  }

  if (filters.category) {
    query.category = filters.category
  }

  if (filters.search) {
    query.search = filters.search
  }

  if (filters.liked) {
    query.liked = 'true'
  }

  router.push({
    path: route.path,
    query,
  })
}
</script>

<style scoped>
/* Additional styles if needed */
</style>

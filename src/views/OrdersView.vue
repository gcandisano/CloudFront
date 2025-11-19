<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-white mb-8">Mis Compras</h1>

      <!-- Filters -->
      <div
        class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between"
      >
        <div class="w-full sm:w-auto">
          <label for="status-filter" class="block text-sm font-medium text-gray-300 mb-2">
            Filtrar por estado
          </label>
          <select
            id="status-filter"
            v-model="selectedStatus"
            @change="handleStatusChange"
            class="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
            <option value="shipped">Enviado</option>
          </select>
        </div>
        <div class="w-full sm:w-auto">
          <label for="limit-filter" class="block text-sm font-medium text-gray-300 mb-2">
            Por página
          </label>
          <select
            id="limit-filter"
            v-model="limit"
            @change="handleLimitChange"
            class="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
        <p class="text-red-400">{{ error }}</p>
      </div>

      <!-- Orders List -->
      <div v-else-if="sales && sales.length > 0" class="space-y-6">
        <div v-for="order in sales" :key="order.id">
          <OrderCard :order="order" />
          <div class="mt-2 ml-4 flex flex-wrap gap-2">
            <template v-for="product in order.products" :key="product.product_id">
              <button
                v-if="!product.hasReviewed"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                @click="openReviewModal(product)"
              >
                Reseñar producto
              </button>
            </template>
          </div>
        </div>
        <!-- Pagination -->
        <Pagination
          v-if="pagination && pagination.totalPages > 1"
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          @page-changed="handlePageChange"
        />
        <SaleReviewModal
          :is-open="showReviewModal"
          :products="reviewProducts"
          @close="closeReviewModal"
          @submitted="closeReviewModal"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <p class="text-xl text-gray-400">No se encontraron compras</p>
        <p class="text-sm text-gray-500 mt-2">
          {{
            selectedStatus
              ? 'Intenta cambiar el filtro de estado'
              : 'Aún no has realizado ninguna compra'
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { saleService } from '@/services/saleService'
import type { SaleWithProducts, PaginationResponse, SaleProduct } from '@/types'
import OrderCard from '@/components/orders/OrderCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SaleReviewModal from '@/components/ui/SaleReviewModal.vue'
const showReviewModal = ref(false)
const reviewProducts = ref<SaleProduct[]>([])
const openReviewModal = (product: SaleProduct) => {
  reviewProducts.value = [product]
  showReviewModal.value = true
}
const closeReviewModal = () => {
  showReviewModal.value = false
  reviewProducts.value = []
}

const route = useRoute()
const router = useRouter()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const sales = ref<SaleWithProducts[]>([])
const pagination = ref<PaginationResponse | null>(null)
const selectedStatus = ref<string>('')
const limit = ref<number>(10)

// Initialize from query params
onMounted(() => {
  const statusParam = route.query.status as string | undefined
  const limitParam = route.query.limit as string | undefined

  if (statusParam) {
    selectedStatus.value = statusParam
  }
  if (limitParam) {
    const limitNum = parseInt(limitParam, 10)
    if (!isNaN(limitNum) && limitNum > 0) {
      limit.value = limitNum
    }
  }

  fetchSales()
})

// Watch for route query changes
watch(
  () => route.query,
  () => {
    const statusParam = route.query.status as string | undefined
    const limitParam = route.query.limit as string | undefined

    // Update status - if not in query, reset to empty string (all status)
    if (statusParam !== undefined) {
      selectedStatus.value = statusParam || ''
    } else {
      selectedStatus.value = ''
    }

    if (limitParam !== undefined) {
      const limitNum = parseInt(limitParam, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        limit.value = limitNum
      }
    }

    fetchSales()
  },
  { deep: true },
)

// Methods
const fetchSales = async () => {
  loading.value = true
  error.value = null

  try {
    const page = route.query.page ? Math.max(1, parseInt(String(route.query.page)) || 1) : 1

    const response = await saleService.fetchSales({
      page,
      limit: limit.value,
      status: selectedStatus.value || undefined, // Empty string becomes undefined, which service handles correctly
    })

    if (response.success && response.data) {
      sales.value = response.data.sales
      pagination.value = response.data.pagination
    } else {
      error.value = response.message || 'Error al cargar las compras'
      sales.value = []
      pagination.value = null
    }
  } catch (err) {
    console.error('Error fetching sales:', err)
    error.value = 'Error inesperado al cargar las compras'
    sales.value = []
    pagination.value = null
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  // Pass the value directly - empty string will remove the filter
  updateQueryParams({ status: selectedStatus.value, page: 1 })
}

const handleLimitChange = () => {
  updateQueryParams({ limit: limit.value, page: 1 })
}

const handlePageChange = (page: number) => {
  updateQueryParams({ page: page.toString() })
}

const updateQueryParams = (params: {
  status?: string | undefined
  page?: string | number | undefined
  limit?: number | undefined
}) => {
  // Start with current query params to preserve existing ones
  const query: Record<string, string> = { ...route.query } as Record<string, string>

  // Update or remove status
  if (params.status !== undefined) {
    if (params.status === '') {
      delete query.status
    } else {
      query.status = params.status
    }
  }

  // Update or remove page
  if (params.page !== undefined) {
    if (params.page === null || params.page === '') {
      delete query.page
    } else {
      query.page = String(params.page)
    }
  }

  // Update or remove limit
  if (params.limit !== undefined) {
    query.limit = String(params.limit)
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

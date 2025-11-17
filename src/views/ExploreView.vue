<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-20">
        <p class="text-xl text-gray-400">Cargando tiendas...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
        <p class="text-red-400">{{ error }}</p>
      </div>

      <!-- Stores Grid -->
      <div v-else-if="stores && stores.length > 0" class="space-y-6">
        <section
          class="grid grid-cols-1 gap-x-6 gap-y-10 md:gap-y-20 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 xl:gap-y-10"
        >
          <StoreCard
            v-for="store in stores"
            :key="store.store_id"
            :store="store"
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
        <p class="text-xl text-gray-400">No se encontraron tiendas</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeService } from '@/services/storeService'
import type { StoreResponse, PaginationResponse } from '@/types'
import StoreCard from '@/components/stores/StoreCard.vue'
import Pagination from '@/components/ui/Pagination.vue'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const stores = ref<StoreResponse[]>([])
const pagination = ref<PaginationResponse | null>(null)
const limit = ref<number>(12)

// Initialize from query params
onMounted(() => {
  const limitParam = route.query.limit as string | undefined

  if (limitParam) {
    const limitNum = parseInt(limitParam, 10)
    if (!isNaN(limitNum) && limitNum > 0) {
      limit.value = limitNum
    }
  }

  fetchStores()
})

// Watch for route query changes
watch(
  () => route.query,
  () => {
    const limitParam = route.query.limit as string | undefined

    if (limitParam !== undefined) {
      const limitNum = parseInt(limitParam, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        limit.value = limitNum
      }
    }

    fetchStores()
  },
  { deep: true }
)

// Methods
const fetchStores = async () => {
  loading.value = true
  error.value = null

  try {
    const page = route.query.page
      ? Math.max(1, parseInt(String(route.query.page)) || 1)
      : 1

    const response = await storeService.fetchStores({
      page,
      limit: limit.value,
    })

    if (response.success && response.data) {
      stores.value = response.data.stores
      pagination.value = response.data.pagination
    } else {
      error.value = response.message || 'Error al cargar las tiendas'
      stores.value = []
      pagination.value = null
    }
  } catch (err) {
    console.error('Error fetching stores:', err)
    error.value = 'Error inesperado al cargar las tiendas'
    stores.value = []
    pagination.value = null
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  updateQueryParams({ page: page.toString() })
}

const updateQueryParams = (params: {
  page?: string | number | undefined
  limit?: number | undefined
}) => {
  // Start with current query params to preserve existing ones
  const query: Record<string, string> = { ...route.query } as Record<string, string>

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


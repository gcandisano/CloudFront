<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="gap-4 sm:flex sm:items-center sm:justify-between">
        <h1 class="text-3xl font-bold tracking-tight text-white">
          {{ isPurchase ? 'Mis Compras' : 'Mis Ventas' }}
        </h1>
        <div class="flex gap-2 mt-4 sm:mt-0">
          <button
            @click="isPurchase = true"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium',
              isPurchase
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            ]"
          >
            Compras
          </button>
          <button
            @click="isPurchase = false"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium',
              !isPurchase
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            ]"
          >
            Ventas
          </button>
        </div>
      </div>

      <hr class="h-px my-6 border-0 bg-gray-700" />

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="sales.length === 0" class="text-center text-white py-20">
        <h2 class="text-2xl font-bold mb-4">
          {{ isPurchase ? 'No tienes compras aún' : 'No tienes ventas aún' }}
        </h2>
      </div>

      <div v-else class="mt-6 flow-root sm:mt-8">
        <div class="divide-y divide-gray-700">
          <div
            v-for="sale in sales"
            :key="sale.id"
            class="flex flex-wrap items-center gap-y-4 py-6"
          >
            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-400">
                {{ isPurchase ? 'ID Compra' : 'ID Venta' }}
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-white">
                <router-link
                  :to="isPurchase ? `/orders/${sale.id}` : `/sales/${sale.id}`"
                  class="hover:underline"
                >
                  #{{ sale.id }}
                </router-link>
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-400">Fecha</dt>
              <dd class="mt-1.5 text-base font-semibold text-white">
                {{ formatDate(sale.date) }}
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-400">Total</dt>
              <dd class="mt-1.5 text-base font-semibold text-white">
                {{ formatPrice(sale.total) }}
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-400">Estado</dt>
              <dd class="mt-1.5">
                <span :class="getStatusClass(sale.status)">
                  {{ getStatusText(sale.status) }}
                </span>
              </dd>
            </dl>

            <div class="w-full grid sm:grid-cols-2 lg:flex lg:w-96 lg:items-center lg:justify-end gap-4">
              <router-link
                :to="isPurchase ? `/orders/${sale.id}` : `/sales/${sale.id}`"
                class="w-full ml-0 inline-flex justify-center text-center rounded-lg border px-3 py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-gray-700"
              >
                Ver Detalles
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <Pagination
        v-if="sales.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { saleService } from '@/services'
import type { Sale } from '@/types/sale'
import { formatPrice } from '@/utils/formatting'
import Pagination from '@/components/Pagination.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const isPurchase = ref(true)
const sales = ref<Sale[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-gray-600 text-gray-300',
    confirmed: 'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-blue-900 text-blue-300',
    shipped: 'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-purple-900 text-purple-300',
    delivered: 'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-pink-900 text-pink-300',
    cancelled: 'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-red-900 text-red-300',
  }
  return classes[status] || classes.pending
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }
  return texts[status] || status
}

const loadSales = async () => {
  try {
    loading.value = true
    const response = await saleService.getSales(currentPage.value, 20, isPurchase.value)
    if (response.success && response.data) {
      sales.value = response.data.sales || []
      totalPages.value = response.data.pagination?.totalPages || 1
      currentPage.value = response.data.pagination?.page || 1
    } else {
      toast.error(response.message || 'Error al cargar las ventas/compras')
    }
  } catch (error) {
    console.error('Error loading sales:', error)
    toast.error('Error al cargar las ventas/compras')
  } finally {
    loading.value = false
  }
}

watch(isPurchase, () => {
  currentPage.value = 1
  loadSales()
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadSales()
}

onMounted(() => {
  loadSales()
})
</script>


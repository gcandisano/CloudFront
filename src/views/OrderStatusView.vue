<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="gap-4 sm:flex sm:items-center sm:justify-between">
        <h1 class="text-3xl font-bold tracking-tight text-white">
          {{ isPurchase ? `Compra #${sale?.id}` : `Venta #${sale?.id}` }}
        </h1>
        <router-link
          :to="isPurchase ? '/orders' : '/sales'"
          class="mt-auto mr-2 flex text-blue-600 hover:text-blue-700 hover:underline"
        >
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12l4-4m-4 4 4 4"></path>
          </svg>
          Volver
        </router-link>
      </div>

      <hr class="h-px my-6 border-0 bg-gray-700" />

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="sale" class="mt-6 sm:mt-8 lg:flex lg:gap-8">
        <!-- Productos -->
        <div class="w-full divide-y overflow-hidden rounded-lg border divide-gray-700 border-gray-700 lg:max-w-xl xl:max-w-2xl h-fit">
          <div
            v-for="product in sale.products"
            :key="product.product_id"
            class="space-y-4 p-6"
          >
            <div class="flex items-center gap-6">
              <router-link :to="`/product/${product.product_id}`" class="h-14 w-14 shrink-0">
                <img
                  class="h-full w-full rounded-md"
                  src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
                  :alt="product.name"
                />
              </router-link>
              <router-link
                :to="`/product/${product.product_id}`"
                class="min-w-0 flex-1 font-medium hover:underline text-white"
              >
                {{ product.name }}
              </router-link>
            </div>

            <div class="flex items-center justify-between gap-4">
              <p class="text-sm font-normal text-gray-400">
                <span class="font-medium text-white">Cantidad:</span>
                {{ product.amount }}
              </p>
              <p class="text-xl font-bold leading-tight text-white">
                {{ formatPrice(product.price) }}
              </p>
            </div>
          </div>

          <div class="space-y-4 p-6 bg-gray-800">
            <dl class="flex items-center justify-between gap-4">
              <dt class="text-lg font-bold text-white">Total</dt>
              <dd class="text-lg font-bold text-white">{{ formatPrice(sale.total) }}</dd>
            </dl>
          </div>
        </div>

        <!-- Información y acciones -->
        <div class="mt-6 grow sm:mt-8 lg:mt-0">
          <div class="space-y-6 rounded-lg border p-6 shadow-sm border-gray-700 bg-gray-800 mb-5">
            <h3 class="text-xl font-semibold text-white">Estado</h3>
            <p class="text-md text-gray-400">
              <span :class="getStatusClass(sale.status)">
                {{ getStatusText(sale.status) }}
              </span>
            </p>
            <p class="text-md text-gray-400">
              <span class="font-medium text-white">Dirección:</span>
              {{ sale.address }}
            </p>
            <p v-if="sale.note" class="text-md text-gray-400">
              <span class="font-medium text-white">Nota:</span>
              {{ sale.note }}
            </p>
          </div>

          <!-- Acciones según el estado -->
          <div class="space-y-4">
            <button
              v-if="sale.status === 'delivered' && isPurchase"
              @click="handleMarkAsReceived"
              class="w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Marcar como Recibido
            </button>
            <router-link
              v-if="sale.status === 'received' && isPurchase"
              :to="`/orders/${sale.id}/review`"
              class="w-full inline-flex justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Dejar Reseña
            </router-link>
            <button
              v-if="(sale.status === 'pending' || sale.status === 'confirmed') && !isPurchase"
              @click="handleUpdateStatus('shipped')"
              class="w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Marcar como Enviado
            </button>
            <button
              v-if="sale.status === 'shipped' && !isPurchase"
              @click="handleUpdateStatus('delivered')"
              class="w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Marcar como Entregado
            </button>
            <button
              v-if="sale.status === 'pending'"
              @click="handleCancel"
              class="w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white border border-red-700 bg-red-600 hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { saleService } from '@/services'
import type { Sale } from '@/types/sale'
import { formatPrice } from '@/utils/formatting'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const sale = ref<Sale | null>(null)
const loading = ref(true)

const isPurchase = computed(() => route.path.includes('/orders'))

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

const loadSale = async () => {
  try {
    loading.value = true
    const saleId = parseInt(route.params.id as string)
    const response = await saleService.getSale(saleId)
    if (response.success && response.data) {
      sale.value = response.data
    } else {
      toast.error(response.message || 'Error al cargar la venta/compra')
    }
  } catch (error) {
    console.error('Error loading sale:', error)
    toast.error('Error al cargar la venta/compra')
  } finally {
    loading.value = false
  }
}

const handleUpdateStatus = async (status: string) => {
  try {
    if (!sale.value) return
    const response = await saleService.updateSaleStatus(sale.value.id, status)
    if (response.success) {
      toast.success('Estado actualizado correctamente')
      await loadSale()
    } else {
      toast.error(response.message || 'Error al actualizar el estado')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    toast.error('Error al actualizar el estado')
  }
}

const handleMarkAsReceived = async () => {
  await handleUpdateStatus('received')
}

const handleCancel = async () => {
  if (!sale.value) return
  if (!confirm('¿Estás seguro de que deseas cancelar esta venta/compra?')) return

  try {
    const response = await saleService.cancelSale(sale.value.id)
    if (response.success) {
      toast.success('Venta/Compra cancelada correctamente')
      await loadSale()
    } else {
      toast.error(response.message || 'Error al cancelar')
    }
  } catch (error) {
    console.error('Error canceling sale:', error)
    toast.error('Error al cancelar')
  }
}

onMounted(() => {
  loadSale()
})
</script>


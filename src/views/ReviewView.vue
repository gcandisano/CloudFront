<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-white">Dejar Reseña</h1>
        <router-link
          :to="`/orders/${saleId}`"
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

      <div v-else class="space-y-6">
        <div
          v-for="product in products"
          :key="product.product_id"
          class="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm md:p-6"
        >
          <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
            <router-link :to="`/product/${product.product_id}`" class="shrink-0">
              <img
                class="h-20 w-20 rounded-md"
                src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
                :alt="product.name"
              />
            </router-link>

            <div class="w-full min-w-0 flex-1 space-y-4 md:max-w-md">
              <router-link
                :to="`/product/${product.product_id}`"
                class="text-base font-medium text-white hover:underline"
              >
                {{ product.name }}
              </router-link>
            </div>

            <div v-if="!reviews[product.product_id]" class="flex flex-col gap-4">
              <button
                @click="openReviewModal(product)"
                class="rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Dejar Reseña
              </button>
            </div>

            <div v-else class="flex items-center">
              <div v-for="i in 5" :key="i" class="flex">
                <svg
                  :class="[
                    'w-4 h-4',
                    i <= reviews[product.product_id].rating ? 'text-yellow-300' : 'text-gray-500'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de reseña -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showModal = false"
      >
        <div class="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="mb-1 text-lg font-semibold text-white">Agregar Reseña</h3>
              <p class="text-blue-500">{{ currentProduct?.name }}</p>
            </div>
            <button @click="showModal = false" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmitReview" class="space-y-4">
            <div>
              <label class="block mb-2 text-sm font-medium text-white">Calificación</label>
              <div class="flex items-center gap-2">
                <button
                  v-for="i in 5"
                  :key="i"
                  type="button"
                  @click="reviewForm.rating = i"
                  class="focus:outline-none"
                >
                  <svg
                    :class="[
                      'w-6 h-6 cursor-pointer',
                      i <= reviewForm.rating ? 'text-yellow-300' : 'text-gray-500'
                    ]"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                  </svg>
                </button>
                <span class="text-lg font-bold text-white ml-2">{{ reviewForm.rating }} / 5</span>
              </div>
            </div>

            <div>
              <label for="description" class="block mb-2 text-sm font-medium text-white">Descripción</label>
              <textarea
                id="description"
                v-model="reviewForm.description"
                rows="6"
                required
                class="block w-full rounded-lg border p-2.5 text-sm border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Escribe tu reseña aquí..."
              ></textarea>
            </div>

            <div class="flex gap-4">
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {{ submitting ? 'Enviando...' : 'Enviar Reseña' }}
              </button>
              <button
                type="button"
                @click="showModal = false"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { saleService, reviewService } from '@/services'
import type { SaleProduct } from '@/types/sale'
import type { Review } from '@/types/review'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const saleId = ref(parseInt(route.params.id as string))
const products = ref<SaleProduct[]>([])
const reviews = ref<Record<number, Review>>({})
const loading = ref(true)
const showModal = ref(false)
const submitting = ref(false)
const currentProduct = ref<SaleProduct | null>(null)
const reviewForm = ref({
  rating: 3,
  description: '',
})

const openReviewModal = (product: SaleProduct) => {
  currentProduct.value = product
  reviewForm.value = {
    rating: reviews.value[product.product_id]?.rating || 3,
    description: reviews.value[product.product_id]?.description || '',
  }
  showModal.value = true
}

const handleSubmitReview = async () => {
  if (!currentProduct.value) return

  try {
    submitting.value = true
    const response = await reviewService.createReview({
      productId: currentProduct.value.product_id.toString(),
      rating: reviewForm.value.rating,
      description: reviewForm.value.description,
    })

    if (response.success && response.data) {
      toast.success('Reseña creada correctamente')
      reviews.value[currentProduct.value.product_id] = response.data
      showModal.value = false
    } else {
      toast.error(response.message || 'Error al crear la reseña')
    }
  } catch (error) {
    console.error('Error creating review:', error)
    toast.error('Error al crear la reseña')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const response = await saleService.getSale(saleId.value)
    if (response.success && response.data) {
      products.value = response.data.products || []
    } else {
      toast.error('Error al cargar los productos')
    }
  } catch (error) {
    console.error('Error loading sale:', error)
    toast.error('Error al cargar los productos')
  } finally {
    loading.value = false
  }
})
</script>


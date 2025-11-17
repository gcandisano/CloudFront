<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleClose"
    >
      <div
        class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-white">Califica tus productos</h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <p class="text-gray-400 mb-6">
            Comparte tu experiencia con los productos que compraste. Puedes calificar cada producto
            con estrellas y agregar un comentario.
          </p>

          <!-- Products to review -->
          <div class="space-y-6">
            <div
              v-for="(product, index) in products"
              :key="product.product_id"
              class="border border-gray-700 rounded-lg p-4 bg-gray-900"
            >
              <!-- Product Info -->
              <div class="flex items-start gap-4 mb-4">
                <ProductImage
                  v-if="product.product_image_url"
                  :image-url="product.product_image_url"
                  :product-name="product.product_name"
                  size="small"
                />
                <div
                  v-else
                  class="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  <ImagePlaceholderIcon class="text-gray-500" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-white mb-1">{{ product.product_name }}</h3>
                  <p class="text-sm text-gray-400">{{ product.product_category }}</p>
                  <p class="text-sm text-gray-400">Cantidad: {{ product.quantity }}</p>
                </div>
              </div>

              <!-- Rating Stars -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Calificación ({{ reviews[index].rating || 0 }}/5)
                </label>
                <div class="flex items-center gap-1">
                  <button
                    v-for="star in 5"
                    :key="star"
                    @click="setRating(index, star)"
                    type="button"
                    class="focus:outline-none transition-colors"
                    :aria-label="`Calificar ${star} estrellas`"
                  >
                    <StarIcon
                      :class="[
                        star <= (reviews[index].rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-500',
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Review Description -->
              <div>
                <label
                  :for="`review-${index}`"
                  class="block text-sm font-medium text-gray-300 mb-2"
                >
                  Comentario (opcional)
                </label>
                <textarea
                  :id="`review-${index}`"
                  v-model="reviews[index].description"
                  rows="3"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="`Escribe tu opinión sobre ${product.product_name}...`"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button
            @click="handleClose"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            :disabled="submitting"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            :disabled="submitting || !canSubmit"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span v-if="submitting" class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
            <span>{{ submitting ? 'Enviando...' : 'Enviar reseñas' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SaleProduct } from '@/types'
import { reviewService } from '@/services/reviewService'
import { useToast } from 'vue-toastification'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import ImagePlaceholderIcon from '@/components/icons/ImagePlaceholderIcon.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import ProductImage from '@/components/products/ProductImage.vue'

interface Props {
  isOpen: boolean
  products: SaleProduct[]
}

interface ReviewForm {
  rating: number
  description: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submitted: []
}>()

const toast = useToast()
const submitting = ref(false)

// Initialize reviews array with empty reviews for each product
const reviews = ref<ReviewForm[]>([])

watch(
  () => props.products,
  (newProducts) => {
    if (newProducts && newProducts.length > 0) {
      reviews.value = newProducts.map(() => ({
        rating: 0,
        description: '',
      }))
    }
  },
  { immediate: true }
)

// Reset reviews when modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      reviews.value = props.products.map(() => ({
        rating: 0,
        description: '',
      }))
    }
  }
)

const setRating = (index: number, rating: number) => {
  reviews.value[index].rating = rating
}

const canSubmit = computed(() => {
  // At least one product must have a rating
  return reviews.value.some((review) => review.rating > 0)
})

const handleClose = () => {
  if (!submitting.value) {
    emit('close')
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return

  submitting.value = true

  try {
    // Submit all reviews
    const reviewPromises = props.products.map((product, index) => {
      const review = reviews.value[index]
      // Only submit if rating is provided
      if (review.rating > 0) {
        const reviewData: {
          productId: string
          rating: number
          description?: string
        } = {
          productId: product.product_id.toString(),
          rating: review.rating,
        }

        // Only include description if it's provided and not empty
        if (review.description && review.description.trim()) {
          reviewData.description = review.description.trim()
        }

        return reviewService.createReview(reviewData)
      }
      return Promise.resolve({ success: true, data: null })
    })

    const results = await Promise.all(reviewPromises)

    // Check if all reviews were successful
    const allSuccessful = results.every((result) => result.success || result.data === null)

    if (allSuccessful) {
      toast.success('¡Gracias por tus reseñas!')
      emit('submitted')
      emit('close')
    } else {
      const failedCount = results.filter((r) => !r.success && r.data !== null).length
      toast.error(`Error al enviar ${failedCount} reseña(s)`)
    }
  } catch (error) {
    console.error('Error submitting reviews:', error)
    toast.error('Error al enviar las reseñas')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>


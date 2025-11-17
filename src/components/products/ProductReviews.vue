<template>
  <section
    v-if="reviews.length > 0 || totalPages > 0"
    id="reviews"
    class="py-8 antialiased bg-gray-900 mx-auto px-4 my-6 mt-10 max-w-screen-2xl"
  >
    <div class="mx-auto max-w-screen-xl px-4 2xl">
      <h1 class="text-3xl font-bold tracking-tight text-white mr-2">Reseñas</h1>

      <div v-if="reviews.length > 0" class="mb-6 divide-y divide-gray-700">
        <div v-for="review in reviews" :key="review.id" class="gap-3 py-6 sm:flex sm:items-start">
          <div class="shrink-0 space-y-2 sm:w-48 md:w-72">
            <div class="flex items-center gap-0.5">
              <!-- Estrellas -->
              <template v-for="i in 5" :key="`review-star-${i}`">
                <StarIcon
                  :class="[
                    'h-4 w-4',
                    i <= Math.floor(review.rating) ? 'text-yellow-300' : 'text-gray-500',
                  ]"
                  size="h-4 w-4"
                />
              </template>
            </div>

            <div class="space-y-0.5">
              <p class="text-base font-semibold text-white">
                {{
                  review.given_name || review.family_name
                    ? `${review.given_name || ''} ${review.family_name || ''}`.trim()
                    : 'Usuario anónimo'
                }}
              </p>
              <p class="text-sm font-normal text-gray-400">{{ formatDate(review.timestamp) }}</p>
            </div>
          </div>

          <div class="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
            <p class="text-base font-normal text-gray-400">
              {{ review.description || 'Sin descripción' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Review } from '@/types'
import { formatDate } from '@/utils/formatting'
import StarIcon from '@/components/icons/StarIcon.vue'
import Pagination from '@/components/Pagination.vue'

interface Props {
  reviews: Review[]
  currentPage: number
  totalPages: number
}

defineProps<Props>()

const emit = defineEmits<{
  pageChanged: [page: number]
}>()

const handlePageChange = (page: number) => {
  emit('pageChanged', page)
}
</script>


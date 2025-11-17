<template>
  <div v-if="products.length > 0" class="mx-auto px-4 my-6 mt-10 max-w-screen-2xl">
    <span class="m-4 mt-8 self-center text-2xl font-semibold whitespace-nowrap text-white">
      También te puede gustar
    </span>
    <div class="mx-4 border-t border-gray-700 pt-6 mt-3 my-2 p-2">
      <div
        class="overflow-x-scroll scrollbar-hide mb-4 relative px-0.5"
        style="overflow-y: hidden"
      >
        <div class="slider scrollbar-hide gap-4">
          <div
            v-for="relatedProduct in products"
            :key="relatedProduct.id"
            class="group relative w-80"
          >
            <router-link :to="`/product/${relatedProduct.id}`">
              <div class="border bg-gray-800 border-gray-700 rounded-lg shadow-xl">
                <div class="group-hover:opacity-75">
                  <ProductImage
                    :image-url="relatedProduct.image_url"
                    :product-name="relatedProduct.name"
                    size="card"
                    container-class="aspect-h-1 h-96 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none lg:h-80"
                  />
                </div>
                <div class="mt-4 mx-4 mb-3 flex justify-between max-w-xs">
                  <p class="truncate text-md font-medium text-white ml-0">
                    {{ relatedProduct.name }}
                  </p>
                  <p class="text-md font-medium text-white">
                    {{ formatPrice(relatedProduct.price) }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types'
import { formatPrice } from '@/utils/formatting'
import ProductImage from '@/components/products/ProductImage.vue'

interface Props {
  products: Product[]
}

defineProps<Props>()
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.slider {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.slider > div {
  flex-shrink: 0;
}
</style>


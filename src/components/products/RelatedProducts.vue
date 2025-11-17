<template>
  <div v-if="products.length > 0" class="mx-auto px-4 my-6 mt-10 max-w-screen-2xl">
    <span class="m-4 mt-8 self-center text-2xl font-semibold whitespace-nowrap text-white">
      También te puede gustar
    </span>
    <div class="mx-4 border-t border-gray-700 pt-6 mt-3 my-2 p-2">
      <div class="overflow-x-scroll scrollbar-hide mb-4 relative px-0.5" style="overflow-y: hidden">
        <div class="slider scrollbar-hide gap-4">
          <div
            v-for="relatedProduct in products"
            :key="relatedProduct.id"
            class="w-80 flex-shrink-0"
          >
            <ProductCard :product="relatedProduct" show-store-on-hover />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types'
import ProductCard from '@/components/products/ProductCard.vue'

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

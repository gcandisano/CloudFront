<template>
  <div :class="finalContainerClass">
    <img
      v-if="imageUrl && imageUrl.startsWith('http')"
      :src="imageUrl"
      :alt="productName"
      :class="finalImageClass"
    />
    <img
      v-else-if="imageUrl"
      :src="`${apiBaseUrl}/image/${imageUrl}`"
      :alt="productName"
      :class="finalImageClass"
    />
    <img
      v-else
      src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
      :alt="productName"
      :class="finalImageClass"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

interface Props {
  imageUrl?: string | null
  productName: string
  size?: 'default' | 'small' | 'card'
  containerClass?: string
  imageClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  containerClass: '',
  imageClass: '',
})

// Default classes based on size
const defaultContainerClass = computed(() => {
  if (props.containerClass) return props.containerClass

  switch (props.size) {
    case 'small':
      return ''
    case 'card':
      return 'aspect-h-1 h-80 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none'
    default:
      return 'relative transition-transform duration-300 rounded-lg transform hover:scale-103'
  }
})

const defaultImageClass = computed(() => {
  if (props.imageClass) return props.imageClass

  switch (props.size) {
    case 'small':
      return 'w-20 h-20 object-cover rounded-lg'
    case 'card':
      return 'h-full w-full object-cover object-center lg:h-full lg:w-full'
    default:
      return 'w-4/5 mx-auto rounded-lg shadow-xxl shadow-gray-200'
  }
})

const finalContainerClass = computed(() => defaultContainerClass.value)
const finalImageClass = computed(() => defaultImageClass.value)
</script>

<style scoped>
.shadow-xxl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>


<template>
  <div :class="finalContainerClass">
    <!-- Store profile picture -->
    <img v-if="storeImageUrl && storeImageUrl.startsWith('http')" :src="storeImageUrl" :alt="storeName"
      :class="finalImageClass" />
    <img v-else-if="storeImageUrl" :src="`${apiBaseUrl}/image/${storeImageUrl}`" :alt="storeName"
      :class="finalImageClass" />
    <img v-else src="/store_icon.png" :alt="storeName" :class="finalImageClass" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

interface Props {
  storeImageUrl?: string | null
  storeName: string
  size?: 'default' | 'small' | 'card' | 'circle'
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
    case 'circle':
      return ''
    case 'card':
      return 'aspect-h-1 h-80 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none flex items-center justify-center'
    default:
      return 'relative transition-transform duration-300 rounded-lg transform hover:scale-103'
  }
})

const defaultImageClass = computed(() => {
  if (props.imageClass) return props.imageClass

  switch (props.size) {
    case 'small':
      return 'w-20 h-20 object-cover rounded-lg'
    case 'circle':
      return 'w-16 h-16 md:w-20 md:h-20 aspect-square rounded-full border-2 border-white shadow-lg object-cover'
    case 'card':
      // For card size, if there's no image, show smaller centered icon
      return props.storeImageUrl
        ? 'h-full w-full object-cover object-center lg:h-full lg:w-full'
        : 'h-32 w-32 object-contain'
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

<template>
  <button @click="handleClick" :class="[
    'p-2 rounded-full transition-colors duration-200',
    isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500',
    'hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800'
  ]" :aria-label="isFavorited ? 'Remove from favorites' : 'Add to favorites'">
    <HeartIcon :size="iconSize" :filled="isFavorited" />
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'

interface Props {
  isFavorited?: boolean
  iconSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  isFavorited: false,
  iconSize: 'w-6 h-6',
})

const emit = defineEmits<{
  click: []
}>()

const isFavorited = ref(props.isFavorited)

// Sync with prop changes
watch(
  () => props.isFavorited,
  (newValue) => {
    isFavorited.value = newValue
  }
)

const handleClick = (event: Event) => {
  event.stopPropagation()
  // Don't toggle locally - let parent handle the state
  emit('click')
}

</script>

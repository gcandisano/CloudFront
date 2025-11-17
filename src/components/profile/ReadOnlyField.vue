<template>
  <div :class="containerClass">
    <label class="block text-gray-400 mb-2 text-sm">{{ label }}</label>
    <input
      :value="value || 'No especificado'"
      type="text"
      disabled
      class="w-full px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value?: string | null
  class?: string
}>()

const containerClass = computed(() => props.class || '')
</script>


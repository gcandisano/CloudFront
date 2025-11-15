<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'w-full font-medium rounded-lg py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800',
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
        : 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'secondary' ? 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500' : '',
    ]"
  >
    <div v-if="loading" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
    </div>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)
</script>

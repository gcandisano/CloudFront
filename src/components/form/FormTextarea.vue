<template>
  <div>
    <label v-if="label" :for="id" class="block text-white mb-2 font-medium">
      {{ label }}
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :class="[
        'w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
        error ? 'border-red-500' : 'border-gray-600',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @blur="$emit('blur')"
    ></textarea>
    <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label?: string
  modelValue: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}>()

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()
</script>

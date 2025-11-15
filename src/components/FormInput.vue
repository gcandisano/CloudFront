<template>
  <div>
    <label v-if="label" :for="id" class="text-white mb-2 block">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full bg-gray-700 text-white rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
        error ? 'border-red-500' : 'border-gray-600',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    />
    <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label?: string
  type?: string
  modelValue: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()
</script>


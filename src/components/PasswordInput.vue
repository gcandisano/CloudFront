<template>
  <div class="relative">
    <FormInput
      :id="id"
      v-model="localValue"
      :label="label"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder"
      :error="error"
      :required="required"
      :disabled="disabled"
      @blur="$emit('blur')"
    />
    <button
      type="button"
      :disabled="disabled"
      @click="showPassword = !showPassword"
      class="absolute right-3 top-1/2 text-gray-400 hover:text-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      :class="label ? 'translate-y-2' : '-translate-y-1/2'"
      :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
    >
      <EyeOffIcon v-if="showPassword" />
      <EyeIcon v-else />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FormInput from '@/components/FormInput.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeOffIcon from '@/components/icons/EyeOffIcon.vue'

const props = defineProps<{
  id: string
  label?: string
  modelValue: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const showPassword = ref(false)

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

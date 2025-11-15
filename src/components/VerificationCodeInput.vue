<template>
  <div class="flex justify-center gap-2">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      :ref="(el) => setInputRef(el, index)"
      v-model="digits[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :class="[
        'w-12 h-14 text-center text-2xl font-semibold rounded-lg border-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
        error ? 'border-red-500' : 'border-gray-600',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :disabled="disabled"
      @input="handleInput(index, $event)"
      @keydown="handleKeyDown(index, $event)"
      @paste="handlePaste"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  error?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const digits = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])

const setInputRef = (el: unknown, index: number) => {
  if (el instanceof HTMLInputElement) {
    inputRefs.value[index] = el
  }
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.length === 6) {
    digits.value = newValue.split('')
  } else if (!newValue) {
    digits.value = ['', '', '', '', '', '']
  }
}, { immediate: true })

// Emit the complete code whenever digits change
watch(digits, (newDigits) => {
  const code = newDigits.join('')
  if (code.length === 6) {
    emit('update:modelValue', code)
  } else {
    emit('update:modelValue', '')
  }
}, { deep: true })

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Only allow digits

  if (value) {
    digits.value[index] = value.slice(-1) // Only take the last character

    // Move to next input if available
    if (index < 5 && value) {
      inputRefs.value[index + 1]?.focus()
    }
  } else {
    digits.value[index] = ''
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
    digits.value[index - 1] = ''
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 6)

  if (digitsOnly.length === 6) {
    digits.value = digitsOnly.split('')
    inputRefs.value[5]?.focus()
  }
}

// Focus first input on mount
onMounted(() => {
  inputRefs.value[0]?.focus()
})

// Expose method to clear the input
defineExpose({
  clear: () => {
    digits.value = ['', '', '', '', '', '']
    inputRefs.value[0]?.focus()
  }
})
</script>


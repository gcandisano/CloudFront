<template>
  <div>
    <label class="block text-white mb-2 font-medium">Foto de Perfil</label>
    <div
      class="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors max-w-xs"
      @click="fileInput?.click()"
    >
      <img
        v-if="imageSrc"
        :src="imageSrc"
        alt="Profile Picture"
        class="w-32 h-32 object-cover rounded-full mb-2"
      />
      <div v-else class="w-32 h-32 flex items-center justify-center bg-gray-700 rounded-full">
        <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <span class="text-blue-500 text-sm mt-2">Haz clic para cambiar la foto</span>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />
      <p v-if="error" class="text-red-400 text-xs mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  currentImage?: string | null
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  fileChange: [file: File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)

const imageSrc = computed(() => {
  return previewImage.value || props.currentImage || undefined
})

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  // Create preview
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value)
  }
  previewImage.value = URL.createObjectURL(file)

  emit('fileChange', file)
}

defineExpose({
  clearPreview: () => {
    if (previewImage.value) {
      URL.revokeObjectURL(previewImage.value)
      previewImage.value = null
    }
  },
})
</script>


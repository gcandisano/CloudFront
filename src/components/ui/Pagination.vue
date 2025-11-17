<template>
  <section class="flex items-center justify-center space-x-2 py-8">
    <!-- Botón anterior -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage <= 1"
      class="px-3 py-2 text-sm font-medium text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Anterior
    </button>

    <!-- Números de página -->
    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="page !== '...'"
        @click="goToPage(Number(page))"
        :class="[
          'px-3 py-2 text-sm font-medium rounded-lg',
          page === currentPage
            ? 'text-white bg-blue-600 border border-blue-600'
            : 'text-white bg-gray-700 border border-gray-600 hover:bg-gray-600',
        ]"
      >
        {{ page }}
      </button>
      <span v-else class="px-3 py-2 text-sm text-gray-400">...</span>
    </template>

    <!-- Botón siguiente -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage >= totalPages"
      class="px-3 py-2 text-sm font-medium text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Siguiente
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  pageChanged: [page: number]
}>()

// Computed
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5

  if (props.totalPages <= maxVisible) {
    // Si hay pocas páginas, mostrar todas
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Lógica para mostrar páginas con elipsis
    if (props.currentPage <= 3) {
      // Al inicio
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(props.totalPages)
    } else if (props.currentPage >= props.totalPages - 2) {
      // Al final
      pages.push(1)
      pages.push('...')
      for (let i = props.totalPages - 3; i <= props.totalPages; i++) {
        pages.push(i)
      }
    } else {
      // En el medio
      pages.push(1)
      pages.push('...')
      for (let i = props.currentPage - 1; i <= props.currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(props.totalPages)
    }
  }

  return pages
})

// Métodos
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChanged', page)
  }
}
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>

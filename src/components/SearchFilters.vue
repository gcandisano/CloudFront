<template>
  <section>
    <form @submit.prevent="handleSubmit" class="max-w-xl mx-auto flex my-auto">
      <!-- Botón de favoritos -->
      <button
        v-if="isAuthenticated && !hasStore"
        @click="toggleLiked"
        type="button"
        class="h-10 mx-2"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          :fill="currentFilters.liked ? 'white' : 'none'"
          viewBox="0 0 24 24"
          class="h-10 w-10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
          />
        </svg>
      </button>

      <div class="w-full">
        <div class="flex">
          <!-- Dropdown de categorías -->
          <div class="relative">
            <button
              @click="toggleCategoryDropdown"
              type="button"
              class="flex-shrink-0 z-10 hidden md:inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border rounded-s-lg focus:ring-4 focus:outline-none bg-gray-700 hover:bg-gray-600 focus:ring-gray-700 text-white border-gray-600"
            >
              {{ getCategoryDisplayName() }}
              <svg
                class="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            <!-- Dropdown de categorías -->
            <div
              v-show="showCategoryDropdown"
              class="absolute z-10 divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700"
            >
              <ul class="py-2 text-sm text-gray-200">
                <li v-if="currentFilters.category">
                  <button
                    @click="selectCategory('')"
                    type="button"
                    class="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                  >
                    Todas
                  </button>
                </li>
                <li v-for="category in categories" :key="category">
                  <button
                    @click="selectCategory(category)"
                    type="button"
                    class="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                  >
                    {{ getCategoryDisplayName(category) }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Campo de búsqueda -->
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="search"
              class="block p-2.5 w-full z-20 text-sm rounded-e-lg rounded-s-lg md:rounded-s-none border-s-2 border focus:ring-blue-500 bg-gray-700 border-s-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500"
              placeholder="Buscar productos..."
            />
            <button
              type="submit"
              class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
            >
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span class="sr-only">Buscar</span>
            </button>
          </div>

          <!-- Dropdown de ordenamiento -->
          <div class="flex items-center">
            <div class="relative inline-block text-left ml-4">
              <button
                @click="toggleSortDropdown"
                type="button"
                class="group inline-flex justify-center text-sm font-medium text-white hover:text-gray-400"
              >
                {{ getSortDisplayName() }}
                <svg
                  class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <!-- Dropdown de ordenamiento -->
              <div
                v-show="showSortDropdown"
                class="absolute z-10 divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700"
              >
                <ul class="py-2 text-sm text-gray-200">
                  <li>
                    <button
                      @click="selectSort('rating desc')"
                      type="button"
                      class="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                    >
                      Mejor valorados
                    </button>
                  </li>
                  <li>
                    <button
                      @click="selectSort('id desc')"
                      type="button"
                      class="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                    >
                      Más recientes
                    </button>
                  </li>
                  <li>
                    <button
                      @click="selectSort('id')"
                      type="button"
                      class="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                    >
                      Más antiguos
                    </button>
                  </li>
                  <li>
                    <button
                      @click="selectSort('price')"
                      type="button"
                      class="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                    >
                      Precio: menor a mayor
                    </button>
                  </li>
                  <li>
                    <button
                      @click="selectSort('price desc')"
                      type="button"
                      class="inline-flex w-full px-4 py-2 hover:bg-gray-600 hover:text-white"
                    >
                      Precio: mayor a menor
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Props
interface Props {
  categories: string[]
  currentFilters: {
    search?: string
    category?: string
    sort?: string
    liked?: boolean
  }
  isAuthenticated: boolean
  hasStore: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  filtersChanged: [filters: any]
}>()

// Estado reactivo
const searchQuery = ref(props.currentFilters.search || '')
const showCategoryDropdown = ref(false)
const showSortDropdown = ref(false)

// Computed
const currentFilters = computed(() => props.currentFilters)

// Métodos
const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value
  showSortDropdown.value = false
}

const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value
  showCategoryDropdown.value = false
}

const toggleLiked = () => {
  emit('filtersChanged', {
    liked: !currentFilters.value.liked,
    page: 1,
  })
}

const selectCategory = (category: string) => {
  emit('filtersChanged', {
    category: category || undefined,
    page: 1,
  })
  showCategoryDropdown.value = false
}

const selectSort = (sort: string) => {
  emit('filtersChanged', {
    sort,
    page: 1,
  })
  showSortDropdown.value = false
}

const handleSubmit = () => {
  emit('filtersChanged', {
    search: searchQuery.value || undefined,
    page: 1,
  })
}

const getCategoryDisplayName = (category?: string) => {
  const cat = category || currentFilters.value.category
  if (!cat) return 'Categorías'

  // Aquí puedes mapear los nombres de categorías a nombres más amigables
  const categoryNames: Record<string, string> = {
    Electronics: 'Electrónicos',
    Clothing: 'Ropa',
    Books: 'Libros',
    Home: 'Hogar',
    Sports: 'Deportes',
    // Agregar más mapeos según necesites
  }

  return categoryNames[cat] || cat
}

const getSortDisplayName = () => {
  const sort = currentFilters.value.sort || 'rating desc'

  const sortNames: Record<string, string> = {
    'rating desc': 'Mejor valorados',
    'id desc': 'Más recientes',
    id: 'Más antiguos',
    price: 'Precio: menor a mayor',
    'price desc': 'Precio: mayor a menor',
  }

  return sortNames[sort] || 'Ordenar'
}

// Cerrar dropdowns al hacer clic fuera
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showCategoryDropdown.value = false
    showSortDropdown.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watchers
watch(
  () => props.currentFilters.search,
  (newSearch) => {
    searchQuery.value = newSearch || ''
  },
)
</script>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style>

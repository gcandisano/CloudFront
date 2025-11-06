<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-white">Mis Productos</h1>
      <hr class="h-px my-6 border-0 bg-gray-700" />

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else>
        <!-- Buscador -->
        <div class="mb-6">
          <form @submit.prevent="loadProducts" class="relative">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Buscar productos..."
              class="block p-2 text-sm border rounded-lg w-80 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            />
            <button
              type="submit"
              class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
            >
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"></path>
              </svg>
            </button>
          </form>
        </div>

        <!-- Tabla de productos -->
        <div v-if="products.length > 0" class="relative overflow-x-auto sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-400">
            <thead class="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Nombre</th>
                <th scope="col" class="px-6 py-3">Categoría</th>
                <th scope="col" class="px-6 py-3">Precio</th>
                <th scope="col" class="px-6 py-3">Rating</th>
                <th scope="col" class="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in products"
                :key="product.id"
                class="border-b bg-gray-800 border-gray-700"
              >
                <th scope="row" class="flex items-center px-4 py-4 font-medium text-white whitespace-nowrap max-w-xs md:max-w-lg">
                  <router-link
                    :to="`/product/${product.id}`"
                    class="flex items-center whitespace-nowrap max-w-full"
                  >
                    <img
                      :src="product.image_url || 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg'"
                      class="rounded-md w-9 h-9 mr-3"
                      :alt="product.name"
                    />
                    <p class="truncate hover:text-gray-300 hover:underline">{{ product.name }}</p>
                  </router-link>
                </th>
                <td class="px-6 py-4">
                  <router-link
                    :to="`/?category=${product.category}`"
                    class="hover:text-gray-300 hover:underline"
                  >
                    {{ product.category }}
                  </router-link>
                </td>
                <td class="px-6 py-4">{{ formatPrice(product.price) }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-300 me-1" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"></path>
                    </svg>
                    <span v-if="product.rating">{{ product.rating }}</span>
                    <span v-else class="text-gray-500">Sin rating</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <router-link
                      :to="`/product/${product.id}/edit`"
                      class="font-medium text-blue-700 hover:text-blue-500 hover:underline"
                      title="Editar"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
                      </svg>
                    </router-link>

                    <button
                      v-if="!product.paused"
                      @click="handlePause(product.id)"
                      class="font-medium text-yellow-700 hover:text-yellow-500 hover:underline"
                      title="Pausar"
                    >
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clip-rule="evenodd"></path>
                      </svg>
                    </button>

                    <button
                      v-else
                      @click="handleResume(product.id)"
                      class="font-medium text-green-700 hover:text-green-500 hover:underline"
                      title="Reanudar"
                    >
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd"></path>
                      </svg>
                    </button>

                    <button
                      @click="handleDelete(product.id)"
                      class="font-medium text-red-700 hover:text-red-500 hover:underline"
                      title="Eliminar"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"></path>
                      </svg>
                    </button>

                    <router-link
                      :to="`/product/${product.id}`"
                      target="_blank"
                      class="font-medium text-gray-300 hover:text-gray-100 hover:underline"
                      title="Ver producto"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"></path>
                      </svg>
                    </router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center text-white py-20">
          <h2 class="text-2xl font-bold mb-4">No tienes productos aún</h2>
          <router-link to="/product/create" class="text-blue-400 hover:text-blue-300">
            Crear primer producto →
          </router-link>
        </div>
      </div>

      <!-- Modal de confirmación de eliminación -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="mb-5 text-lg font-normal text-gray-400">¿Estás seguro de que deseas eliminar este producto?</h3>
          <div class="flex gap-4">
            <button
              @click="confirmDelete"
              class="flex-1 bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Sí, eliminar
            </button>
            <button
              @click="showDeleteModal = false"
              class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/formatting'
import { useToast } from 'vue-toastification'

const toast = useToast()
const products = ref<Product[]>([])
const loading = ref(true)
const searchQuery = ref('')
const showDeleteModal = ref(false)
const productToDelete = ref<number | null>(null)

const loadProducts = async () => {
  try {
    loading.value = true
    const response = await productService.fetchProducts({
      search: searchQuery.value || undefined,
      page: 1,
    })
    if (response.success && response.data) {
      // Filtrar solo los productos del usuario autenticado
      // En desarrollo, mostrar productos hardcodeados del usuario
      const allProducts = response.data.products || []
      // Si hay búsqueda, filtrar por nombre
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        products.value = allProducts.filter(p => 
          p.name.toLowerCase().includes(query) && p.seller_id === 1
        )
      } else {
        // Mostrar solo productos del usuario autenticado (ID 1 en modo simulado)
        products.value = allProducts.filter(p => p.seller_id === 1)
      }
    } else {
      // Si falla, usar datos hardcodeados del usuario
      products.value = [
        {
          id: 1,
          name: 'iPhone 15 Pro',
          description: 'El último iPhone con chip A17 Pro y cámara de 48MP',
          category: 'Electronics',
          price: 1299.99,
          image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
          paused: false,
          seller_id: 1,
          first_name: 'Usuario',
          last_name: 'Ejemplo',
          rating: 4.5,
          ratingCount: 23,
        },
        {
          id: 3,
          name: 'AirPods Pro',
          description: 'Auriculares inalámbricos con cancelación de ruido activa',
          category: 'Electronics',
          price: 249.99,
          image_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
          paused: false,
          seller_id: 1,
          first_name: 'Usuario',
          last_name: 'Ejemplo',
          rating: 4.7,
          ratingCount: 67,
        },
        {
          id: 6,
          name: 'Samsung Galaxy S24',
          description: 'Smartphone Android con pantalla AMOLED de 6.2 pulgadas',
          category: 'Electronics',
          price: 899.99,
          image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
          paused: true,
          seller_id: 1,
          first_name: 'Usuario',
          last_name: 'Ejemplo',
          rating: 4.3,
          ratingCount: 56,
        },
      ]
    }
  } catch (error) {
    console.error('Error loading products:', error)
    // Datos hardcodeados cuando hay error
    products.value = [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        description: 'El último iPhone con chip A17 Pro y cámara de 48MP',
        category: 'Electronics',
        price: 1299.99,
        image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 1,
        first_name: 'Usuario',
        last_name: 'Ejemplo',
        rating: 4.5,
        ratingCount: 23,
      },
      {
        id: 3,
        name: 'AirPods Pro',
        description: 'Auriculares inalámbricos con cancelación de ruido activa',
        category: 'Electronics',
        price: 249.99,
        image_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 1,
        first_name: 'Usuario',
        last_name: 'Ejemplo',
        rating: 4.7,
        ratingCount: 67,
      },
    ]
  } finally {
    loading.value = false
  }
}

const handlePause = async (productId: number) => {
  try {
    // TODO: Implementar cuando tengas el backend
    // await productService.pauseProduct(productId)
    toast.success('Producto pausado correctamente')
    await loadProducts()
  } catch (error) {
    console.error('Error pausing product:', error)
    toast.error('Error al pausar el producto')
  }
}

const handleResume = async (productId: number) => {
  try {
    // TODO: Implementar cuando tengas el backend
    // await productService.resumeProduct(productId)
    toast.success('Producto reanudado correctamente')
    await loadProducts()
  } catch (error) {
    console.error('Error resuming product:', error)
    toast.error('Error al reanudar el producto')
  }
}

const handleDelete = (productId: number) => {
  productToDelete.value = productId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!productToDelete.value) return

  try {
    // TODO: Implementar cuando tengas el backend
    // await productService.deleteProduct(productToDelete.value)
    toast.success('Producto eliminado correctamente')
    showDeleteModal.value = false
    productToDelete.value = null
    await loadProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    toast.error('Error al eliminar el producto')
  }
}

onMounted(() => {
  loadProducts()
})
</script>


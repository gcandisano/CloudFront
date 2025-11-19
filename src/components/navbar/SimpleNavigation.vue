<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/authService'

const authStore = useAuthStore()
const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const showUserMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => userStore.user)
const cartItemCount = computed(() => cartStore.totalItems)
const isSeller = computed(() => userStore.isSeller)

const isActiveRoute = (path: string) => {
  return route.path === path
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  try {
    // Sign out from Cognito (clears Cognito session from local storage)
    await authService.logout()
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    // Clear local auth and user data
    authStore.clearAuthData()
    userStore.clearUser()
    showUserMenu.value = false
    router.push('/')
  }
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.user-menu-container')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-white text-xl font-bold"> MatchMarket </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link
              to="/"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                isActiveRoute('/')
                  ? 'text-blue-400 font-semibold'
                  : 'text-gray-300 hover:text-white',
              ]"
            >
              Inicio
            </router-link>
            <router-link
              to="/explore"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                isActiveRoute('/explore')
                  ? 'text-blue-400 font-semibold'
                  : 'text-gray-300 hover:text-white',
              ]"
            >
              Explorar
            </router-link>
          </div>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center space-x-3">
          <!-- Create Product Button -->
          <router-link
            v-if="isAuthenticated"
            to="/product/create"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Crear Producto</span>
          </router-link>

          <!-- User Menu / Login -->
          <div v-if="isAuthenticated" class="relative user-menu-container">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <span>{{ currentUser?.given_name || 'Usuario' }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': showUserMenu }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div
              v-show="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"
            >
              <router-link
                to="/profile"
                @click="showUserMenu = false"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Mi Perfil
              </router-link>
              <router-link
                v-if="isSeller"
                :to="`/store/${currentUser?.id || ''}`"
                @click="showUserMenu = false"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Mi Tienda
              </router-link>
              <router-link
                to="/cart"
                @click="showUserMenu = false"
                class="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <span class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Mi Carrito
                </span>
                <span
                  v-if="cartItemCount > 0"
                  class="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                >
                  {{ cartItemCount }}
                </span>
              </router-link>
              <router-link
                to="/orders"
                @click="showUserMenu = false"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Mis Compras
              </router-link>
              <router-link
                to="/sales"
                @click="showUserMenu = false"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mis Ventas
              </router-link>
              <div class="border-t border-gray-700 my-1"></div>
              <button
                @click="logout"
                class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <router-link
            v-else
            to="/login"
            class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Iniciar Sesión</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

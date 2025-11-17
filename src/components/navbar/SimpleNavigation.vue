<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const showUserMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => userStore.user)

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
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Inicio
            </router-link>
            <router-link
              to="/explore"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
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
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
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
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
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

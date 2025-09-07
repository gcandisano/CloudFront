<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Store
const authStore = useAuthStore()

// Estado reactivo
const showUserMenu = ref(false)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)

// Métodos
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  authStore.logout()
  showUserMenu.value = false
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-900">
    <!-- Header/Navigation -->
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
                :class="{ 'text-blue-400': $route.path === '/' }"
              >
                Inicio
              </router-link>
              <router-link
                to="/explore"
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'text-blue-400': $route.path === '/explore' }"
              >
                Explorar
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <template v-if="isAuthenticated">
              <div class="relative">
                <button
                  @click="toggleUserMenu"
                  class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {{ currentUser?.firstName || 'Usuario' }}
                </button>

                <!-- Dropdown menu -->
                <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50"
                >
                  <!-- Enlaces temporalmente comentados hasta crear las vistas
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-600"
                    @click="showUserMenu = false"
                  >
                    Mi Perfil
                  </router-link>
                  -->
                  <span class="block px-4 py-2 text-sm text-gray-400"
                    >Mi Perfil (Próximamente)</span
                  >
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-600"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-white text-sm font-medium">Iniciar Sesión</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* Estilos globales */
#app {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="text-center px-4">
      <h1 class="text-9xl font-bold text-white mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-300 mb-4">Página no encontrada</h2>
      <p class="text-gray-400 mb-8 max-w-md mx-auto">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <div class="flex gap-4 justify-center">
        <router-link
          to="/"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Ir al inicio
        </router-link>
        <button
          @click="$router.go(-1)"
          class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Volver atrás
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found page
</script>

<style scoped>
/* Additional styles if needed */
</style>


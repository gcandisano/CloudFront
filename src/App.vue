<script setup lang="ts">
import NotificationToast from '@/components/NotificationToast.vue'
import SimpleNavigation from './components/navbar/SimpleNavigation.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-900">
    <!-- Header/Navigation -->
    <SimpleNavigation />

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Notificaciones -->
    <NotificationToast />
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

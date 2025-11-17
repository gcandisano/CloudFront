<template>
  <div
    class="fixed top-4 right-4 z-50 flex flex-col gap-2"
    style="max-height: calc(100vh - 2rem); overflow-y: auto"
  >
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-lg shadow-lg max-w-sm w-full transition-all duration-300 transform',
          {
            'bg-green-600 text-white': notification.type === 'success',
            'bg-red-600 text-white': notification.type === 'error',
            'bg-blue-600 text-white': notification.type === 'info',
            'bg-yellow-500 text-white': notification.type === 'warning',
          },
        ]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium">{{ notification.message }}</p>
          <button
            @click="removeNotification(notification.id)"
            class="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

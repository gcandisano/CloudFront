<template>
  <div class="min-h-screen bg-gray-900">
    <main class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-white mr-2">Notificaciones</h1>
      <hr class="h-px my-6 border-0 bg-gray-700" />

      <ul class="flex flex-wrap text-sm font-medium text-center border-b border-gray-700 text-gray-400 items-center">
        <li class="me-2">
          <button
            @click="unreadOnly = true"
            :class="[
              'inline-block p-4 rounded-t-lg',
              unreadOnly ? 'bg-gray-800 text-blue-500' : 'hover:bg-gray-800 hover:text-gray-300'
            ]"
          >
            No leídas
          </button>
        </li>
        <li class="me-auto">
          <button
            @click="unreadOnly = false"
            :class="[
              'inline-block p-4 rounded-t-lg',
              !unreadOnly ? 'bg-gray-800 text-blue-500' : 'hover:bg-gray-800 hover:text-gray-300'
            ]"
          >
            Todas
          </button>
        </li>
        <li>
          <button
            @click="handleMarkAllAsRead"
            class="font-medium text-blue-600 hover:text-blue-500 hover:underline opacity-100"
          >
            Marcar todas como leídas
          </button>
        </li>
      </ul>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="notifications.length === 0" class="text-center text-white py-20">
        <h2 class="text-2xl font-bold mb-4">
          {{ unreadOnly ? 'No tienes notificaciones no leídas' : 'No tienes notificaciones' }}
        </h2>
      </div>

      <div v-else class="relative overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-400">
          <thead class="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Mensaje</th>
              <th scope="col" class="px-6 py-3">Fecha</th>
              <th scope="col" class="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="notification in notifications"
              :key="notification.id"
              :class="[
                'border-b bg-gray-800 border-gray-700',
                notification.read ? 'bg-gray-800/50' : ''
              ]"
            >
              <td :class="['px-6 py-4 text-white', notification.read ? 'opacity-50' : '']">
                <button
                  v-if="notification.type !== 'OTHER'"
                  @click="handleNotificationClick(notification)"
                  class="hover:underline"
                >
                  {{ notification.message }}
                </button>
                <p v-else>{{ notification.message }}</p>
              </td>
              <td :class="['px-6 py-4', notification.read ? 'opacity-50' : '']">
                {{ formatDate(notification.created_at) }}
              </td>
              <td class="px-6 py-4">
                <button
                  v-if="!notification.read"
                  @click="handleMarkAsRead(notification.id)"
                  class="font-medium text-blue-700 hover:text-blue-500 hover:underline"
                  title="Marcar como leída"
                >
                  <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 11.917 9.724 16.5 19 7.5"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <Pagination
        v-if="notifications.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notificationService } from '@/services'
import type { NotificationItem } from '@/types/notification'
import Pagination from '@/components/Pagination.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const notifications = ref<NotificationItem[]>([])
const loading = ref(true)
const unreadOnly = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

const loadNotifications = async () => {
  try {
    loading.value = true
    const response = await notificationService.getNotifications(currentPage.value, 20, unreadOnly.value)
    if (response.success && response.data) {
      notifications.value = response.data.notifications || []
      totalPages.value = response.data.pagination?.totalPages || 1
      currentPage.value = response.data.pagination?.page || 1
    } else {
      toast.error(response.message || 'Error al cargar las notificaciones')
    }
  } catch (error) {
    console.error('Error loading notifications:', error)
    toast.error('Error al cargar las notificaciones')
  } finally {
    loading.value = false
  }
}

const handleMarkAsRead = async (id: number) => {
  try {
    const response = await notificationService.markAsRead(id)
    if (response.success) {
      await loadNotifications()
      toast.success('Notificación marcada como leída')
    } else {
      toast.error('Error al marcar la notificación')
    }
  } catch (error) {
    console.error('Error marking as read:', error)
    toast.error('Error al marcar la notificación')
  }
}

const handleMarkAllAsRead = async () => {
  try {
    const response = await notificationService.markAllAsRead()
    if (response.success) {
      await loadNotifications()
      toast.success('Todas las notificaciones marcadas como leídas')
    } else {
      toast.error('Error al marcar las notificaciones')
    }
  } catch (error) {
    console.error('Error marking all as read:', error)
    toast.error('Error al marcar las notificaciones')
  }
}

const handleNotificationClick = (notification: NotificationItem) => {
  if (notification.product_id) {
    router.push(`/product/${notification.product_id}`)
  }
  if (!notification.read) {
    handleMarkAsRead(notification.id)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadNotifications()
}

watch(unreadOnly, () => {
  currentPage.value = 1
  loadNotifications()
})

onMounted(() => {
  loadNotifications()
})
</script>


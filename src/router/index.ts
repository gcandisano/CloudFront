import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/explore',
      name: 'explore',
      component: HomeView,
    },
    {
      path: '/store/:storeId?',
      name: 'store',
      component: HomeView,
      props: true,
    },
    {
      path: '/store/profile',
      name: 'storeProfile',
      component: () => import('@/views/StoreProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/store/edit',
      name: 'editStore',
      component: () => import('@/views/EditStoreView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/product/:id/edit',
      name: 'editProduct',
      component: () => import('@/views/EditProductView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
    },
    {
      path: '/product/create',
      name: 'createProduct',
      component: () => import('@/views/CreateProductView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('@/views/CallbackView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('@/views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: () => import('@/views/ResetPasswordView.vue'),
    },
    {
      path: '/verify-email',
      name: 'verifyEmail',
      component: () => import('@/views/VerifyEmailView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/edit',
      name: 'editProfile',
      component: () => import('@/views/EditProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrdersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id',
      name: 'orderStatus',
      component: () => import('@/views/OrderStatusView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id/review',
      name: 'review',
      component: () => import('@/views/ReviewView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/sales/:id',
      name: 'saleStatus',
      component: () => import('@/views/OrderStatusView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('@/views/NotificationsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Guardia de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // En desarrollo, permitir acceso si hay token simulado
  if (import.meta.env.DEV && to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (token === 'mock-token-for-development') {
      // Permitir acceso si hay token simulado
      next()
      return
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

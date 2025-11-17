import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import ProductView from '@/views/products/ProductView.vue'
import CreateProductView from '@/views/products/CreateProductView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import VerifyEmailView from '@/views/auth/VerifyEmailView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import ProfileView from '@/views/ProfileView.vue'
import OrdersView from '@/views/OrdersView.vue'

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
      path: '/product/:id',
      name: 'product',
      component: ProductView,
    },
    {
      path: '/product/create',
      name: 'createProduct',
      component: CreateProductView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: '/verify-email',
      name: 'verifyEmail',
      component: VerifyEmailView,
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPasswordView,
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPasswordView,
      meta: { requiresGuest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true },
    },
    // Rutas temporalmente comentadas hasta crear las vistas
    /*
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { requiresAuth: true },
    },
    */
  ],
})

// Guardia de navegación para rutas protegidas
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  // Initialize user data if authenticated but not loaded
  if (authStore.isAuthenticated && !userStore.user) {
    await userStore.initializeUser()
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  next()
})

export default router

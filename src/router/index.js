import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Documents from '../views/Documents.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: Documents,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route without auth
    next('/login')
  } else if ((to.path === '/login' || to.path === '/signup') && isAuthenticated) {
    // Redirect to dashboard if already logged in
    next('/dashboard')
  } else {
    next()
  }
})

export default router

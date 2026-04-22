import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Documents from '../views/Documents.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminSignup from '../views/admin/AdminSignup.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminDocuments from '../views/admin/AdminDocuments.vue'

const routes = [
  // Public routes
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
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/signup',
    name: 'AdminSignup',
    component: AdminSignup
  },
  
  // User routes (require authentication)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/documents',
    name: 'Documents',
    component: Documents,
    meta: { requiresAuth: true, role: 'user' }
  },
  
  // Admin routes (require admin role)
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/documents',
    name: 'AdminDocuments',
    component: AdminDocuments,
    meta: { requiresAuth: true, role: 'admin' }
  },
  
  // Default redirect
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication and roles
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken')
  const userRole = localStorage.getItem('userRole') || 'user'
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to appropriate login page
    if (to.meta.role === 'admin') {
      next('/admin/login')
    } else {
      next('/login')
    }
    return
  }
  
  // Check role-based access
  if (to.meta.requiresAuth && isAuthenticated) {
    if (to.meta.role === 'admin' && userRole !== 'admin') {
      // Non-admin trying to access admin route
      next('/dashboard')
      return
    }
    if (to.meta.role === 'user' && userRole === 'admin') {
      // Admin trying to access user route - redirect to admin dashboard
      next('/admin/dashboard')
      return
    }
  }
  
  // Redirect if already logged in and trying to access login pages
  if (isAuthenticated) {
    if (to.path === '/login' || to.path === '/signup') {
      next(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')
      return
    }
    if (to.path === '/admin/login' || to.path === '/admin/signup') {
      next(userRole === 'admin' ? '/admin/dashboard' : '/dashboard')
      return
    }
  }
  
  next()
})

export default router

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-3xl text-white">📄</span>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to your DocTrack account</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">📧</span>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">🔒</span>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="formData.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-500">
              Forgot password?
            </a>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Sign In</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <!-- Social Login Buttons -->
          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              <span class="mr-2">🔵</span>
              Google
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              <span class="mr-2">⚫</span>
              Microsoft
            </button>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/signup" class="font-medium text-primary-600 hover:text-primary-500">
              Sign up for free
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-xs text-gray-500">
        © 2026 DocTrack. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        rememberMe: false
      },
      showPassword: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // Connect to Django backend API
        const API_URL = 'http://localhost:8000/api/auth/login/';
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.formData.email,
            password: this.formData.password
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Store real auth token from backend
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userName', data.user.full_name || data.user.username);

          console.log('✅ Login successful!');
          
          // Redirect to dashboard
          this.$router.push('/dashboard');
        } else {
          this.errorMessage = data.error || 'Invalid email or password';
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error.message === 'Failed to fetch') {
          this.errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

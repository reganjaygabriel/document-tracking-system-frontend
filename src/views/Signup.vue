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
        <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
        <p class="mt-2 text-sm text-gray-600">Join DocTrack and manage your documents</p>
      </div>

      <!-- Signup Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSignup" class="space-y-5">
          <!-- Full Name Field -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">👤</span>
              <input
                id="fullName"
                v-model="formData.fullName"
                type="text"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

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

          <!-- Organization Field -->
          <div>
            <label for="organization" class="block text-sm font-medium text-gray-700 mb-2">
              Organization (Optional)
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">🏢</span>
              <input
                id="organization"
                v-model="formData.organization"
                type="text"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Your Company"
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
                placeholder="Create a strong password"
                @input="validatePassword"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <!-- Password Strength Indicator -->
            <div v-if="formData.password" class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    :class="passwordStrengthColor"
                    :style="{ width: passwordStrengthWidth }"
                    class="h-full transition-all duration-300"
                  ></div>
                </div>
                <span :class="passwordStrengthColor" class="text-xs font-medium">
                  {{ passwordStrengthText }}
                </span>
              </div>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">🔒</span>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <p v-if="formData.confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-600">
              Passwords do not match
            </p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="formData.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the
              <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">Terms of Service</a>
              and
              <a href="#" class="text-primary-600 hover:text-primary-500 font-medium">Privacy Policy</a>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {{ successMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
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
              <span class="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <!-- Social Signup Buttons -->
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

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Sign in
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
  name: 'Signup',
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        organization: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      passwordStrength: 0
    }
  },
  computed: {
    passwordsMatch() {
      return this.formData.password === this.formData.confirmPassword;
    },
    isFormValid() {
      return (
        this.formData.fullName &&
        this.formData.email &&
        this.formData.password &&
        this.formData.confirmPassword &&
        this.passwordsMatch &&
        this.formData.acceptTerms &&
        this.passwordStrength >= 2
      );
    },
    passwordStrengthWidth() {
      return `${(this.passwordStrength / 4) * 100}%`;
    },
    passwordStrengthColor() {
      const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-600'];
      return colors[this.passwordStrength] || 'text-gray-400';
    },
    passwordStrengthText() {
      const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
      return texts[this.passwordStrength] || '';
    }
  },
  methods: {
    validatePassword() {
      const password = this.formData.password;
      let strength = 0;

      if (password.length >= 8) strength++;
      if (password.length >= 12) strength++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[^a-zA-Z\d]/.test(password)) strength++;

      this.passwordStrength = Math.min(strength, 4);
    },
    async handleSignup() {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Validate passwords match
      if (!this.passwordsMatch) {
        this.errorMessage = 'Passwords do not match';
        this.isLoading = false;
        return;
      }

      // Validate password strength
      if (this.passwordStrength < 2) {
        this.errorMessage = 'Please choose a stronger password';
        this.isLoading = false;
        return;
      }

      try {
        // Connect to Django backend API
        const API_URL = 'http://localhost:8000/api/auth/register/';
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.formData.email, // Use email as username
            email: this.formData.email,
            password: this.formData.password,
            full_name: this.formData.fullName,
            organization: this.formData.organization
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.successMessage = 'Account created successfully! Redirecting...';

          // Store real auth token from backend
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userName', data.user.full_name || data.user.username);

          console.log('✅ Signup successful!');

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            this.$router.push('/dashboard');
          }, 1500);
        } else {
          this.errorMessage = data.error || 'Signup failed. Please try again.';
        }
      } catch (error) {
        console.error('Signup error:', error);
        if (error.message === 'Failed to fetch') {
          this.errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
        } else {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

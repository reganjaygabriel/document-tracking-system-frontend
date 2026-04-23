<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white flex-shrink-0">
      <div class="p-6">
        <h2 class="text-2xl font-bold">Admin Panel</h2>
      </div>
      
      <nav class="mt-6">
        <router-link to="/admin/dashboard" class="flex items-center px-6 py-3 hover:bg-white/10 transition-colors">
          <span class="mr-3">📊</span>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/users" class="flex items-center px-6 py-3 hover:bg-white/10 transition-colors">
          <span class="mr-3">👥</span>
          <span>User Management</span>
        </router-link>
        <router-link to="/admin/documents" class="flex items-center px-6 py-3 hover:bg-white/10 transition-colors">
          <span class="mr-3">📄</span>
          <span>Documents</span>
        </router-link>
        <router-link to="/admin/analytics" class="flex items-center px-6 py-3 hover:bg-white/10 transition-colors">
          <span class="mr-3">📈</span>
          <span>Analytics</span>
        </router-link>
        <router-link to="/admin/profile" class="flex items-center px-6 py-3 bg-white/20 border-l-4 border-white">
          <span class="mr-3">👤</span>
          <span>Profile</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="px-8 py-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
          
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <AdminNotifications />
            
            <!-- Profile -->
            <div class="flex items-center space-x-3">
              <div v-if="profilePictureUrl" class="w-10 h-10 rounded-full overflow-hidden">
                <img :src="profilePictureUrl" alt="Profile" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {{ userInitial }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
                <p class="text-xs text-indigo-600">Admin</p>
              </div>
            </div>

            <button @click="logout" class="text-red-600 hover:text-red-700 font-semibold">
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Profile Content -->
      <main class="p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Profile Picture Section -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
            
            <div class="flex items-center space-x-6">
              <!-- Current Profile Picture -->
              <div class="relative">
                <div v-if="profilePictureUrl" class="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100">
                  <img :src="profilePictureUrl" alt="Profile" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-indigo-100">
                  {{ userInitial }}
                </div>
                
                <!-- Delete Button (if picture exists) -->
                <button 
                  v-if="profilePictureUrl"
                  @click="deleteProfilePicture"
                  class="absolute bottom-0 right-0 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                  title="Delete profile picture"
                >
                  <span class="text-sm">✕</span>
                </button>
              </div>

              <!-- Upload Section -->
              <div class="flex-1">
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileSelect" 
                  accept="image/*"
                  class="hidden"
                >
                
                <button 
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {{ profilePictureUrl ? 'Change Picture' : 'Upload Picture' }}
                </button>
                
                <p class="text-sm text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
                
                <!-- Upload Progress -->
                <div v-if="isUploading" class="mt-3">
                  <div class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    <span class="text-sm text-gray-600">Uploading...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Information Section -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  v-model="profile.full_name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="profile.email"
                  type="email"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                >
                <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input 
                  v-model="profile.organization"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input 
                  value="Admin"
                  type="text"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                >
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button 
                  @click="$router.push('/admin/dashboard')"
                  class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  @click="updateProfile"
                  :disabled="isSaving"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script>
import AdminNotifications from '../../components/AdminNotifications.vue';
import ChatWidget from '../../components/ChatWidget.vue';

export default {
  name: 'AdminProfile',
  components: {
    AdminNotifications,
    ChatWidget
  },
  data() {
    return {
      userName: localStorage.getItem('userName') || 'Admin',
      profile: {
        full_name: '',
        email: '',
        organization: '',
        role: 'admin'
      },
      profilePictureUrl: null,
      isUploading: false,
      isSaving: false
    }
  },
  computed: {
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    }
  },
  mounted() {
    this.loadProfile();
    window.addEventListener('profileUpdated', this.loadProfile);
  },
  beforeUnmount() {
    window.removeEventListener('profileUpdated', this.loadProfile);
  },
  methods: {
    async loadProfile() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/auth/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.profile = data.user;
            this.profilePictureUrl = data.user.profile_picture_url;
            this.userName = data.user.full_name;
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    },
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      await this.uploadProfilePicture(file);
    },
    async uploadProfilePicture(file) {
      this.isUploading = true;
      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('profile_picture', file);

        const response = await fetch('http://localhost:8000/api/auth/profile/picture/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.profilePictureUrl = data.user.profile_picture_url;
            alert('Profile picture uploaded successfully!');
            window.dispatchEvent(new Event('profileUpdated'));
          }
        } else {
          alert('Failed to upload profile picture');
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture');
      } finally {
        this.isUploading = false;
      }
    },
    async deleteProfilePicture() {
      if (!confirm('Are you sure you want to delete your profile picture?')) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/auth/profile/picture/delete/', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          this.profilePictureUrl = null;
          alert('Profile picture deleted successfully!');
          window.dispatchEvent(new Event('profileUpdated'));
        } else {
          alert('Failed to delete profile picture');
        }
      } catch (error) {
        console.error('Error deleting profile picture:', error);
        alert('Error deleting profile picture');
      }
    },
    async updateProfile() {
      this.isSaving = true;
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/auth/profile/', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            full_name: this.profile.full_name,
            organization: this.profile.organization
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            alert('Profile updated successfully!');
            localStorage.setItem('userName', this.profile.full_name);
            this.userName = this.profile.full_name;
            window.dispatchEvent(new Event('profileUpdated'));
          }
        } else {
          alert('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      } finally {
        this.isSaving = false;
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/admin/login');
    }
  }
}
</script>

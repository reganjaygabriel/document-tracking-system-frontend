<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-gradient-to-b from-indigo-600 to-purple-700 shadow-lg">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-white">DocTrack Admin</h1>
        <p class="text-sm text-indigo-200">Administration Panel</p>
      </div>
      
      <nav class="mt-6">
        <router-link 
          to="/admin/dashboard"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          active-class="bg-white bg-opacity-20 border-r-4 border-white"
        >
          <span class="text-xl mr-3">📊</span>
          <span class="font-medium">Dashboard</span>
        </router-link>
        <router-link 
          to="/admin/users"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
        >
          <span class="text-xl mr-3">👥</span>
          <span class="font-medium">User Management</span>
        </router-link>
        <router-link 
          to="/admin/documents"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
        >
          <span class="text-xl mr-3">📄</span>
          <span class="font-medium">All Documents</span>
        </router-link>
        <router-link 
          to="/admin/analytics"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
        >
          <span class="text-xl mr-3">📈</span>
          <span class="font-medium">Analytics</span>
        </router-link>
      </nav>
      
      <!-- Admin Badge -->
      <div class="absolute bottom-6 left-6 right-6">
        <div class="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <p class="text-xs text-indigo-200">Logged in as</p>
          <p class="text-sm font-semibold text-white">Administrator</p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between px-8 py-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p class="text-sm text-gray-600">System Overview and Management</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button class="relative p-2 text-gray-600 hover:text-gray-800">
              <span class="text-2xl">🔔</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {{ userInitials }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                <p class="text-xs text-indigo-600 font-semibold">Admin</p>
              </div>
              <button 
                @click="handleLogout"
                class="ml-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="p-8">
        <!-- Admin Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Users</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalUsers }}</p>
                <p class="text-sm text-green-600 mt-2">{{ stats.activeUsers }} active</p>
              </div>
              <div class="text-4xl">👥</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Documents</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalDocuments }}</p>
                <p class="text-sm text-blue-600 mt-2">All users</p>
              </div>
              <div class="text-4xl">📄</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Pending Review</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.pendingDocuments }}</p>
                <p class="text-sm text-yellow-600 mt-2">Needs attention</p>
              </div>
              <div class="text-4xl">⏳</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Storage Used</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatStorage(stats.totalStorage) }}</p>
                <p class="text-sm text-purple-600 mt-2">System-wide</p>
              </div>
              <div class="text-4xl">💾</div>
            </div>
          </div>
        </div>

        <!-- Quick Admin Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button 
                @click="$router.push('/admin/users')"
                class="w-full flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <span class="text-2xl mr-3">👤</span>
                <span class="font-medium text-gray-700">Manage Users</span>
              </button>
              <button 
                @click="$router.push('/admin/documents')"
                class="w-full flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <span class="text-2xl mr-3">📁</span>
                <span class="font-medium text-gray-700">View All Documents</span>
              </button>
              <button 
                class="w-full flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <span class="text-2xl mr-3">📊</span>
                <span class="font-medium text-gray-700">Generate Report</span>
              </button>
              <button 
                class="w-full flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <span class="text-2xl mr-3">⚙️</span>
                <span class="font-medium text-gray-700">System Settings</span>
              </button>
            </div>
          </div>

          <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Document Status Overview</h3>
            <div class="space-y-4">
              <div v-for="status in documentStatus" :key="status.name">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">{{ status.name }}</span>
                  <span class="text-sm font-semibold text-gray-900">{{ status.count }} ({{ status.percentage }}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{ 
                      width: status.percentage + '%',
                      backgroundColor: getStatusColor(status.name)
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div class="text-center py-8 text-gray-500">
            <span class="text-4xl mb-2 block">📋</span>
            <p>Activity log coming soon...</p>
          </div>
        </div>
      </main>
    </div>

    <!-- User Management Modal (Placeholder) -->
    <div v-if="showUserManagement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      userName: '',
      userEmail: '',
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        totalDocuments: 0,
        pendingDocuments: 0,
        totalStorage: 0
      },
      documentStatus: []
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return 'A';
      
      const names = this.userName.trim().split(' ');
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  },
  mounted() {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      this.$router.push('/dashboard');
      return;
    }

    // Load user information
    this.userName = localStorage.getItem('userName') || 'Admin';
    this.userEmail = localStorage.getItem('userEmail') || 'admin@example.com';
    
    // Load admin statistics
    this.loadAdminStatistics();
  },
  methods: {
    async loadAdminStatistics() {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No auth token found');
          return;
        }

        // Load from admin statistics endpoint
        const response = await fetch('http://localhost:8000/api/admin/statistics/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.stats) {
            // Update stats
            this.stats.totalUsers = data.stats.total_users || 0;
            this.stats.activeUsers = data.stats.active_users || 0;
            this.stats.totalDocuments = data.stats.total_documents || 0;
            this.stats.pendingDocuments = data.stats.documents_by_status?.pending || 0;
            this.stats.totalStorage = data.stats.total_storage || 0;
            this.documentStatus = data.stats.status_distribution || [];
            
            console.log('Admin statistics loaded:', data.stats);
          }
        } else if (response.status === 403) {
          console.error('Access denied - not an admin');
          this.$router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    },
    getStatusColor(statusName) {
      const colors = {
        'Approved': '#10b981',
        'Pending': '#f59e0b',
        'In Review': '#3b82f6',
        'Rejected': '#ef4444'
      };
      return colors[statusName] || '#6b7280';
    },
    formatStorage(bytes) {
      if (bytes === 0) return '0 MB';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    handleLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      
      this.$router.push('/admin/login');
    }
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-xl shadow-md p-6;
}
</style>

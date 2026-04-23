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
          class="flex items-center px-6 py-3 text-white bg-white bg-opacity-20 border-r-4 border-white transition-colors duration-200"
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
            <h2 class="text-2xl font-bold text-gray-900">Analytics</h2>
            <p class="text-sm text-gray-600">System insights and performance metrics</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button 
              @click="loadAnalytics"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              :disabled="isLoading"
            >
              <span class="mr-2">🔄</span>
              <span>{{ isLoading ? 'Refreshing...' : 'Refresh Data' }}</span>
            </button>
            <AdminNotifications />
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

      <!-- Content -->
      <main class="p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p class="mt-4 text-gray-600 font-medium">Loading analytics...</p>
          </div>
        </div>

        <!-- Analytics Content -->
        <div v-else>
          <!-- Overview Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-100">Total Users</p>
                  <p class="text-4xl font-bold mt-2">{{ analytics.totalUsers }}</p>
                  <p class="text-sm text-blue-100 mt-2">+{{ analytics.newUsersThisMonth }} this month</p>
                </div>
                <div class="text-5xl opacity-80">👥</div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-100">Total Documents</p>
                  <p class="text-4xl font-bold mt-2">{{ analytics.totalDocuments }}</p>
                  <p class="text-sm text-green-100 mt-2">+{{ analytics.newDocumentsThisMonth }} this month</p>
                </div>
                <div class="text-5xl opacity-80">📄</div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-purple-100">Storage Used</p>
                  <p class="text-4xl font-bold mt-2">{{ formatStorage(analytics.totalStorage) }}</p>
                  <p class="text-sm text-purple-100 mt-2">{{ analytics.storagePercentage }}% capacity</p>
                </div>
                <div class="text-5xl opacity-80">💾</div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-orange-100">Active Users</p>
                  <p class="text-4xl font-bold mt-2">{{ analytics.activeUsers }}</p>
                  <p class="text-sm text-orange-100 mt-2">{{ analytics.activePercentage }}% of total</p>
                </div>
                <div class="text-5xl opacity-80">✅</div>
              </div>
            </div>
          </div>

          <!-- Charts Row 1 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Document Status Distribution -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Document Status Distribution</h3>
              <div class="space-y-4">
                <div v-for="status in analytics.statusDistribution" :key="status.name">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <span class="text-2xl mr-2">{{ getStatusIcon(status.name) }}</span>
                      <span class="text-sm font-medium text-gray-700">{{ status.name }}</span>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">{{ status.count }} ({{ status.percentage }}%)</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="h-3 rounded-full transition-all duration-500"
                      :style="{ 
                        width: status.percentage + '%',
                        backgroundColor: getStatusColor(status.name)
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Role Distribution -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">User Role Distribution</h3>
              <div class="flex items-center justify-center h-64">
                <div class="relative w-64 h-64">
                  <!-- Pie Chart Representation -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <p class="text-4xl font-bold text-gray-900">{{ analytics.totalUsers }}</p>
                      <p class="text-sm text-gray-600">Total Users</p>
                    </div>
                  </div>
                  <svg class="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      fill="none"
                      :stroke="'#8b5cf6'"
                      stroke-width="40"
                      :stroke-dasharray="`${analytics.adminPercentage * 6.28} 628`"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="100"
                      fill="none"
                      :stroke="'#3b82f6'"
                      stroke-width="40"
                      :stroke-dasharray="`${analytics.userPercentage * 6.28} 628`"
                      :stroke-dashoffset="`${-analytics.adminPercentage * 6.28}`"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex justify-center space-x-6 mt-4">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                  <span class="text-sm text-gray-700">Admins: {{ analytics.adminUsers }} ({{ analytics.adminPercentage }}%)</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span class="text-sm text-gray-700">Users: {{ analytics.regularUsers }} ({{ analytics.userPercentage }}%)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row 2 -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Top Users by Documents -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Users by Documents</h3>
              <div class="space-y-3">
                <div v-for="(user, index) in analytics.topUsers" :key="user.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mr-3">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-indigo-600">{{ user.documentCount }}</p>
                    <p class="text-xs text-gray-500">docs</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Document Categories -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Document Categories</h3>
              <div class="space-y-3">
                <div v-for="category in analytics.categories" :key="category.name" class="flex items-center justify-between">
                  <div class="flex items-center flex-1">
                    <span class="text-xl mr-2">{{ getCategoryIcon(category.name) }}</span>
                    <span class="text-sm font-medium text-gray-700">{{ category.name || 'Uncategorized' }}</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        class="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                        :style="{ width: category.percentage + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 w-12 text-right">{{ category.count }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity Summary -->
            <div class="bg-white rounded-xl shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">📤</span>
                    <span class="text-sm font-medium text-gray-700">Uploads Today</span>
                  </div>
                  <span class="text-xl font-bold text-blue-600">{{ analytics.uploadsToday }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">✅</span>
                    <span class="text-sm font-medium text-gray-700">Approved Today</span>
                  </div>
                  <span class="text-xl font-bold text-green-600">{{ analytics.approvedToday }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">⏳</span>
                    <span class="text-sm font-medium text-gray-700">Pending Review</span>
                  </div>
                  <span class="text-xl font-bold text-yellow-600">{{ analytics.pendingReview }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div class="flex items-center">
                    <span class="text-2xl mr-3">👤</span>
                    <span class="text-sm font-medium text-gray-700">New Users</span>
                  </div>
                  <span class="text-xl font-bold text-purple-600">{{ analytics.newUsersThisWeek }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- System Health -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <span class="text-3xl">✅</span>
                </div>
                <p class="text-sm font-medium text-gray-700">Database</p>
                <p class="text-xs text-green-600 font-semibold">Healthy</p>
              </div>
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <span class="text-3xl">💾</span>
                </div>
                <p class="text-sm font-medium text-gray-700">Storage</p>
                <p class="text-xs text-green-600 font-semibold">{{ analytics.storagePercentage }}% Used</p>
              </div>
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <span class="text-3xl">🚀</span>
                </div>
                <p class="text-sm font-medium text-gray-700">API</p>
                <p class="text-xs text-green-600 font-semibold">Online</p>
              </div>
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <span class="text-3xl">⚡</span>
                </div>
                <p class="text-sm font-medium text-gray-700">Performance</p>
                <p class="text-xs text-green-600 font-semibold">Optimal</p>
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
import AdminNotifications from '../../components/AdminNotifications.vue'
import ChatWidget from '../../components/ChatWidget.vue'

export default {
  name: 'AdminAnalytics',
  components: {
    AdminNotifications,
    ChatWidget
  },
  data() {
    return {
      userName: '',
      userEmail: '',
      isLoading: false,
      analytics: {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
        totalDocuments: 0,
        totalStorage: 0,
        newUsersThisMonth: 0,
        newDocumentsThisMonth: 0,
        newUsersThisWeek: 0,
        uploadsToday: 0,
        approvedToday: 0,
        pendingReview: 0,
        storagePercentage: 0,
        activePercentage: 0,
        adminPercentage: 0,
        userPercentage: 0,
        statusDistribution: [],
        topUsers: [],
        categories: []
      }
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

    this.userName = localStorage.getItem('userName') || 'Admin';
    this.userEmail = localStorage.getItem('userEmail') || 'admin@example.com';
    
    this.loadAnalytics();
  },
  methods: {
    async loadAnalytics() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No auth token found');
          return;
        }

        // Load analytics data from multiple endpoints
        const [statsResponse, usersResponse, documentsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/admin/statistics/', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/api/admin/users/', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/api/admin/documents/', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (statsResponse.ok && usersResponse.ok && documentsResponse.ok) {
          const statsData = await statsResponse.json();
          const usersData = await usersResponse.json();
          const documentsData = await documentsResponse.json();
          
          // Process statistics
          if (statsData.success && statsData.stats) {
            this.analytics.totalUsers = statsData.stats.total_users || 0;
            this.analytics.activeUsers = statsData.stats.active_users || 0;
            this.analytics.adminUsers = statsData.stats.admin_users || 0;
            this.analytics.regularUsers = statsData.stats.regular_users || 0;
            this.analytics.totalDocuments = statsData.stats.total_documents || 0;
            this.analytics.totalStorage = statsData.stats.total_storage || 0;
            this.analytics.pendingReview = statsData.stats.documents_by_status?.pending || 0;
            this.analytics.statusDistribution = statsData.stats.status_distribution || [];
            
            // Calculate percentages
            this.analytics.activePercentage = this.analytics.totalUsers > 0 
              ? Math.round((this.analytics.activeUsers / this.analytics.totalUsers) * 100) 
              : 0;
            this.analytics.adminPercentage = this.analytics.totalUsers > 0 
              ? Math.round((this.analytics.adminUsers / this.analytics.totalUsers) * 100) 
              : 0;
            this.analytics.userPercentage = 100 - this.analytics.adminPercentage;
            this.analytics.storagePercentage = Math.min(Math.round((this.analytics.totalStorage / (10 * 1024 * 1024 * 1024)) * 100), 100);
          }
          
          // Process users data
          if (usersData.success && usersData.users) {
            const users = usersData.users;
            
            // Calculate new users this month
            const now = new Date();
            const thisMonth = users.filter(u => {
              const joinDate = new Date(u.date_joined);
              return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
            });
            this.analytics.newUsersThisMonth = thisMonth.length;
            
            // Calculate new users this week
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const thisWeek = users.filter(u => new Date(u.date_joined) >= oneWeekAgo);
            this.analytics.newUsersThisWeek = thisWeek.length;
            
            // Get top users by document count
            this.analytics.topUsers = users
              .sort((a, b) => (b.document_count || 0) - (a.document_count || 0))
              .slice(0, 5)
              .map(u => ({
                id: u.id,
                name: u.full_name,
                email: u.email,
                documentCount: u.document_count || 0
              }));
          }
          
          // Process documents data
          if (documentsData.success && documentsData.documents) {
            const documents = documentsData.documents;
            
            // Calculate new documents this month
            const now = new Date();
            const thisMonth = documents.filter(d => {
              const createDate = new Date(d.created_at);
              return createDate.getMonth() === now.getMonth() && createDate.getFullYear() === now.getFullYear();
            });
            this.analytics.newDocumentsThisMonth = thisMonth.length;
            
            // Calculate uploads today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const uploadsToday = documents.filter(d => new Date(d.created_at) >= today);
            this.analytics.uploadsToday = uploadsToday.length;
            
            // Calculate approved today
            const approvedToday = documents.filter(d => {
              return d.status === 'Approved' && new Date(d.updated_at) >= today;
            });
            this.analytics.approvedToday = approvedToday.length;
            
            // Calculate category distribution
            const categoryMap = {};
            documents.forEach(d => {
              const cat = d.category || 'Uncategorized';
              categoryMap[cat] = (categoryMap[cat] || 0) + 1;
            });
            
            this.analytics.categories = Object.entries(categoryMap)
              .map(([name, count]) => ({
                name,
                count,
                percentage: Math.round((count / documents.length) * 100)
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);
          }
          
          console.log('Analytics loaded successfully');
        } else if (statsResponse.status === 403) {
          alert('Access denied - admin privileges required');
          this.$router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
        alert('Failed to load analytics data');
      } finally {
        this.isLoading = false;
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
    getStatusIcon(statusName) {
      const icons = {
        'Approved': '✅',
        'Pending': '⏳',
        'In Review': '🔍',
        'Rejected': '❌'
      };
      return icons[statusName] || '📄';
    },
    getCategoryIcon(categoryName) {
      const icons = {
        'Legal': '⚖️',
        'Financial': '💰',
        'HR': '👔',
        'Technical': '🔧',
        'Marketing': '📢',
        'Uncategorized': '📁'
      };
      return icons[categoryName] || '📄';
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
/* Add any custom styles here */
</style>

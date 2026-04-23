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
            <button 
              @click="toggleNotifications"
              class="relative p-2 text-gray-600 hover:text-gray-800"
            >
              <span class="text-2xl">🔔</span>
              <span 
                v-if="unreadCount > 0"
                class="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
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
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button 
              @click="loadRecentActivity"
              class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              🔄 Refresh
            </button>
          </div>
          
          <div v-if="isLoadingActivity" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600">Loading activity...</p>
          </div>
          
          <div v-else-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
            <span class="text-4xl mb-2 block">📋</span>
            <p>No recent activity</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div class="flex-shrink-0">
                <span class="text-2xl">{{ getActivityIcon(activity.type) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-600">{{ activity.description }}</p>
                <div class="flex items-center space-x-3 mt-1">
                  <span class="text-xs text-gray-500">{{ formatActivityTime(activity.timestamp) }}</span>
                  <span v-if="activity.user" class="text-xs text-indigo-600">{{ activity.user }}</span>
                </div>
              </div>
              <div class="flex-shrink-0">
                <span 
                  :class="getActivityBadgeClass(activity.type)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ activity.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Notifications Dropdown -->
    <div 
      v-if="showNotifications" 
      class="fixed top-16 right-8 w-96 bg-white rounded-xl shadow-2xl z-50 max-h-[600px] overflow-hidden"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
        <div class="flex items-center space-x-2">
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Mark all read
          </button>
          <button @click="showNotifications = false" class="text-gray-400 hover:text-gray-600">
            <span class="text-xl">✕</span>
          </button>
        </div>
      </div>
      
      <div class="overflow-y-auto max-h-[500px]">
        <div v-if="isLoadingNotifications" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
        
        <div v-else-if="notifications.length === 0" class="p-8 text-center">
          <span class="text-4xl mb-2 block">🔔</span>
          <p class="text-gray-600">No notifications</p>
        </div>
        
        <div v-else>
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            :class="[
              'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
              !notification.is_read ? 'bg-indigo-50' : ''
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-lg">{{ getNotificationIcon(notification.type) }}</span>
                  <h4 class="text-sm font-semibold text-gray-900">{{ notification.title }}</h4>
                  <span 
                    v-if="!notification.is_read"
                    class="w-2 h-2 bg-indigo-600 rounded-full"
                  ></span>
                </div>
                <p class="text-sm text-gray-700 mb-1">{{ notification.message }}</p>
                <div class="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{{ formatNotificationTime(notification.created_at) }}</span>
                  <span v-if="notification.related_user_name">• {{ notification.related_user_name }}</span>
                </div>
              </div>
              <button 
                @click.stop="deleteNotification(notification.id)"
                class="text-gray-400 hover:text-red-600 ml-2"
              >
                <span class="text-sm">🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Management Modal (Placeholder) -->
    <div v-if="showUserManagement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    </div>
    
    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script>
import ChatWidget from '../../components/ChatWidget.vue'

export default {
  name: 'AdminDashboard',
  components: {
    ChatWidget
  },
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
      documentStatus: [],
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      isLoadingNotifications: false,
      notificationInterval: null,
      recentActivity: [],
      isLoadingActivity: false,
      showUserManagement: false
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
    
    // Load notifications
    this.loadNotifications();
    
    // Load recent activity
    this.loadRecentActivity();
    
    // Poll for new notifications every 30 seconds
    this.notificationInterval = setInterval(() => {
      this.loadNotifications();
      this.loadRecentActivity();
    }, 30000);
  },
  beforeUnmount() {
    // Clear notification polling interval
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
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
    },
    async loadNotifications() {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) return;

        const response = await fetch('http://localhost:8000/api/notifications/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            this.notifications = data.notifications;
            this.unreadCount = data.unread_count;
          }
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications && this.notifications.length === 0) {
        this.loadNotifications();
      }
    },
    async handleNotificationClick(notification) {
      // Mark as read
      if (!notification.is_read) {
        await this.markAsRead(notification.id);
      }
      
      // Navigate to document if available
      if (notification.document_id) {
        this.$router.push('/admin/documents');
      }
    },
    async markAsRead(notificationId) {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/read/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Update local state
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.is_read = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    async markAllAsRead() {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch('http://localhost:8000/api/notifications/read-all/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Update local state
          this.notifications.forEach(n => n.is_read = true);
          this.unreadCount = 0;
        }
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    },
    async deleteNotification(notificationId) {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Remove from local state
          const index = this.notifications.findIndex(n => n.id === notificationId);
          if (index !== -1) {
            const wasUnread = !this.notifications[index].is_read;
            this.notifications.splice(index, 1);
            if (wasUnread) {
              this.unreadCount = Math.max(0, this.unreadCount - 1);
            }
          }
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    },
    getNotificationIcon(type) {
      const icons = {
        'document_upload': '📤',
        'status_change': '🔄',
        'document_shared': '🔗',
        'system': '⚙️'
      };
      return icons[type] || '🔔';
    },
    formatNotificationTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    },
    async loadRecentActivity() {
      this.isLoadingActivity = true;
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) return;

        // Fetch recent documents and users to build activity log
        const [docsResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:8000/api/admin/documents/', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/api/admin/users/', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (docsResponse.ok && usersResponse.ok) {
          const docsData = await docsResponse.json();
          const usersData = await usersResponse.json();
          
          const activities = [];
          
          // Add document activities
          if (docsData.success && docsData.documents) {
            const recentDocs = docsData.documents.slice(0, 10);
            
            recentDocs.forEach(doc => {
              activities.push({
                id: `doc-${doc.id}`,
                type: 'Upload',
                title: 'Document Uploaded',
                description: `${doc.owner_name} uploaded "${doc.name}"`,
                user: doc.owner_name,
                timestamp: doc.created_at
              });
              
              // Add status change activity if updated recently
              if (doc.updated_at !== doc.created_at) {
                activities.push({
                  id: `doc-update-${doc.id}`,
                  type: 'Status',
                  title: 'Status Changed',
                  description: `Document "${doc.name}" status changed to ${doc.status}`,
                  user: 'Admin',
                  timestamp: doc.updated_at
                });
              }
            });
          }
          
          // Add user activities
          if (usersData.success && usersData.users) {
            const recentUsers = usersData.users
              .sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined))
              .slice(0, 5);
            
            recentUsers.forEach(user => {
              activities.push({
                id: `user-${user.id}`,
                type: 'User',
                title: 'New User Registered',
                description: `${user.full_name} joined the system`,
                user: user.full_name,
                timestamp: user.date_joined
              });
            });
          }
          
          // Sort by timestamp (most recent first) and limit to 15
          this.recentActivity = activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 15);
        }
      } catch (error) {
        console.error('Error loading recent activity:', error);
      } finally {
        this.isLoadingActivity = false;
      }
    },
    getActivityIcon(type) {
      const icons = {
        'Upload': '📤',
        'Status': '🔄',
        'User': '👤',
        'Delete': '🗑️',
        'Edit': '✏️'
      };
      return icons[type] || '📋';
    },
    getActivityBadgeClass(type) {
      const classes = {
        'Upload': 'bg-blue-100 text-blue-800',
        'Status': 'bg-yellow-100 text-yellow-800',
        'User': 'bg-green-100 text-green-800',
        'Delete': 'bg-red-100 text-red-800',
        'Edit': 'bg-purple-100 text-purple-800'
      };
      return classes[type] || 'bg-gray-100 text-gray-800';
    },
    formatActivityTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.card {
  @apply bg-white rounded-xl shadow-md p-6;
}
</style>

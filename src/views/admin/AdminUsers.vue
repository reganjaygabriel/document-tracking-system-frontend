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
          class="flex items-center px-6 py-3 text-white bg-white bg-opacity-20 border-r-4 border-white transition-colors duration-200"
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
            <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
            <p class="text-sm text-gray-600">View and manage all system users</p>
          </div>
          
          <div class="flex items-center space-x-4">
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
        <!-- Filters and Stats -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <!-- Total Users -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-600">Total Users</p>
                  <p class="text-2xl font-bold text-blue-900 mt-1">{{ users.length }}</p>
                </div>
                <span class="text-3xl">👥</span>
              </div>
            </div>

            <!-- Active Users -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-600">Active Users</p>
                  <p class="text-2xl font-bold text-green-900 mt-1">{{ activeUsersCount }}</p>
                </div>
                <span class="text-3xl">✅</span>
              </div>
            </div>

            <!-- Admin Users -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-purple-600">Admins</p>
                  <p class="text-2xl font-bold text-purple-900 mt-1">{{ adminUsersCount }}</p>
                </div>
                <span class="text-3xl">🔐</span>
              </div>
            </div>

            <!-- Regular Users -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-orange-600">Regular Users</p>
                  <p class="text-2xl font-bold text-orange-900 mt-1">{{ regularUsersCount }}</p>
                </div>
                <span class="text-3xl">👤</span>
              </div>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="filters.search"
                  @input="filterUsers"
                  type="text"
                  placeholder="Search users..."
                  class="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

              <!-- Role Filter -->
              <select
                v-model="filters.role"
                @change="filterUsers"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Roles</option>
                <option value="user">Regular Users</option>
                <option value="admin">Admins</option>
              </select>

              <!-- Status Filter -->
              <select
                v-model="filters.status"
                @change="filterUsers"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button 
              @click="clearFilters"
              class="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div v-if="isLoading" class="p-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading users...</p>
          </div>

          <div v-else-if="filteredUsers.length === 0" class="p-12 text-center">
            <span class="text-6xl mb-4 block">👥</span>
            <p class="text-gray-600">No users found</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Organization</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Documents</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="user in filteredUsers" 
                  :key="user.id"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold mr-3">
                        {{ getInitials(user.full_name) }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ user.full_name }}</p>
                        <p class="text-xs text-gray-500">ID: {{ user.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-700">{{ user.email }}</td>
                  <td class="py-4 px-4 text-sm text-gray-700">{{ user.organization || 'N/A' }}</td>
                  <td class="py-4 px-4">
                    <span 
                      :class="getRoleClass(user.role)"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ user.role === 'admin' ? '🔐 Admin' : '👤 User' }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <span 
                      :class="getStatusClass(user.is_active)"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ user.is_active ? '✅ Active' : '❌ Inactive' }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-700 text-center">
                    {{ user.document_count || 0 }}
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ formatDate(user.date_joined) }}</td>
                  <td class="py-4 px-4">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewUser(user)"
                        class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors"
                        title="View Details"
                      >
                        View
                      </button>
                      <button 
                        @click="editUser(user)"
                        class="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs font-medium transition-colors"
                        title="Edit User"
                      >
                        Edit
                      </button>
                      <button 
                        v-if="user.id !== currentUserId"
                        @click="deleteUser(user)"
                        class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium transition-colors"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredUsers.length > 0" class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Showing <span class="font-medium">{{ filteredUsers.length }}</span> of <span class="font-medium">{{ users.length }}</span> users
          </p>
        </div>
      </main>
    </div>

    <!-- View User Modal -->
    <div v-if="selectedUser && showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">User Details</h2>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="text-2xl">✕</span>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
              {{ getInitials(selectedUser.full_name) }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ selectedUser.full_name }}</h3>
              <p class="text-gray-600">{{ selectedUser.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">User ID:</label>
              <p class="text-gray-900">{{ selectedUser.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Username:</label>
              <p class="text-gray-900">{{ selectedUser.username }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Organization:</label>
              <p class="text-gray-900">{{ selectedUser.organization || 'Not specified' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Role:</label>
              <span :class="getRoleClass(selectedUser.role)" class="px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1">
                {{ selectedUser.role === 'admin' ? '🔐 Admin' : '👤 User' }}
              </span>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status:</label>
              <span :class="getStatusClass(selectedUser.is_active)" class="px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1">
                {{ selectedUser.is_active ? '✅ Active' : '❌ Inactive' }}
              </span>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Documents:</label>
              <p class="text-gray-900">{{ selectedUser.document_count || 0 }} documents</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Joined:</label>
              <p class="text-gray-900">{{ formatDate(selectedUser.date_joined) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Last Login:</label>
              <p class="text-gray-900">{{ formatDate(selectedUser.last_login) }}</p>
            </div>
          </div>

          <div class="flex space-x-3 pt-4 border-t">
            <button 
              @click="editUser(selectedUser); showViewModal = false"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit User
            </button>
            <button 
              @click="showViewModal = false"
              class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script>
import AdminNotifications from '../../components/AdminNotifications.vue'
import ChatWidget from '../../components/ChatWidget.vue'

export default {
  name: 'AdminUsers',
  components: {
    AdminNotifications,
    ChatWidget
  },
  data() {
    return {
      userName: '',
      userEmail: '',
      currentUserId: null,
      users: [],
      filteredUsers: [],
      isLoading: false,
      showViewModal: false,
      showEditModal: false,
      selectedUser: null,
      filters: {
        search: '',
        role: '',
        status: ''
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
    },
    activeUsersCount() {
      return this.users.filter(u => u.is_active).length;
    },
    adminUsersCount() {
      return this.users.filter(u => u.role === 'admin').length;
    },
    regularUsersCount() {
      return this.users.filter(u => u.role === 'user').length;
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
    
    // Get current user ID from email
    this.getCurrentUserId();
    
    this.loadUsers();
  },
  methods: {
    async getCurrentUserId() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/auth/me/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.currentUserId = data.user.id;
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    },
    async loadUsers() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No auth token found');
          return;
        }

        const response = await fetch('http://localhost:8000/api/admin/users/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.users) {
            this.users = data.users;
            this.filteredUsers = data.users;
            console.log('Loaded users:', this.users.length);
          }
        } else if (response.status === 403) {
          alert('Access denied - admin privileges required');
          this.$router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        this.isLoading = false;
      }
    },
    filterUsers() {
      let filtered = this.users;
      
      // Search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        filtered = filtered.filter(user => 
          user.full_name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          (user.organization && user.organization.toLowerCase().includes(search))
        );
      }
      
      // Role filter
      if (this.filters.role) {
        filtered = filtered.filter(user => user.role === this.filters.role);
      }
      
      // Status filter
      if (this.filters.status) {
        const isActive = this.filters.status === 'active';
        filtered = filtered.filter(user => user.is_active === isActive);
      }
      
      this.filteredUsers = filtered;
    },
    clearFilters() {
      this.filters = {
        search: '',
        role: '',
        status: ''
      };
      this.filteredUsers = this.users;
    },
    viewUser(user) {
      this.selectedUser = user;
      this.showViewModal = true;
    },
    editUser(user) {
      alert('Edit user functionality coming soon!');
      // TODO: Implement edit modal
    },
    async deleteUser(user) {
      if (!confirm(`Are you sure you want to delete user "${user.full_name}"?`)) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/admin/users/${user.id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('User deleted successfully');
          this.loadUsers();
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting user');
      }
    },
    getInitials(name) {
      if (!name) return 'U';
      const names = name.trim().split(' ');
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    },
    getRoleClass(role) {
      return role === 'admin' 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-blue-100 text-blue-800';
    },
    getStatusClass(isActive) {
      return isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    },
    formatDate(dateString) {
      if (!dateString) return 'Never';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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

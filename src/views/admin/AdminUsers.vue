<template>
  <div class="flex flex-col lg:flex-row h-screen bg-gray-50">
    <!-- Mobile Menu Button -->
    <button 
      @click="showMobileMenu = !showMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
    >
      <span class="text-2xl">{{ showMobileMenu ? '✕' : '☰' }}</span>
    </button>

    <!-- Admin Sidebar -->
    <aside 
      :class="[
        'w-64 bg-gradient-to-b from-indigo-600 to-purple-700 shadow-lg transition-transform duration-300 lg:relative fixed inset-y-0 left-0 z-40',
        showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="p-6">
        <h1 class="text-xl lg:text-2xl font-bold text-white">TraceDocs Admin</h1>
        <p class="text-xs lg:text-sm text-indigo-200">Administration Panel</p>
      </div>
      
      <nav class="mt-6">
        <router-link 
          to="/admin/dashboard"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">📊</span>
          <span class="font-medium">Dashboard</span>
        </router-link>
        <router-link 
          to="/admin/users"
          class="flex items-center px-6 py-3 text-white bg-white bg-opacity-20 border-r-4 border-white transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">👥</span>
          <span class="font-medium">User Management</span>
        </router-link>
        <router-link 
          to="/admin/documents"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">📄</span>
          <span class="font-medium">All Documents</span>
        </router-link>
        <router-link 
          to="/admin/analytics"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">📈</span>
          <span class="font-medium">Analytics</span>
        </router-link>
        <router-link 
          to="/admin/archive"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">🗄️</span>
          <span class="font-medium">Archive</span>
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

    <!-- Overlay for mobile menu -->
    <div 
      v-if="showMobileMenu"
      @click="showMobileMenu = false"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-20">
        <div class="flex items-center justify-between px-4 lg:px-8 py-4">
          <div class="ml-12 lg:ml-0">
            <h2 class="text-lg lg:text-2xl font-bold text-gray-900">User Management</h2>
            <p class="text-xs lg:text-sm text-gray-600 hidden sm:block">View and manage all system users</p>
          </div>
          
          <div class="flex items-center space-x-2 lg:space-x-4">
            <AdminNotifications />
            <div class="hidden sm:flex items-center space-x-3">
              <div class="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm lg:text-base">
                {{ userInitials }}
              </div>
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                <p class="text-xs text-indigo-600 font-semibold">Admin</p>
              </div>
              <button 
                @click="handleLogout"
                class="ml-2 px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
            <!-- Mobile logout -->
            <button 
              @click="handleLogout"
              class="sm:hidden p-2 text-red-600 hover:text-red-700"
            >
              <span class="text-xl">🚪</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-4 lg:p-8">
        <!-- Filters and Stats -->
        <div class="bg-white rounded-xl shadow-md p-4 lg:p-6 mb-4 lg:mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
            <!-- Total Users -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 lg:p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs lg:text-sm font-medium text-blue-600">Total Users</p>
                  <p class="text-xl lg:text-2xl font-bold text-blue-900 mt-1">{{ users.length }}</p>
                </div>
                <span class="text-2xl lg:text-3xl">👥</span>
              </div>
            </div>

            <!-- Active Users -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 lg:p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs lg:text-sm font-medium text-green-600">Active Users</p>
                  <p class="text-xl lg:text-2xl font-bold text-green-900 mt-1">{{ activeUsersCount }}</p>
                </div>
                <span class="text-2xl lg:text-3xl">✅</span>
              </div>
            </div>

            <!-- Admin Users -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 lg:p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs lg:text-sm font-medium text-purple-600">Admins</p>
                  <p class="text-xl lg:text-2xl font-bold text-purple-900 mt-1">{{ adminUsersCount }}</p>
                </div>
                <span class="text-2xl lg:text-3xl">🔐</span>
              </div>
            </div>

            <!-- Regular Users -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 lg:p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs lg:text-sm font-medium text-orange-600">Regular Users</p>
                  <p class="text-xl lg:text-2xl font-bold text-orange-900 mt-1">{{ regularUsersCount }}</p>
                </div>
                <span class="text-2xl lg:text-3xl">👤</span>
              </div>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-0">
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:space-x-4 flex-1">
              <!-- Search -->
              <div class="relative flex-1 lg:flex-initial">
                <input
                  v-model="filters.search"
                  @input="filterUsers"
                  type="text"
                  placeholder="Search users..."
                  class="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base"
                />
                <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

              <!-- Role Filter -->
              <select
                v-model="filters.role"
                @change="filterUsers"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base"
              >
                <option value="">All Roles</option>
                <option value="user">Regular Users</option>
                <option value="admin">Admins</option>
              </select>

              <!-- Status Filter -->
              <select
                v-model="filters.status"
                @change="filterUsers"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button 
              @click="clearFilters"
              class="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm lg:text-base"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div v-if="isLoading" class="p-8 lg:p-12 text-center">
            <div class="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-4 text-gray-600 text-sm lg:text-base">Loading users...</p>
          </div>

          <div v-else-if="filteredUsers.length === 0" class="p-8 lg:p-12 text-center">
            <span class="text-5xl lg:text-6xl mb-4 block">👥</span>
            <p class="text-gray-600 text-sm lg:text-base">No users found</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[800px]">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">User</th>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Email</th>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden md:table-cell">Organization</th>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Role</th>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden sm:table-cell">Documents</th>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700 hidden lg:table-cell">Joined</th>
                  <th class="text-left py-3 px-3 lg:px-4 text-xs lg:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="user in filteredUsers" 
                  :key="user.id"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-3 lg:py-4 px-3 lg:px-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold mr-2 lg:mr-3 text-xs lg:text-base">
                        {{ getInitials(user.full_name) }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 text-xs lg:text-sm">{{ user.full_name }}</p>
                        <p class="text-xs text-gray-500">ID: {{ user.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 lg:py-4 px-3 lg:px-4 text-xs lg:text-sm text-gray-700">{{ user.email }}</td>
                  <td class="py-3 lg:py-4 px-3 lg:px-4 text-xs lg:text-sm text-gray-700 hidden md:table-cell">{{ user.organization || 'N/A' }}</td>
                  <td class="py-3 lg:py-4 px-3 lg:px-4">
                    <span 
                      :class="getRoleClass(user.role)"
                      class="px-2 lg:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                    >
                      {{ user.role === 'admin' ? '🔐 Admin' : '👤 User' }}
                    </span>
                  </td>
                  <td class="py-3 lg:py-4 px-3 lg:px-4">
                    <span 
                      :class="getStatusClass(user.is_active)"
                      class="px-2 lg:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                    >
                      {{ user.is_active ? '✅ Active' : '❌ Inactive' }}
                    </span>
                  </td>
                  <td class="py-3 lg:py-4 px-3 lg:px-4 text-xs lg:text-sm text-gray-700 text-center hidden sm:table-cell">
                    {{ user.document_count || 0 }}
                  </td>
                  <td class="py-3 lg:py-4 px-3 lg:px-4 text-xs lg:text-sm text-gray-600 hidden lg:table-cell">{{ formatDate(user.date_joined) }}</td>
                  <td class="py-3 lg:py-4 px-3 lg:px-4">
                    <div class="flex flex-wrap gap-1 lg:gap-2">
                      <button 
                        @click="viewUser(user)"
                        class="px-2 lg:px-3 py-1 lg:py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors whitespace-nowrap"
                        title="View Details"
                      >
                        View
                      </button>
                      <button 
                        @click="editUser(user)"
                        class="px-2 lg:px-3 py-1 lg:py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs font-medium transition-colors whitespace-nowrap"
                        title="Edit User"
                      >
                        Edit
                      </button>
                      <button 
                        @click="chatWithUser(user)"
                        class="px-2 lg:px-3 py-1 lg:py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-medium transition-colors flex items-center space-x-1 whitespace-nowrap"
                        title="Chat with User"
                      >
                        <span>💬</span>
                        <span class="hidden sm:inline">Chat</span>
                      </button>
                      <button 
                        v-if="user.id !== currentUserId"
                        @click="deleteUser(user)"
                        class="px-2 lg:px-3 py-1 lg:py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium transition-colors whitespace-nowrap"
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

    <!-- Edit User Modal -->
    <div v-if="selectedUser && showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between p-6 border-b border-gray-200 sticky top-0">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span class="text-2xl">✏️</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Edit User</h2>
              <p class="text-sm text-gray-600">Update user information</p>
            </div>
          </div>
          <button @click="cancelEdit" class="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all">
            <span class="text-2xl">✕</span>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="updateUser" class="p-6 space-y-5">
          <!-- User Avatar Preview -->
          <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
              {{ getInitials(editForm.full_name || selectedUser.full_name) }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">User ID: {{ selectedUser.id }}</p>
              <p class="text-xs text-gray-500">Editing: {{ selectedUser.email }}</p>
            </div>
          </div>

          <!-- Full Name -->
          <div>
            <label for="edit_full_name" class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="mr-2">👤</span>Full Name *
            </label>
            <input
              id="edit_full_name"
              v-model="editForm.full_name"
              type="text"
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter full name"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="edit_email" class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="mr-2">📧</span>Email Address *
            </label>
            <input
              id="edit_email"
              v-model="editForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter email address"
            />
          </div>

          <!-- Username -->
          <div>
            <label for="edit_username" class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="mr-2">🔑</span>Username *
            </label>
            <input
              id="edit_username"
              v-model="editForm.username"
              type="text"
              required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter username"
            />
          </div>

          <!-- Organization -->
          <div>
            <label for="edit_organization" class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="mr-2">🏢</span>Organization
            </label>
            <input
              id="edit_organization"
              v-model="editForm.organization"
              type="text"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter organization (optional)"
            />
          </div>

          <!-- Role -->
          <div>
            <label for="edit_role" class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="mr-2">🔐</span>User Role *
            </label>
            <select
              id="edit_role"
              v-model="editForm.role"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
            >
              <option value="user">👤 Regular User</option>
              <option value="admin">🔐 Administrator</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="mr-2">✅</span>Account Status
            </label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  :value="true"
                  v-model="editForm.is_active"
                  class="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm font-medium text-gray-700">✅ Active</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  :value="false"
                  v-model="editForm.is_active"
                  class="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span class="text-sm font-medium text-gray-700">❌ Inactive</span>
              </label>
            </div>
          </div>

          <!-- Info Box -->
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div class="flex items-start">
              <span class="text-xl mr-2">ℹ️</span>
              <div>
                <p class="text-sm font-medium text-blue-900 mb-1">Update Information</p>
                <p class="text-sm text-blue-700">
                  Changes will be saved immediately. Make sure all information is correct before updating.
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="updateError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex items-start">
              <span class="text-xl mr-2">⚠️</span>
              <div>
                <p class="text-sm font-medium text-red-900 mb-1">Update Failed</p>
                <p class="text-sm text-red-700">{{ updateError }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <button 
              type="button"
              @click="cancelEdit"
              :disabled="isUpdating"
              class="w-full sm:flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isUpdating"
              class="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <span v-if="!isUpdating" class="flex items-center">
                <span class="mr-2">💾</span>
                Save Changes
              </span>
              <span v-else class="flex items-center">
                <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script>
import AdminNotifications from '../../components/AdminNotifications.vue'
import ChatWidget from '../../components/ChatWidget.vue'
import eventBus from '../../eventBus.js'

export default {
  name: 'AdminUsers',
  components: {
    AdminNotifications,
    ChatWidget
  },
  data() {
    return {
      showMobileMenu: false,
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
      },
      // Edit form
      editForm: {
        full_name: '',
        email: '',
        username: '',
        organization: '',
        role: 'user',
        is_active: true
      },
      isUpdating: false,
      updateError: ''
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
          console.error('No auth token found');
          alert('No authentication token found. Please log in again.');
          return;
        }

        console.log('Fetching users from API...');
        const response = await fetch('http://localhost:8000/api/admin/users/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          
          if (data.success && data.users) {
            this.users = data.users;
            this.filteredUsers = data.users;
            console.log('Loaded users:', this.users.length);
          } else {
            console.error('API returned success=false or no users array');
            alert('Failed to load users: Invalid response format');
          }
        } else if (response.status === 403) {
          console.error('Access denied - 403');
          alert('Access denied - admin privileges required');
          this.$router.push('/dashboard');
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          alert(`Failed to load users: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        alert('Error loading users: ' + error.message);
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
      this.selectedUser = user;
      this.editForm = {
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        organization: user.organization || '',
        role: user.role,
        is_active: user.is_active
      };
      this.updateError = '';
      this.showEditModal = true;
    },
    async updateUser() {
      this.isUpdating = true;
      this.updateError = '';

      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/admin/users/${this.selectedUser.id}/update/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editForm)
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            // Update local user data
            const index = this.users.findIndex(u => u.id === this.selectedUser.id);
            if (index !== -1) {
              this.users[index] = { ...this.users[index], ...this.editForm };
            }
            
            // Reapply filters
            this.filterUsers();
            
            // Close modal
            this.showEditModal = false;
            this.selectedUser = null;
            
            alert('User updated successfully!');
          } else {
            this.updateError = data.message || 'Failed to update user';
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          this.updateError = errorData.message || `Error: ${response.status}`;
        }
      } catch (error) {
        console.error('Update error:', error);
        this.updateError = 'Network error: ' + error.message;
      } finally {
        this.isUpdating = false;
      }
    },
    cancelEdit() {
      this.showEditModal = false;
      this.selectedUser = null;
      this.updateError = '';
    },
    chatWithUser(user) {
      // Emit event to open chat with specific user
      eventBus.$emit('openChatWithUser', {
        userId: user.id,
        userName: user.full_name
      });
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

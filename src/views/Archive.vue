<template>
  <div class="flex flex-col lg:flex-row h-screen bg-gray-50">
    <!-- Mobile Menu Button -->
    <button 
      @click="showMobileMenu = !showMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-lg shadow-lg"
    >
      <span class="text-2xl">{{ showMobileMenu ? '✕' : '☰' }}</span>
    </button>

    <!-- Sidebar -->
    <aside 
      :class="[
        'w-64 bg-white shadow-lg transition-transform duration-300 lg:relative fixed inset-y-0 left-0 z-40',
        showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="p-6">
        <h1 class="text-xl lg:text-2xl font-bold text-primary-600">TraceDocs</h1>
        <p class="text-xs lg:text-sm text-gray-500">Document Management</p>
      </div>
      
      <nav class="mt-6">
        <router-link 
          to="/dashboard"
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">📊</span>
          <span class="font-medium">Dashboard</span>
        </router-link>
        <router-link 
          to="/documents"
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">📄</span>
          <span class="font-medium">Documents</span>
        </router-link>
        <router-link 
          to="/archive"
          class="flex items-center px-6 py-3 bg-primary-50 text-primary-600 border-r-4 border-primary-600 transition-colors duration-200"
          @click="showMobileMenu = false"
        >
          <span class="text-xl mr-3">🗄️</span>
          <span class="font-medium">Archive</span>
        </router-link>
      </nav>
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
            <h2 class="text-lg lg:text-2xl font-bold text-gray-900">My Archive</h2>
            <p class="text-xs lg:text-sm text-gray-500 mt-1 hidden sm:block">Recover your deleted documents</p>
          </div>
          
          <div class="flex items-center space-x-2 lg:space-x-4">
            <UserNotifications />
            <div class="hidden sm:flex items-center space-x-3">
              <div class="w-8 h-8 lg:w-10 lg:h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm lg:text-base">
                {{ userInitials }}
              </div>
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                <p class="text-xs text-gray-500">{{ userEmail }}</p>
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
        <!-- Info Banner -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div class="flex items-start">
            <span class="text-2xl mr-3">ℹ️</span>
            <div>
              <h3 class="text-sm font-semibold text-blue-900">About Archive</h3>
              <p class="text-sm text-blue-700 mt-1">
                Your deleted documents are stored here. You can restore them back to your documents or permanently delete them.
              </p>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                v-model="filters.search"
                @input="loadArchivedDocuments"
                type="text"
                placeholder="Search archived documents..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="filters.status"
                @change="loadArchivedDocuments"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="filters.category"
                @change="loadArchivedDocuments"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option value="Financial Reports">Financial Reports</option>
                <option value="Contracts">Contracts</option>
                <option value="Proposals">Proposals</option>
                <option value="Presentations">Presentations</option>
                <option value="Technical Documents">Technical Documents</option>
                <option value="Scanned Documents">Scanned Documents</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              <span class="font-semibold">{{ documents.length }}</span> archived documents
            </p>
            <button 
              @click="clearFilters"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Archived Documents Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div v-if="isLoading" class="p-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading archived documents...</p>
          </div>

          <div v-else-if="documents.length === 0" class="p-12 text-center">
            <span class="text-6xl mb-4 block">🗄️</span>
            <p class="text-gray-600">No archived documents found</p>
            <p class="text-sm text-gray-500 mt-2">Deleted documents will appear here</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Document</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Archived</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="doc in documents" 
                  :key="doc.id"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <span class="text-2xl mr-3">{{ getFileIcon(doc.file_type) }}</span>
                      <div>
                        <p class="font-medium text-gray-900">{{ doc.name }}</p>
                        <p class="text-xs text-gray-500">{{ doc.original_filename }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-700">{{ doc.file_type }}</td>
                  <td class="py-4 px-4">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="getStatusClass(doc.status)"
                    >
                      {{ doc.status }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ formatDate(doc.archived_at) }}</td>
                  <td class="py-4 px-4">
                    <div class="flex space-x-2">
                      <button 
                        @click="restoreDocument(doc)"
                        class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium transition-colors"
                        title="Restore Document"
                      >
                        ↩️ Restore
                      </button>
                      <button 
                        @click="viewDocument(doc)"
                        class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors"
                        title="View Details"
                      >
                        View
                      </button>
                      <button 
                        @click="permanentlyDeleteDocument(doc)"
                        class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium transition-colors"
                        title="Permanently Delete"
                      >
                        🗑️ Delete Forever
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- View Document Modal -->
    <div v-if="selectedDocument && showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Archived Document Details</h2>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600">
            <span class="text-2xl">✕</span>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Document Name:</label>
              <p class="text-gray-900">{{ selectedDocument.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">File Type:</label>
              <p class="text-gray-900">{{ selectedDocument.file_type }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status:</label>
              <span :class="getStatusClass(selectedDocument.status)" class="px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1">
                {{ selectedDocument.status }}
              </span>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Archived:</label>
              <p class="text-gray-900">{{ formatDate(selectedDocument.archived_at) }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Description:</label>
              <p class="text-gray-900">{{ selectedDocument.description || 'No description' }}</p>
            </div>
          </div>
          <div class="flex space-x-3 pt-4 border-t">
            <button 
              @click="restoreDocument(selectedDocument); showViewModal = false"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <span class="mr-2">↩️</span>
              Restore
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
import UserNotifications from '../components/UserNotifications.vue'
import ChatWidget from '../components/ChatWidget.vue'

export default {
  name: 'Archive',
  components: {
    UserNotifications,
    ChatWidget
  },
  data() {
    return {
      showMobileMenu: false,
      userName: '',
      userEmail: '',
      documents: [],
      isLoading: false,
      filters: {
        search: '',
        status: '',
        category: ''
      },
      selectedDocument: null,
      showViewModal: false
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return 'U';
      const names = this.userName.trim().split(' ');
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  },
  mounted() {
    // Check if user is authenticated
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      this.$router.push('/admin/archive');
      return;
    }

    this.userName = localStorage.getItem('userName') || 'User';
    this.userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    
    this.loadArchivedDocuments();
  },
  methods: {
    async loadArchivedDocuments() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No auth token found');
          return;
        }

        // Build query string
        const params = new URLSearchParams();
        if (this.filters.search) params.append('search', this.filters.search);
        if (this.filters.status) params.append('status', this.filters.status);
        if (this.filters.category) params.append('category', this.filters.category);

        const queryString = params.toString();
        const url = `http://localhost:8000/api/documents/archived/${queryString ? '?' + queryString : ''}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.documents) {
            this.documents = data.documents;
            console.log('Loaded archived documents:', this.documents.length);
          }
        } else if (response.status === 401) {
          alert('Session expired. Please login again.');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error loading archived documents:', error);
      } finally {
        this.isLoading = false;
      }
    },
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        category: ''
      };
      this.loadArchivedDocuments();
    },
    async restoreDocument(doc) {
      if (!confirm(`Are you sure you want to restore "${doc.name}"?`)) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/documents/${doc.id}/restore/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Document restored successfully');
          this.loadArchivedDocuments();
        } else {
          alert('Failed to restore document');
        }
      } catch (error) {
        console.error('Restore error:', error);
        alert('Error restoring document');
      }
    },
    async permanentlyDeleteDocument(doc) {
      if (!confirm(`⚠️ WARNING: This will PERMANENTLY delete "${doc.name}".\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?`)) {
        return;
      }

      // Double confirmation for permanent delete
      if (!confirm(`Final confirmation: Delete "${doc.name}" forever?`)) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/documents/${doc.id}/permanent-delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Document permanently deleted');
          this.loadArchivedDocuments();
        } else {
          alert('Failed to delete document');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting document');
      }
    },
    viewDocument(doc) {
      this.selectedDocument = doc;
      this.showViewModal = true;
    },
    getStatusClass(status) {
      const classes = {
        'Approved': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'In Review': 'bg-blue-100 text-blue-800',
        'Rejected': 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    getFileIcon(fileType) {
      const icons = {
        'PDF': '📕',
        'DOC': '📘', 'DOCX': '📘',
        'XLS': '📗', 'XLSX': '📗',
        'PPT': '📙', 'PPTX': '📙',
        'JPG': '🖼️', 'JPEG': '🖼️', 'PNG': '🖼️', 'GIF': '🖼️',
        'TXT': '📄',
        'CSV': '📊'
      };
      return icons[fileType] || '📄';
    },
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
    handleLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      
      this.$router.push('/login');
    }
  }
}
</script>

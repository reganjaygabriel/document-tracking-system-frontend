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
        <a 
          href="#"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
        >
          <span class="text-xl mr-3">👥</span>
          <span class="font-medium">User Management</span>
        </a>
        <router-link 
          to="/admin/documents"
          class="flex items-center px-6 py-3 text-white bg-white bg-opacity-20 border-r-4 border-white transition-colors duration-200"
        >
          <span class="text-xl mr-3">📄</span>
          <span class="font-medium">All Documents</span>
        </router-link>
        <a 
          href="#"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
        >
          <span class="text-xl mr-3">📈</span>
          <span class="font-medium">Analytics</span>
        </a>
        <a 
          href="#"
          class="flex items-center px-6 py-3 text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
        >
          <span class="text-xl mr-3">⚙️</span>
          <span class="font-medium">Settings</span>
        </a>
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
            <h2 class="text-2xl font-bold text-gray-900">All Documents</h2>
            <p class="text-sm text-gray-600">View and manage documents from all users</p>
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

      <!-- Content -->
      <main class="p-8">
        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                v-model="filters.search"
                @input="loadDocuments"
                type="text"
                placeholder="Search documents..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="filters.status"
                @change="loadDocuments"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                @change="loadDocuments"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            <!-- Owner Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Owner</label>
              <input
                v-model="filters.owner"
                @input="loadDocuments"
                type="text"
                placeholder="Filter by owner..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Showing <span class="font-semibold">{{ documents.length }}</span> documents
            </p>
            <button 
              @click="clearFilters"
              class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Documents Table -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div v-if="isLoading" class="p-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading documents...</p>
          </div>

          <div v-else-if="documents.length === 0" class="p-12 text-center">
            <span class="text-6xl mb-4 block">📄</span>
            <p class="text-gray-600">No documents found</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Document</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
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
                  <td class="py-4 px-4">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ doc.owner_name }}</p>
                      <p class="text-xs text-gray-500">{{ doc.owner_email }}</p>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-700">{{ doc.file_type }}</td>
                  <td class="py-4 px-4 text-sm text-gray-700">{{ doc.category || 'Uncategorized' }}</td>
                  <td class="py-4 px-4">
                    <select
                      :value="doc.status"
                      @change="updateDocumentStatus(doc, $event.target.value)"
                      class="px-3 py-1 rounded-full text-xs font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      :class="getStatusClass(doc.status)"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ formatFileSize(doc.file_size) }}</td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ formatDate(doc.created_at) }}</td>
                  <td class="py-4 px-4">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewDocument(doc)"
                        class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors"
                        title="View Document"
                      >
                        View
                      </button>
                      <button 
                        @click="downloadDocument(doc)"
                        class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium transition-colors"
                        title="Download"
                      >
                        Download
                      </button>
                      <button 
                        @click="deleteDocument(doc)"
                        class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium transition-colors"
                        title="Delete"
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
      </main>
    </div>

    <!-- View Document Modal -->
    <div v-if="selectedDocument && showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Document Details</h2>
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
              <label class="text-sm font-medium text-gray-700">Owner:</label>
              <p class="text-gray-900">{{ selectedDocument.owner_name }}</p>
              <p class="text-xs text-gray-500">{{ selectedDocument.owner_email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status:</label>
              <span :class="getStatusClass(selectedDocument.status)" class="px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1">
                {{ selectedDocument.status }}
              </span>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Category:</label>
              <p class="text-gray-900">{{ selectedDocument.category || 'Uncategorized' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Size:</label>
              <p class="text-gray-900">{{ formatFileSize(selectedDocument.file_size) }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Description:</label>
              <p class="text-gray-900">{{ selectedDocument.description || 'No description' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Created:</label>
              <p class="text-gray-900">{{ formatDate(selectedDocument.created_at) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Last Modified:</label>
              <p class="text-gray-900">{{ formatDate(selectedDocument.updated_at) }}</p>
            </div>
          </div>
          <div class="flex space-x-3 pt-4 border-t">
            <button 
              @click="downloadDocument(selectedDocument)"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <span class="mr-2">⬇️</span>
              Download
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
  </div>
</template>

<script>
export default {
  name: 'AdminDocuments',
  data() {
    return {
      userName: '',
      userEmail: '',
      documents: [],
      isLoading: false,
      filters: {
        search: '',
        status: '',
        category: '',
        owner: ''
      },
      selectedDocument: null,
      showViewModal: false
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
    
    this.loadDocuments();
  },
  methods: {
    async loadDocuments() {
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
        const url = `http://localhost:8000/api/admin/documents/${queryString ? '?' + queryString : ''}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.documents) {
            this.documents = data.documents;
            
            // Apply owner filter on frontend (if needed)
            if (this.filters.owner) {
              this.documents = this.documents.filter(doc => 
                doc.owner_name.toLowerCase().includes(this.filters.owner.toLowerCase()) ||
                doc.owner_email.toLowerCase().includes(this.filters.owner.toLowerCase())
              );
            }
            
            console.log('Loaded documents:', this.documents.length);
          }
        } else if (response.status === 403) {
          alert('Access denied - admin privileges required');
          this.$router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        this.isLoading = false;
      }
    },
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        category: '',
        owner: ''
      };
      this.loadDocuments();
    },
    async updateDocumentStatus(doc, newStatus) {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/admin/documents/${doc.id}/status/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus,
            comment: `Status changed by admin to ${newStatus}`
          })
        });

        if (response.ok) {
          doc.status = newStatus;
          alert('Document status updated successfully');
        } else {
          alert('Failed to update status');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
      }
    },
    viewDocument(doc) {
      this.selectedDocument = doc;
      this.showViewModal = true;
    },
    async downloadDocument(doc) {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/documents/${doc.id}/download/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.original_filename || doc.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          alert('Failed to download document');
        }
      } catch (error) {
        console.error('Download error:', error);
        alert('Error downloading document');
      }
    },
    async deleteDocument(doc) {
      if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:8000/api/admin/documents/${doc.id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('Document deleted successfully');
          this.loadDocuments();
        } else {
          alert('Failed to delete document');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting document');
      }
    },
    getStatusClass(status) {
      const classes = {
        'Approved': 'bg-green-100 text-green-800 border-green-300',
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'In Review': 'bg-blue-100 text-blue-800 border-blue-300',
        'Rejected': 'bg-red-100 text-red-800 border-red-300'
      };
      return classes[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
      
      this.$router.push('/admin/login');
    }
  }
}
</script>

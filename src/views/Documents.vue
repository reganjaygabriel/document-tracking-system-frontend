<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-primary-600">DocTrack</h1>
        <p class="text-sm text-gray-500">Document Management</p>
      </div>
      
      <nav class="mt-6">
        <router-link 
          to="/dashboard"
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
        >
          <span class="text-xl mr-3">📊</span>
          <span class="font-medium">Dashboard</span>
        </router-link>
        <router-link 
          to="/documents"
          class="flex items-center px-6 py-3 bg-primary-50 text-primary-600 border-r-4 border-primary-600 transition-colors duration-200"
        >
          <span class="text-xl mr-3">📄</span>
          <span class="font-medium">Documents</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between px-8 py-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">My Documents</h2>
            <p class="text-sm text-gray-500 mt-1">Manage and organize your documents</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button class="relative p-2 text-gray-600 hover:text-gray-800">
              <span class="text-2xl">🔔</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {{ userInitials }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                <p class="text-xs text-gray-500">{{ userEmail }}</p>
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

      <!-- Documents Content -->
      <main class="p-8">
        <!-- Filters and Actions -->
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search documents..."
                  class="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

              <!-- Status Filter -->
              <select 
                v-model="filterStatus"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <!-- Category Filter -->
              <select 
                v-model="filterCategory"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="Financial Reports">Financial Reports</option>
                <option value="Contracts">Contracts</option>
                <option value="Proposals">Proposals</option>
                <option value="Presentations">Presentations</option>
                <option value="Technical Documents">Technical Documents</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="flex items-center space-x-3">
              <button 
                @click="refreshDocuments"
                :disabled="isRefreshing"
                class="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh documents"
              >
                <span :class="{ 'animate-spin': isRefreshing }" class="mr-2">🔄</span>
                {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
              </button>
              <button 
                @click="showUploadModal = true"
                class="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center"
              >
                <span class="mr-2">⬆️</span>
                Upload Document
              </button>
            </div>
          </div>

          <!-- View Toggle and Auto-Refresh Status -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <button 
                @click="viewMode = 'grid'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                Grid View
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                List View
              </button>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span class="animate-pulse">🔄</span>
              <span>Auto-refresh every 30s</span>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p class="mt-4 text-gray-600">Loading documents...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredDocuments.length === 0" class="text-center py-12">
          <span class="text-6xl mb-4 block">📁</span>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
          <p class="text-gray-600 mb-6">Upload your first document to get started</p>
          <button 
            @click="showUploadModal = true"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Upload Document
          </button>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="doc in filteredDocuments" 
            :key="doc.id"
            class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
          >
            <!-- Document Preview -->
            <div class="h-48 bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center relative">
              <span class="text-6xl">{{ doc.icon }}</span>
              <div class="absolute top-3 right-3">
                <span 
                  :class="getStatusClass(doc.status)"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ doc.status }}
                </span>
              </div>
            </div>

            <!-- Document Info -->
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1 truncate" :title="doc.name">
                {{ doc.name }}
              </h3>
              <p class="text-sm text-gray-500 mb-3">{{ doc.size }} • {{ doc.lastModified }}</p>
              
              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button 
                  @click="viewDocument(doc)"
                  class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  View
                </button>
                <button 
                  @click="editDocument(doc)"
                  class="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  @click="deleteDocument(doc)"
                  class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-700">Document</th>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-700">Size</th>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-700">Modified</th>
                <th class="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="doc in filteredDocuments" 
                :key="doc.id"
                class="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <span class="text-3xl mr-3">{{ doc.icon }}</span>
                    <div>
                      <p class="font-medium text-gray-900">{{ doc.name }}</p>
                      <p class="text-xs text-gray-500">{{ doc.category || 'Uncategorized' }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ doc.type }}</td>
                <td class="py-4 px-6 text-sm text-gray-700">{{ doc.size }}</td>
                <td class="py-4 px-6">
                  <span 
                    :class="getStatusClass(doc.status)"
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ doc.status }}
                  </span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-600">{{ doc.lastModified }}</td>
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="viewDocument(doc)"
                      class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                    <button 
                      @click="editDocument(doc)"
                      class="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      @click="deleteDocument(doc)"
                      class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredDocuments.length > 0" class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Showing <span class="font-medium">{{ filteredDocuments.length }}</span> of <span class="font-medium">{{ documents.length }}</span> documents
          </p>
          <div class="flex space-x-2">
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">Previous</button>
            <button class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">1</button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">2</button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">Next</button>
          </div>
        </div>
      </main>
    </div>

    <!-- Upload Modal (Complete with functionality) -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Upload Document</h2>
          <button @click="closeUploadModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <span class="text-2xl">✕</span>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="handleUpload" class="p-6 space-y-6">
          <!-- File Upload Area -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select File *
            </label>
            <div 
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              :class="[
                'border-2 border-dashed rounded-lg p-8 text-center transition-all',
                isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              ]"
            >
              <input 
                ref="fileInput"
                type="file" 
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                class="hidden"
              />
              
              <div v-if="!uploadForm.file">
                <span class="text-5xl mb-4 block">📁</span>
                <p class="text-gray-600 mb-2">Drag and drop your file here, or</p>
                <button 
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse Files
                </button>
                <p class="text-xs text-gray-500 mt-3">
                  Supported: PDF, Word, Excel, PowerPoint, Images, Text (Max 10MB)
                </p>
              </div>

              <div v-else class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center space-x-3">
                  <span class="text-3xl">{{ getFileIcon(uploadForm.file.name) }}</span>
                  <div class="text-left">
                    <p class="font-medium text-gray-900">{{ uploadForm.file.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatFileSize(uploadForm.file.size) }}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="removeFile"
                  class="text-red-600 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Document Name -->
          <div>
            <label for="docName" class="block text-sm font-medium text-gray-700 mb-2">
              Document Name *
            </label>
            <input
              id="docName"
              v-model="uploadForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter document name"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="uploadForm.description"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a description for this document"
            ></textarea>
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              v-model="uploadForm.category"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="Financial Reports">Financial Reports</option>
              <option value="Contracts">Contracts</option>
              <option value="Proposals">Proposals</option>
              <option value="Presentations">Presentations</option>
              <option value="Technical Documents">Technical Documents</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              v-model="uploadForm.status"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="uploadError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p class="font-medium">{{ uploadError }}</p>
            <button 
              v-if="uploadError.includes('login') || uploadError.includes('Authentication')"
              @click="goToLogin"
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Go to Login Page
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="uploadSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {{ uploadSuccess }}
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              @click="closeUploadModal"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isUploading || !uploadForm.file"
              class="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span v-if="!isUploading">Upload Document</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Document Modal -->
    <div v-if="selectedDocument && showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">{{ selectedDocument.name }}</h2>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <span class="text-2xl">✕</span>
          </button>
        </div>
        <div class="p-6">
          <!-- Document Info -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="text-sm font-medium text-gray-700">File Type:</label>
              <p class="text-gray-900">{{ selectedDocument.type }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Size:</label>
              <p class="text-gray-900">{{ selectedDocument.size }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status:</label>
              <span :class="getStatusClass(selectedDocument.status)" class="px-3 py-1 rounded-full text-xs font-semibold ml-2">
                {{ selectedDocument.status }}
              </span>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Last Modified:</label>
              <p class="text-gray-900">{{ selectedDocument.lastModified }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Category:</label>
              <p class="text-gray-900">{{ selectedDocument.category || 'Uncategorized' }}</p>
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Description:</label>
              <p class="text-gray-900">{{ selectedDocument.description || 'No description' }}</p>
            </div>
          </div>

          <!-- File Preview -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">File Preview</h3>
            
            <!-- Loading State -->
            <div v-if="isLoadingPreview" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p class="ml-4 text-gray-600">Loading preview...</p>
            </div>

            <!-- PDF Preview -->
            <div v-else-if="selectedDocument.type === 'PDF' && selectedDocument.file_url" class="bg-gray-100 rounded-lg p-8 text-center">
              <span class="text-6xl mb-4 block">📕</span>
              <p class="text-lg font-semibold text-gray-900 mb-2">PDF Document</p>
              <p class="text-sm text-gray-600 mb-6">{{ selectedDocument.name }}</p>
              <div class="flex justify-center space-x-3">
                <a 
                  :href="selectedDocument.file_url" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                >
                  <span class="mr-2">👁️</span>
                  Open PDF
                </a>
                <button 
                  @click="downloadDocument(selectedDocument)"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center transition-colors"
                >
                  <span class="mr-2">⬇️</span>
                  Download
                </button>
              </div>
            </div>

            <!-- Image Preview -->
            <div v-else-if="['JPG', 'JPEG', 'PNG', 'GIF'].includes(selectedDocument.type) && selectedDocument.file_url" class="bg-gray-100 rounded-lg p-8 text-center">
              <img 
                :src="selectedDocument.file_url" 
                :alt="selectedDocument.name"
                class="max-w-full max-h-[400px] object-contain rounded mx-auto mb-4"
              />
              <div class="flex justify-center space-x-3">
                <a 
                  :href="selectedDocument.file_url" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                >
                  <span class="mr-2">👁️</span>
                  View Full Size
                </a>
                <button 
                  @click="downloadDocument(selectedDocument)"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center transition-colors"
                >
                  <span class="mr-2">⬇️</span>
                  Download
                </button>
              </div>
            </div>

            <!-- Text Preview -->
            <div v-else-if="['TXT', 'CSV'].includes(selectedDocument.type)" class="bg-gray-100 rounded-lg p-4">
              <pre v-if="filePreviewContent" class="whitespace-pre-wrap text-sm text-gray-800 max-h-[600px] overflow-auto">{{ filePreviewContent }}</pre>
              <p v-else class="text-gray-500 text-center py-8">Loading text content...</p>
            </div>

            <!-- Office Documents (Word, Excel, PowerPoint) -->
            <div v-else-if="['DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX'].includes(selectedDocument.type)" class="bg-gray-50 rounded-lg p-8 text-center">
              <span class="text-6xl mb-4 block">{{ selectedDocument.icon }}</span>
              <p class="text-gray-700 mb-4">Preview not available for {{ selectedDocument.type }} files</p>
              <p class="text-sm text-gray-500 mb-4">Download the file to view its contents</p>
            </div>

            <!-- Unsupported Preview -->
            <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
              <span class="text-6xl mb-4 block">{{ selectedDocument.icon }}</span>
              <p class="text-gray-700 mb-4">Preview not available for this file type</p>
              <p class="text-sm text-gray-500">Download the file to view its contents</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex space-x-3">
            <button 
              @click="downloadDocument(selectedDocument)"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
            >
              <span class="mr-2">⬇️</span>
              Download
            </button>
            <button 
              @click="editDocument(selectedDocument); showViewModal = false"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Edit
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

    <!-- Edit Document Modal -->
    <div v-if="selectedDocument && showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Edit Document</h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <span class="text-2xl">✕</span>
          </button>
        </div>
        <form @submit.prevent="saveDocument" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Document Name *</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              placeholder="Enter document name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              v-model="editForm.description" 
              rows="3" 
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a description"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select v-model="editForm.category" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="">Select category</option>
              <option value="Financial Reports">Financial Reports</option>
              <option value="Contracts">Contracts</option>
              <option value="Proposals">Proposals</option>
              <option value="Presentations">Presentations</option>
              <option value="Technical Documents">Technical Documents</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="editError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ editError }}
          </div>

          <!-- Success Message -->
          <div v-if="editSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {{ editSuccess }}
          </div>

          <div class="flex space-x-3 pt-4">
            <button 
              type="submit" 
              :disabled="isSaving"
              class="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="!isSaving">Save Changes</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            </button>
            <button 
              type="button" 
              @click="showEditModal = false" 
              :disabled="isSaving"
              class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Documents',
  data() {
    return {
      userName: '',
      userEmail: '',
      searchQuery: '',
      filterStatus: 'all',
      filterCategory: 'all',
      viewMode: 'grid',
      isLoading: false,
      isRefreshing: false,
      isLoadingPreview: false,
      isSaving: false,
      filePreviewContent: '',
      showUploadModal: false,
      showViewModal: false,
      showEditModal: false,
      selectedDocument: null,
      isDragging: false,
      isUploading: false,
      uploadError: '',
      uploadSuccess: '',
      editError: '',
      editSuccess: '',
      refreshInterval: null,
      uploadForm: {
        file: null,
        name: '',
        description: '',
        category: '',
        status: 'Pending'
      },
      editForm: {
        name: '',
        description: '',
        category: '',
        status: ''
      },
      documents: []
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
    },
    filteredDocuments() {
      let filtered = this.documents;
      
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(doc => doc.status === this.filterStatus);
      }
      
      if (this.filterCategory !== 'all') {
        filtered = filtered.filter(doc => doc.category === this.filterCategory);
      }
      
      if (this.searchQuery) {
        filtered = filtered.filter(doc =>
          doc.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      return filtered;
    }
  },
  mounted() {
    this.userName = localStorage.getItem('userName') || 'User';
    this.userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    this.loadDocuments();
    
    // Start auto-refresh every 30 seconds
    this.startAutoRefresh();
  },
  beforeUnmount() {
    // Clean up interval when component is destroyed
    this.stopAutoRefresh();
  },
  methods: {
    startAutoRefresh() {
      // Refresh documents every 30 seconds
      this.refreshInterval = setInterval(() => {
        this.refreshDocuments(true); // true = silent refresh (no loading spinner)
      }, 30000);
    },
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },
    async refreshDocuments(silent = false) {
      if (!silent) {
        this.isRefreshing = true;
      }
      
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No auth token found');
          return;
        }

        const response = await fetch('http://localhost:8000/api/documents/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Transform backend data to frontend format
          if (data.documents && Array.isArray(data.documents)) {
            const oldDocuments = this.documents;
            this.documents = data.documents.map(doc => ({
              id: doc.id,
              document_id: doc.document_id,
              name: doc.name,
              type: doc.file_type,
              size: this.formatFileSize(doc.file_size),
              owner: {
                name: doc.owner_name || 'Unknown',
                initials: this.getInitials(doc.owner_name || 'U')
              },
              status: doc.status,
              lastModified: this.formatDate(doc.updated_at),
              icon: this.getFileIcon(doc.original_filename),
              category: doc.category,
              description: doc.description,
              file_url: doc.file_url
            }));
            
            // Check if any status changed
            if (!silent && oldDocuments.length > 0) {
              const statusChanges = this.documents.filter(newDoc => {
                const oldDoc = oldDocuments.find(d => d.id === newDoc.id);
                return oldDoc && oldDoc.status !== newDoc.status;
              });
              
              if (statusChanges.length > 0) {
                console.log(`✅ ${statusChanges.length} document(s) status updated`);
              }
            }
            
            console.log('Documents refreshed:', this.documents.length);
          }
        }
      } catch (error) {
        console.error('Error refreshing documents:', error);
      } finally {
        if (!silent) {
          this.isRefreshing = false;
        }
      }
    },
    async loadDocuments() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No auth token found');
          this.isLoading = false;
          return;
        }

        const response = await fetch('http://localhost:8000/api/documents/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Load documents response:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Documents data:', data);
          
          // Transform backend data to frontend format
          if (data.documents && Array.isArray(data.documents)) {
            this.documents = data.documents.map(doc => ({
              id: doc.id,
              document_id: doc.document_id,
              name: doc.name,
              type: doc.file_type,
              size: this.formatFileSize(doc.file_size),
              owner: {
                name: doc.owner_name || 'Unknown',
                initials: this.getInitials(doc.owner_name || 'U')
              },
              status: doc.status,
              lastModified: this.formatDate(doc.updated_at),
              icon: this.getFileIcon(doc.original_filename),
              category: doc.category,
              description: doc.description,
              file_url: doc.file_url
            }));
            
            console.log('Loaded documents:', this.documents.length);
          } else {
            this.documents = [];
          }
        } else {
          console.error('Failed to load documents:', response.status);
          this.documents = [];
        }
      } catch (error) {
        console.error('Error loading documents:', error);
        this.documents = [];
      } finally {
        this.isLoading = false;
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
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString();
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
    async viewDocument(doc) {
      this.selectedDocument = doc;
      this.showViewModal = true;
      this.filePreviewContent = '';
      
      // Load text content for TXT and CSV files
      if (['TXT', 'CSV'].includes(doc.type) && doc.file_url) {
        this.isLoadingPreview = true;
        try {
          const response = await fetch(doc.file_url);
          if (response.ok) {
            this.filePreviewContent = await response.text();
          } else {
            this.filePreviewContent = 'Error loading file content';
          }
        } catch (error) {
          console.error('Error loading file preview:', error);
          this.filePreviewContent = 'Error loading file content';
        } finally {
          this.isLoadingPreview = false;
        }
      }
    },
    async downloadDocument(doc) {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          alert('Please login to download documents');
          return;
        }

        // Use the download endpoint
        const response = await fetch(`http://localhost:8000/api/documents/${doc.id}/download/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Create blob from response
          const blob = await response.blob();
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.name;
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
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
    editDocument(doc) {
      this.selectedDocument = doc;
      this.editForm = {
        name: doc.name,
        description: doc.description || '',
        category: doc.category || ''
      };
      this.editError = '';
      this.editSuccess = '';
      this.showEditModal = true;
    },
    async saveDocument() {
      if (!this.editForm.name) {
        this.editError = 'Document name is required';
        return;
      }

      this.isSaving = true;
      this.editError = '';
      this.editSuccess = '';

      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          this.editError = 'You must be logged in to edit documents';
          return;
        }

        const response = await fetch(`http://localhost:8000/api/documents/${this.selectedDocument.id}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.editForm.name,
            description: this.editForm.description,
            category: this.editForm.category
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.editSuccess = 'Document updated successfully!';
          
          // Update the document in the local list
          const index = this.documents.findIndex(d => d.id === this.selectedDocument.id);
          if (index !== -1) {
            this.documents[index] = {
              ...this.documents[index],
              name: this.editForm.name,
              description: this.editForm.description,
              category: this.editForm.category
            };
          }

          // Close modal after 1.5 seconds
          setTimeout(() => {
            this.showEditModal = false;
            this.editError = '';
            this.editSuccess = '';
          }, 1500);
        } else {
          this.editError = data.error || 'Failed to update document';
        }
      } catch (error) {
        console.error('Error updating document:', error);
        this.editError = 'Error updating document. Please try again.';
      } finally {
        this.isSaving = false;
      }
    },
    async deleteDocument(doc) {
      if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          alert('You must be logged in to delete documents');
          return;
        }

        const response = await fetch(`http://localhost:8000/api/documents/${doc.id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            // Remove document from local list
            this.documents = this.documents.filter(d => d.id !== doc.id);
            alert('Document deleted successfully');
          } else {
            alert(data.error || 'Failed to delete document');
          }
        } else {
          alert('Failed to delete document');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error deleting document. Please try again.');
      }
    },
    handleLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      this.$router.push('/login');
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },
    handleFileDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },
    validateAndSetFile(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = 'File size must be less than 10MB';
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'text/csv'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.uploadError = 'File type not supported. Please upload PDF, Word, Excel, PowerPoint, Image, or Text files.';
        return;
      }

      this.uploadError = '';
      this.uploadForm.file = file;
      
      if (!this.uploadForm.name) {
        this.uploadForm.name = file.name;
      }
    },
    removeFile() {
      this.uploadForm.file = null;
      this.$refs.fileInput.value = '';
    },
    getFileIcon(filename) {
      const ext = filename.split('.').pop().toLowerCase();
      const iconMap = {
        'pdf': '📕',
        'doc': '📘',
        'docx': '📘',
        'xls': '📗',
        'xlsx': '📗',
        'ppt': '📙',
        'pptx': '📙',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'txt': '📄',
        'csv': '📊'
      };
      return iconMap[ext] || '📄';
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    closeUploadModal() {
      this.showUploadModal = false;
      this.resetUploadForm();
    },
    resetUploadForm() {
      this.uploadForm = {
        file: null,
        name: '',
        description: '',
        category: '',
        status: 'Pending'
      };
      this.uploadError = '';
      this.uploadSuccess = '';
      this.isDragging = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    goToLogin() {
      this.closeUploadModal();
      this.$router.push('/login');
    },
    async handleUpload() {
      if (!this.uploadForm.file) {
        this.uploadError = 'Please select a file to upload';
        return;
      }

      if (!this.uploadForm.name) {
        this.uploadError = 'Please enter a document name';
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        this.uploadError = 'You must be logged in to upload documents. Please login first.';
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
        return;
      }

      this.isUploading = true;
      this.uploadError = '';
      this.uploadSuccess = '';

      try {
        const formData = new FormData();
        formData.append('file', this.uploadForm.file);
        formData.append('name', this.uploadForm.name);
        formData.append('description', this.uploadForm.description);
        formData.append('category', this.uploadForm.category);
        formData.append('status', this.uploadForm.status);

        const API_URL = 'http://localhost:8000/api/documents/';
        
        console.log('Uploading to:', API_URL);
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('File:', this.uploadForm.file.name, this.uploadForm.file.size, 'bytes');
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        console.log('Response status:', response.status);
        
        let data;
        try {
          data = await response.json();
          console.log('Response data:', data);
        } catch (e) {
          console.error('Failed to parse response:', e);
          throw new Error('Invalid response from server');
        }

        if (response.ok && data.success) {
          this.uploadSuccess = 'Document uploaded successfully!';
          
          // Reload documents list
          await this.loadDocuments();

          // Close modal after 2 seconds
          setTimeout(() => {
            this.closeUploadModal();
          }, 2000);
        } else {
          if (response.status === 401) {
            this.uploadError = 'Authentication failed. Please login again.';
            setTimeout(() => {
              this.$router.push('/login');
            }, 2000);
          } else if (response.status === 400) {
            this.uploadError = data.error || 'Invalid file or form data. Please check your inputs.';
          } else if (response.status === 413) {
            this.uploadError = 'File is too large. Maximum size is 10MB.';
          } else {
            this.uploadError = data.error || 'Upload failed. Please try again.';
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        
        if (error.message === 'Failed to fetch') {
          this.uploadError = 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000';
        } else if (error.name === 'TypeError') {
          this.uploadError = 'Network error. Please check if the backend server is running.';
        } else {
          this.uploadError = 'Upload failed: ' + error.message;
        }
      } finally {
        this.isUploading = false;
      }
    }
  }
}
</script>

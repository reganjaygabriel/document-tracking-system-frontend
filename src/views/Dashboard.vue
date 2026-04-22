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
          active-class="bg-primary-50 text-primary-600 border-r-4 border-primary-600"
        >
          <span class="text-xl mr-3">📊</span>
          <span class="font-medium">Dashboard</span>
        </router-link>
        <router-link 
          to="/documents"
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
          active-class="bg-primary-50 text-primary-600 border-r-4 border-primary-600"
        >
          <span class="text-xl mr-3">📄</span>
          <span class="font-medium">Documents</span>
        </router-link>
        <a 
          href="#"
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
        >
          <span class="text-xl mr-3">📈</span>
          <span class="font-medium">Analytics</span>
        </a>
        <a 
          href="#"
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
        >
          <span class="text-xl mr-3">⚙️</span>
          <span class="font-medium">Settings</span>
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between px-8 py-4">
          <div class="flex-1 max-w-2xl">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search documents..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-4 ml-6">
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

      <!-- Dashboard Content -->
      <main class="p-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            v-for="stat in stats" 
            :key="stat.title"
            class="card hover:shadow-lg transition-shadow duration-200"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
                <p class="text-sm mt-2" :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'">
                  <span>{{ stat.change }}</span>
                  <span class="text-gray-500 ml-1">vs last month</span>
                </p>
              </div>
              <div :class="`text-4xl ${stat.color}`">
                {{ stat.icon }}
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Document Status Overview -->
          <div class="lg:col-span-2 card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Document Status Overview</h2>
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

          <!-- Quick Actions -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <button 
                v-for="action in quickActions" 
                :key="action.name"
                @click="handleQuickAction(action.name)"
                class="w-full flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
              >
                <span class="text-2xl mr-3">{{ action.icon }}</span>
                <span class="font-medium text-gray-700">{{ action.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Documents Table -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Recent Documents</h2>
            <div class="flex space-x-2">
              <select 
                v-model="filterStatus"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in-review">In Review</option>
              </select>
              <button @click="showUploadModal = true" class="btn-primary">
                + New Document
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Document Name</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Modified</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="doc in filteredDocuments" 
                  :key="doc.id"
                  class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <span class="text-2xl mr-3">{{ doc.icon }}</span>
                      <div>
                        <p class="font-medium text-gray-900">{{ doc.name }}</p>
                        <p class="text-xs text-gray-500">{{ doc.size }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-700">{{ doc.type }}</td>
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-xs mr-2">
                        {{ doc.owner.initials }}
                      </div>
                      <span class="text-sm text-gray-700">{{ doc.owner.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <span 
                      :class="getStatusClass(doc.status)"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ doc.status }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-sm text-gray-600">{{ doc.lastModified }}</td>
                  <td class="py-4 px-4">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewDocument(doc)"
                        class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors duration-200"
                      >
                        View
                      </button>
                      <button class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors duration-200">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between mt-6">
            <p class="text-sm text-gray-600">
              Showing <span class="font-medium">1-{{ filteredDocuments.length }}</span> of <span class="font-medium">{{ documents.length }}</span> documents
            </p>
            <div class="flex space-x-2">
              <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Previous</button>
              <button class="px-3 py-1 bg-primary-600 text-white rounded text-sm">1</button>
              <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
              <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
              <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Upload Modal -->
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

    <!-- Export Data Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-fadeIn">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 flex items-center">
              <span class="text-3xl mr-3">💾</span>
              Export Documents
            </h2>
            <p class="text-sm text-gray-600 mt-1">Select documents to export to CSV file</p>
          </div>
          <button 
            @click="closeExportModal" 
            class="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all duration-200"
          >
            <span class="text-2xl">✕</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-hidden flex flex-col p-6">
          <!-- Select All -->
          <div class="mb-4 pb-4 border-b border-gray-200">
            <label class="flex items-center space-x-3 cursor-pointer hover:bg-primary-50 p-4 rounded-xl transition-all duration-200 group">
              <input 
                type="checkbox" 
                :checked="selectedDocuments.length === documents.length && documents.length > 0"
                @change="toggleSelectAll"
                class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
              />
              <div class="flex-1">
                <span class="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                  Select All Documents
                </span>
                <p class="text-sm text-gray-500">{{ documents.length }} documents available</p>
              </div>
              <span class="text-2xl group-hover:scale-110 transition-transform">📋</span>
            </label>
          </div>

          <!-- Document List -->
          <div class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <label 
              v-for="doc in documents" 
              :key="doc.id"
              class="flex items-center space-x-3 p-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 rounded-xl cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-primary-200 group"
              :class="{ 'bg-primary-50 border-primary-300': selectedDocuments.includes(doc.id) }"
            >
              <input 
                type="checkbox" 
                :checked="selectedDocuments.includes(doc.id)"
                @change="toggleDocumentSelection(doc.id)"
                class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
              />
              <span class="text-3xl group-hover:scale-110 transition-transform">{{ doc.icon }}</span>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {{ doc.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ doc.type }} • {{ doc.size }} • {{ doc.lastModified }}
                </p>
              </div>
              <span 
                :class="getStatusClass(doc.status)"
                class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm"
              >
                {{ doc.status }}
              </span>
            </label>
          </div>

          <!-- Selection Summary -->
          <div class="mt-4 pt-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 -mx-6 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">📊</span>
                <p class="text-sm text-gray-700">
                  <span class="font-bold text-primary-600 text-lg">{{ selectedDocuments.length }}</span> 
                  <span class="text-gray-600">of</span>
                  <span class="font-bold text-gray-900 text-lg">{{ documents.length }}</span> 
                  <span class="text-gray-600">documents selected</span>
                </p>
              </div>
              <div v-if="selectedDocuments.length > 0" class="text-sm text-primary-600 font-medium animate-pulse">
                Ready to export ✓
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            @click="closeExportModal"
            :disabled="isExporting"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            @click="exportToCSV"
            :disabled="selectedDocuments.length === 0 || isExporting"
            class="px-8 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span v-if="!isExporting" class="flex items-center">
              <span class="text-xl mr-2">💾</span>
              Export {{ selectedDocuments.length > 0 ? `(${selectedDocuments.length})` : '' }}
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Scan Document Modal -->
    <div v-if="showScanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fadeIn">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-green-50">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 flex items-center">
              <span class="text-3xl mr-3">📷</span>
              Scan Document
            </h2>
            <p class="text-sm text-gray-600 mt-1">Upload and process scanned documents</p>
          </div>
          <button 
            @click="closeScanModal" 
            class="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all duration-200"
          >
            <span class="text-2xl">✕</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <!-- File Upload Area -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Select Scanned Image
            </label>
            <div 
              class="border-2 border-dashed rounded-xl p-8 text-center transition-all border-gray-300 hover:border-primary-400"
            >
              <input 
                ref="scanFileInput"
                type="file" 
                @change="handleScanFileSelect"
                accept="image/*"
                class="hidden"
              />
              
              <div v-if="!scanFile">
                <span class="text-6xl mb-4 block">📷</span>
                <p class="text-gray-600 mb-2">Select a scanned image file</p>
                <button 
                  type="button"
                  @click="$refs.scanFileInput.click()"
                  class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Browse Files
                </button>
                <p class="text-xs text-gray-500 mt-3">
                  Supported: JPG, PNG, GIF, BMP (Max 20MB)
                </p>
              </div>

              <div v-else class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center space-x-3">
                  <span class="text-4xl">🖼️</span>
                  <div class="text-left">
                    <p class="font-medium text-gray-900">{{ scanFile.name }}</p>
                    <p class="text-sm text-gray-500">{{ formatFileSize(scanFile.size) }}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="removeScanFile"
                  class="text-red-600 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Scan Settings -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Quality -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Quality
              </label>
              <select
                v-model="scanSettings.quality"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="high">High Quality</option>
                <option value="medium">Medium Quality</option>
                <option value="low">Low Quality</option>
              </select>
            </div>

            <!-- Color Mode -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Color Mode
              </label>
              <select
                v-model="scanSettings.colorMode"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="color">Color</option>
                <option value="grayscale">Grayscale</option>
                <option value="blackwhite">Black & White</option>
              </select>
            </div>

            <!-- Output Format -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Output Format
              </label>
              <select
                v-model="scanSettings.format"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="pdf">PDF</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>

          <!-- Info Box -->
          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex items-start">
              <span class="text-2xl mr-3">ℹ️</span>
              <div>
                <p class="text-sm text-green-900 font-medium">Scan Processing</p>
                <p class="text-sm text-green-700 mt-1">
                  Your scanned document will be processed and automatically uploaded to the system 
                  with category "Scanned Documents" and status "Pending".
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            @click="closeScanModal"
            :disabled="isScanning"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            @click="processScan"
            :disabled="!scanFile || isScanning"
            class="px-8 py-3 bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-xl hover:from-primary-700 hover:to-green-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span v-if="!isScanning" class="flex items-center">
              <span class="text-xl mr-2">📷</span>
              Process & Upload
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create Report Modal -->
    <div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fadeIn">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 flex items-center">
              <span class="text-3xl mr-3">📊</span>
              Create Report
            </h2>
            <p class="text-sm text-gray-600 mt-1">Generate comprehensive document reports</p>
          </div>
          <button 
            @click="closeReportModal" 
            class="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all duration-200"
          >
            <span class="text-2xl">✕</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <!-- Report Type Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Report Type
            </label>
            <div class="grid grid-cols-1 gap-3">
              <label 
                class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
                :class="reportType === 'summary' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              >
                <input 
                  type="radio" 
                  v-model="reportType" 
                  value="summary"
                  class="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div class="ml-3 flex-1">
                  <div class="flex items-center">
                    <span class="text-2xl mr-2">📋</span>
                    <span class="font-semibold text-gray-900">Summary Report</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">Overview with statistics and document list</p>
                </div>
              </label>

              <label 
                class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
                :class="reportType === 'detailed' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              >
                <input 
                  type="radio" 
                  v-model="reportType" 
                  value="detailed"
                  class="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div class="ml-3 flex-1">
                  <div class="flex items-center">
                    <span class="text-2xl mr-2">📄</span>
                    <span class="font-semibold text-gray-900">Detailed Report</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">Complete document information with all details</p>
                </div>
              </label>

              <label 
                class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
                :class="reportType === 'status' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              >
                <input 
                  type="radio" 
                  v-model="reportType" 
                  value="status"
                  class="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div class="ml-3 flex-1">
                  <div class="flex items-center">
                    <span class="text-2xl mr-2">📊</span>
                    <span class="font-semibold text-gray-900">Status Report</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">Documents grouped by status</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Format Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              Export Format
            </label>
            <div class="grid grid-cols-3 gap-3">
              <label 
                class="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
                :class="reportFormat === 'pdf' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              >
                <input 
                  type="radio" 
                  v-model="reportFormat" 
                  value="pdf"
                  class="sr-only"
                />
                <span class="text-3xl mb-2">📕</span>
                <span class="font-semibold text-gray-900">PDF</span>
                <span class="text-xs text-gray-500 mt-1">Print/Save</span>
              </label>

              <label 
                class="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
                :class="reportFormat === 'html' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              >
                <input 
                  type="radio" 
                  v-model="reportFormat" 
                  value="html"
                  class="sr-only"
                />
                <span class="text-3xl mb-2">🌐</span>
                <span class="font-semibold text-gray-900">HTML</span>
                <span class="text-xs text-gray-500 mt-1">Web Page</span>
              </label>

              <label 
                class="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-400 hover:bg-primary-50"
                :class="reportFormat === 'csv' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
              >
                <input 
                  type="radio" 
                  v-model="reportFormat" 
                  value="csv"
                  class="sr-only"
                />
                <span class="text-3xl mb-2">📊</span>
                <span class="font-semibold text-gray-900">CSV</span>
                <span class="text-xs text-gray-500 mt-1">Spreadsheet</span>
              </label>
            </div>
          </div>

          <!-- Report Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div class="flex items-start">
              <span class="text-2xl mr-3">ℹ️</span>
              <div>
                <p class="text-sm text-blue-900 font-medium">Report Information</p>
                <p class="text-sm text-blue-700 mt-1">
                  This report will include data from <strong>{{ documents.length }} documents</strong> 
                  currently in the system.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            @click="closeReportModal"
            :disabled="isGeneratingReport"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            @click="generateReport"
            :disabled="isGeneratingReport"
            class="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span v-if="!isGeneratingReport" class="flex items-center">
              <span class="text-xl mr-2">📊</span>
              Generate Report
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          </button>
        </div>
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

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      searchQuery: '',
      filterStatus: 'all',
      userName: '',
      userEmail: '',
      showUploadModal: false,
      showViewModal: false,
      showExportModal: false,
      showReportModal: false,
      showScanModal: false,
      isExporting: false,
      isGeneratingReport: false,
      isScanning: false,
      selectedDocument: null,
      isDragging: false,
      isUploading: false,
      isLoadingPreview: false,
      filePreviewContent: '',
      uploadError: '',
      uploadSuccess: '',
      isLoadingStats: false,
      selectedDocuments: [],
      reportType: 'summary',
      reportFormat: 'pdf',
      scanFile: null,
      scanSettings: {
        quality: 'high',
        colorMode: 'color',
        format: 'pdf'
      },
      uploadForm: {
        file: null,
        name: '',
        description: '',
        category: '',
        status: 'Pending'
      },
      menuItems: [
        { name: 'Dashboard', icon: '📊', href: '#', active: true },
        { name: 'Documents', icon: '📄', href: '#', active: false },
        { name: 'Upload', icon: '⬆️', href: '#', active: false },
        { name: 'Analytics', icon: '📈', href: '#', active: false },
        { name: 'Settings', icon: '⚙️', href: '#', active: false },
      ],
      stats: [
        {
          title: 'Total Documents',
          value: '0',
          change: '+0%',
          changeType: 'increase',
          icon: '📄',
          color: 'text-blue-500'
        },
        {
          title: 'Pending Review',
          value: '0',
          change: '+0%',
          changeType: 'increase',
          icon: '⏳',
          color: 'text-yellow-500'
        },
        {
          title: 'Approved',
          value: '0',
          change: '+0%',
          changeType: 'increase',
          icon: '✅',
          color: 'text-green-500'
        },
        {
          title: 'Rejected',
          value: '0',
          change: '-0%',
          changeType: 'decrease',
          icon: '❌',
          color: 'text-red-500'
        }
      ],
      documentStatus: [],
      quickActions: [
        { name: 'Upload Document', icon: '⬆️' },
        { name: 'Create Report', icon: '📊' },
        { name: 'Scan Document', icon: '📷' },
        { name: 'Export Data', icon: '💾' }
      ],
      documents: []
    }
  },
  computed: {
    filteredDocuments() {
      let filtered = this.documents;
      
      // Filter by status
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(doc => 
          doc.status.toLowerCase() === this.filterStatus.toLowerCase()
        );
      }
      
      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(doc =>
          doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          doc.owner.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      return filtered;
    },
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
    // Load user information from localStorage
    this.userName = localStorage.getItem('userName') || 'User';
    this.userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    
    // Load documents and statistics from backend
    this.loadDocuments();
    this.loadStatistics();
  },
  methods: {
    getStatusClass(status) {
      const statusClasses = {
        'Approved': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'In Review': 'bg-blue-100 text-blue-800',
        'Rejected': 'bg-red-100 text-red-800'
      };
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    },
    getStatusColor(statusName) {
      const colors = {
        'Approved': '#10b981',      // green-500
        'Pending': '#f59e0b',        // yellow-500
        'Pending Review': '#f59e0b', // yellow-500
        'In Review': '#3b82f6',      // blue-500
        'Rejected': '#ef4444'        // red-500
      };
      return colors[statusName] || '#6b7280'; // gray-500 as default
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
    handleLogout() {
      // Clear authentication
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      
      // Redirect to login
      this.$router.push('/login');
    },
    handleQuickAction(actionName) {
      if (actionName === 'Upload Document') {
        this.showUploadModal = true;
      } else if (actionName === 'Export Data') {
        this.openExportModal();
      } else if (actionName === 'Create Report') {
        this.openReportModal();
      } else if (actionName === 'Scan Document') {
        this.openScanModal();
      }
    },
    openExportModal() {
      if (this.documents.length === 0) {
        alert('No documents to export');
        return;
      }
      this.selectedDocuments = [];
      this.showExportModal = true;
    },
    closeExportModal() {
      this.showExportModal = false;
      this.selectedDocuments = [];
    },
    openReportModal() {
      if (this.documents.length === 0) {
        alert('No documents available to generate report');
        return;
      }
      this.reportType = 'summary';
      this.reportFormat = 'pdf';
      this.showReportModal = true;
    },
    closeReportModal() {
      this.showReportModal = false;
    },
    openScanModal() {
      this.scanFile = null;
      this.scanSettings = {
        quality: 'high',
        colorMode: 'color',
        format: 'pdf'
      };
      this.showScanModal = true;
    },
    closeScanModal() {
      this.showScanModal = false;
      this.scanFile = null;
    },
    handleScanFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // Check if it's an image file
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file (JPG, PNG, etc.)');
          return;
        }
        
        // Check file size (20MB limit for scans)
        if (file.size > 20 * 1024 * 1024) {
          alert('File size must be less than 20MB');
          return;
        }
        
        this.scanFile = file;
      }
    },
    removeScanFile() {
      this.scanFile = null;
      if (this.$refs.scanFileInput) {
        this.$refs.scanFileInput.value = '';
      }
    },
    async processScan() {
      if (!this.scanFile) {
        alert('Please select an image to scan');
        return;
      }

      this.isScanning = true;

      try {
        // Simulate scanning/processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', this.scanFile);
        
        // Generate document name based on scan settings
        const timestamp = new Date().toISOString().split('T')[0];
        const docName = `Scanned_Document_${timestamp}`;
        
        formData.append('name', docName);
        formData.append('description', `Scanned document - ${this.scanSettings.quality} quality, ${this.scanSettings.colorMode} mode`);
        formData.append('category', 'Scanned Documents');
        formData.append('status', 'Pending');

        const token = localStorage.getItem('authToken');
        
        if (!token) {
          alert('Please login to scan documents');
          this.isScanning = false;
          return;
        }

        const response = await fetch('http://localhost:8000/api/documents/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Reload documents and statistics
          await this.loadDocuments();
          await this.loadStatistics();

          setTimeout(() => {
            this.isScanning = false;
            this.closeScanModal();
            alert('Document scanned and uploaded successfully!');
          }, 500);
        } else {
          this.isScanning = false;
          alert(data.error || 'Failed to process scan. Please try again.');
        }
      } catch (error) {
        console.error('Scan error:', error);
        this.isScanning = false;
        alert('Failed to process scan. Please try again.');
      }
    },
    async generateReport() {
      this.isGeneratingReport = true;

      try {
        // Simulate report generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (this.reportFormat === 'pdf') {
          this.generatePDFReport();
        } else if (this.reportFormat === 'html') {
          this.generateHTMLReport();
        } else if (this.reportFormat === 'csv') {
          this.generateCSVReport();
        }

        setTimeout(() => {
          this.isGeneratingReport = false;
          // Don't close the modal - let user generate multiple reports
          alert(`${this.reportType.charAt(0).toUpperCase() + this.reportType.slice(1)} report generated successfully!`);
        }, 500);
      } catch (error) {
        console.error('Report generation error:', error);
        this.isGeneratingReport = false;
        alert('Failed to generate report. Please try again.');
      }
    },
    generatePDFReport() {
      // Generate HTML content for the report
      const reportContent = this.getReportContent();
      
      // Create a printable HTML page
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert('Please allow popups for this site to view the report');
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${this.reportType.charAt(0).toUpperCase() + this.reportType.slice(1)} Report - DocTrack</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #4F46E5;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #4F46E5;
              margin: 0;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin: 30px 0;
            }
            .stat-card {
              border: 2px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            .stat-card h3 {
              margin: 0;
              font-size: 14px;
              color: #666;
            }
            .stat-card p {
              margin: 10px 0 0 0;
              font-size: 32px;
              font-weight: bold;
              color: #4F46E5;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #4F46E5;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .status-badge {
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-approved { background-color: #d1fae5; color: #065f46; }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-rejected { background-color: #fee2e2; color: #991b1b; }
            .status-review { background-color: #dbeafe; color: #1e40af; }
            .status-in { background-color: #dbeafe; color: #1e40af; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .button-container {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              background-color: #f9fafb;
              border-radius: 12px;
              border: 2px solid #e5e7eb;
            }
            .btn {
              padding: 14px 28px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 600;
              transition: all 0.3s ease;
              margin: 0 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .btn:active {
              transform: translateY(0);
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .btn-primary {
              background-color: #4F46E5;
              color: white;
            }
            .btn-primary:hover {
              background-color: #4338CA;
            }
            .btn-secondary {
              background-color: #6b7280;
              color: white;
            }
            .btn-secondary:hover {
              background-color: #4b5563;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${reportContent}
        </body>
        </html>
      `);
      printWindow.document.close();
    },
    generateHTMLReport() {
      const reportContent = this.getReportContent();
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${this.reportType.charAt(0).toUpperCase() + this.reportType.slice(1)} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4F46E5; color: white; }
          </style>
        </head>
        <body>
          ${reportContent}
        </body>
        </html>
      `], { type: 'text/html' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.reportType}_report_${new Date().toISOString().split('T')[0]}.html`;
      a.click();
      URL.revokeObjectURL(url);
    },
    generateCSVReport() {
      const headers = ['Document Name', 'Type', 'Size', 'Owner', 'Status', 'Category', 'Last Modified'];
      const rows = this.documents.map(doc => [
        doc.name,
        doc.type,
        doc.size,
        doc.owner.name,
        doc.status,
        doc.category || 'Uncategorized',
        doc.lastModified
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    getReportContent() {
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      let content = `
        <div class="header">
          <h1>📊 ${this.reportType.charAt(0).toUpperCase() + this.reportType.slice(1)} Report</h1>
          <p><strong>DocTrack Document Management System</strong></p>
          <p>Generated on: ${date}</p>
          <p>Generated by: ${this.userName} (${this.userEmail})</p>
        </div>
      `;

      if (this.reportType === 'summary') {
        content += `
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Documents</h3>
              <p>${this.stats[0].value}</p>
            </div>
            <div class="stat-card">
              <h3>Pending Review</h3>
              <p>${this.stats[1].value}</p>
            </div>
            <div class="stat-card">
              <h3>Approved</h3>
              <p>${this.stats[2].value}</p>
            </div>
            <div class="stat-card">
              <h3>Rejected</h3>
              <p>${this.stats[3].value}</p>
            </div>
          </div>
          
          <h2>Document Status Distribution</h2>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${this.documentStatus.map(status => `
                <tr>
                  <td>${status.name}</td>
                  <td>${status.count}</td>
                  <td>${status.percentage}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      if (this.reportType === 'summary' || this.reportType === 'detailed') {
        content += `
          <h2 style="margin-top: 30px;">Document List</h2>
          <table>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Category</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              ${this.documents.map(doc => `
                <tr>
                  <td>${doc.name}</td>
                  <td>${doc.type}</td>
                  <td>${doc.size}</td>
                  <td>${doc.owner.name}</td>
                  <td>
                    <span class="status-badge status-${doc.status.toLowerCase().replace(' ', '-')}">
                      ${doc.status}
                    </span>
                  </td>
                  <td>${doc.category || 'Uncategorized'}</td>
                  <td>${doc.lastModified}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      if (this.reportType === 'status') {
        const groupedByStatus = {};
        this.documents.forEach(doc => {
          if (!groupedByStatus[doc.status]) {
            groupedByStatus[doc.status] = [];
          }
          groupedByStatus[doc.status].push(doc);
        });

        content += '<h2>Documents by Status</h2>';
        Object.keys(groupedByStatus).forEach(status => {
          content += `
            <h3 style="margin-top: 20px; color: #4F46E5;">${status} (${groupedByStatus[status].length})</h3>
            <table>
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                ${groupedByStatus[status].map(doc => `
                  <tr>
                    <td>${doc.name}</td>
                    <td>${doc.type}</td>
                    <td>${doc.owner.name}</td>
                    <td>${doc.category || 'Uncategorized'}</td>
                    <td>${doc.lastModified}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        });
      }

      content += `
        <div class="footer">
          <p>This report was automatically generated by DocTrack Document Management System</p>
          <p>&copy; ${new Date().getFullYear()} DocTrack. All rights reserved.</p>
        </div>
      `;

      return content;
    },
    toggleDocumentSelection(docId) {
      const index = this.selectedDocuments.indexOf(docId);
      if (index > -1) {
        this.selectedDocuments.splice(index, 1);
      } else {
        this.selectedDocuments.push(docId);
      }
    },
    toggleSelectAll() {
      if (this.selectedDocuments.length === this.documents.length) {
        this.selectedDocuments = [];
      } else {
        this.selectedDocuments = this.documents.map(doc => doc.id);
      }
    },
    exportToCSV() {
      // Start exporting animation
      this.isExporting = true;

      try {
        // Get selected documents
        const docsToExport = this.selectedDocuments.length > 0
          ? this.documents.filter(doc => this.selectedDocuments.includes(doc.id))
          : this.documents;

        if (docsToExport.length === 0) {
          alert('Please select at least one document to export');
          this.isExporting = false;
          return;
        }

        // Prepare CSV headers
        const headers = ['Document Name', 'Type', 'Size', 'Owner', 'Status', 'Category', 'Last Modified'];
        
        // Prepare CSV rows
        const rows = docsToExport.map(doc => [
          doc.name,
          doc.type,
          doc.size,
          doc.owner.name,
          doc.status,
          doc.category || 'Uncategorized',
          doc.lastModified
        ]);

        // Combine headers and rows
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        const filename = `documents_export_${date}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Small delay to show the animation before closing
        setTimeout(() => {
          // Stop exporting animation
          this.isExporting = false;
          
          // Close modal and show success
          this.closeExportModal();
          alert(`Successfully exported ${docsToExport.length} documents to ${filename}`);
        }, 500);
      } catch (error) {
        console.error('Export error:', error);
        this.isExporting = false;
        alert('Failed to export data. Please try again.');
      }
    },
    handleMenuClick(menuName) {
      if (menuName === 'Upload') {
        this.showUploadModal = true;
      }
    },
    goToLogin() {
      this.closeUploadModal();
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
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = 'File size must be less than 10MB';
        return;
      }

      // Check file type
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
      
      // Auto-fill document name if empty
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
    async handleUpload() {
      if (!this.uploadForm.file) {
        this.uploadError = 'Please select a file to upload';
        return;
      }

      if (!this.uploadForm.name) {
        this.uploadError = 'Please enter a document name';
        return;
      }

      // Check if user is logged in
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
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', this.uploadForm.file);
        formData.append('name', this.uploadForm.name);
        formData.append('description', this.uploadForm.description);
        formData.append('category', this.uploadForm.category);
        formData.append('status', this.uploadForm.status);

        // API endpoint - Update this if your backend is on a different port
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
          
          // Reload documents and statistics from backend
          await this.loadDocuments();
          await this.loadStatistics();

          // Close modal after 2 seconds
          setTimeout(() => {
            this.closeUploadModal();
          }, 2000);
        } else {
          // Handle specific error messages
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
        
        // More specific error messages
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
    },
    async loadDocuments() {
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
            
            console.log('Dashboard: Loaded documents:', this.documents.length);
          } else {
            this.documents = [];
          }
        } else {
          console.error('Failed to load documents:', response.status);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
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
    async loadStatistics() {
      this.isLoadingStats = true;
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No auth token found for statistics');
          return;
        }

        const response = await fetch('http://localhost:8000/api/documents/statistics/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.stats) {
            // Update stats cards
            this.stats[0].value = data.stats.total.toString();
            this.stats[1].value = data.stats.pending.toString();
            this.stats[2].value = data.stats.approved.toString();
            this.stats[3].value = data.stats.rejected.toString();
            
            // Update document status distribution for graph
            this.documentStatus = data.stats.status_distribution;
            
            console.log('Dashboard: Loaded statistics:', data.stats);
          }
        } else {
          console.error('Failed to load statistics:', response.status);
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        this.isLoadingStats = false;
      }
    }
  }
}
</script>

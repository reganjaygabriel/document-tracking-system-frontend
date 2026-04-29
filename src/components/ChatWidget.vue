<template>
  <div>
    <!-- Chat Button (Floating) -->
    <button 
      @click="toggleChat"
      class="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 w-12 h-12 lg:w-14 lg:h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center z-40"
      :class="{ 'animate-bounce': unreadCount > 0 }"
    >
      <span class="text-xl lg:text-2xl">💬</span>
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Chat Window -->
    <div 
      v-if="showChat"
      class="fixed bottom-16 right-4 lg:bottom-24 lg:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 lg:p-4 flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-base lg:text-lg truncate">{{ chatTitle }}</h3>
          <p class="text-xs text-indigo-100 truncate">{{ chatSubtitle }}</p>
        </div>
        <button @click="showChat = false" class="text-white hover:text-gray-200 ml-2">
          <span class="text-xl lg:text-2xl">✕</span>
        </button>
      </div>

      <!-- User List (for regular users when no conversation selected) -->
      <div v-if="!isAdmin && !selectedUserId && !showingMessages" class="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <!-- Search Bar -->
        <div class="p-3 bg-white border-b border-gray-200">
          <div class="relative">
            <input
              v-model="userSearchQuery"
              type="text"
              placeholder="Search users..."
              class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span class="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          </div>
        </div>

        <!-- User List -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="isLoadingUsers" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600">Loading users...</p>
          </div>
          
          <div v-else-if="filteredAvailableUsers.length === 0" class="p-8 text-center text-gray-500">
            <span class="text-4xl mb-2 block">👥</span>
            <p>{{ userSearchQuery ? 'No users found' : 'No users available' }}</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <button 
              v-for="user in filteredAvailableUsers" 
              :key="user.id"
              @click="selectUser(user)"
              type="button"
              class="w-full p-4 bg-white hover:bg-indigo-50 cursor-pointer transition-all duration-150 text-left border-b border-gray-200 focus:outline-none focus:bg-indigo-100 active:bg-indigo-100"
            >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {{ user.full_name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h4 
                    :class="[
                      user.unread_count > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'
                    ]"
                  >
                    {{ user.full_name }}
                  </h4>
                  <p 
                    :class="[
                      'text-xs',
                      user.unread_count > 0 ? 'font-semibold text-gray-600' : 'text-gray-500'
                    ]"
                  >
                    {{ user.email }}
                  </p>
                  <span 
                    :class="[
                      'text-xs px-2 py-0.5 rounded-full',
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ user.role === 'admin' ? 'Admin' : 'User' }}
                  </span>
                </div>
              </div>
              <!-- Blue dot indicator for unread messages -->
              <span 
                v-if="user.unread_count > 0"
                class="w-3 h-3 bg-blue-500 rounded-full"
              ></span>
            </div>
          </button>
        </div>
        </div>
      </div>

      <!-- Admin View: Toggle between Conversations and All Users -->
      <div v-else-if="isAdmin && !selectedDocument && !selectedUserId" class="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <!-- Tab Switcher -->
        <div class="flex border-b border-gray-200 bg-white">
          <button
            @click="adminView = 'conversations'"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors',
              adminView === 'conversations'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Active Chats
            <span v-if="conversationUnreadCount > 0" class="ml-1 text-xs">
              ({{ conversationUnreadCount }})
            </span>
          </button>
          <button
            @click="adminView = 'users'"
            :class="[
              'flex-1 py-3 text-sm font-medium transition-colors',
              adminView === 'users'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            All Users
          </button>
        </div>

        <!-- Conversations View -->
        <div v-if="adminView === 'conversations'" class="flex-1 flex flex-col overflow-hidden">
          <!-- Search Bar -->
          <div class="p-3 bg-white border-b border-gray-200">
            <div class="relative">
              <input
                v-model="conversationSearchQuery"
                type="text"
                placeholder="Search conversations..."
                class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span class="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>
          </div>

          <!-- Conversations List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="isLoadingConversations" class="p-8 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-600">Loading conversations...</p>
            </div>
            
            <div v-else-if="filteredConversations.length === 0" class="p-8 text-center text-gray-500">
              <span class="text-4xl mb-2 block">💬</span>
              <p>{{ conversationSearchQuery ? 'No conversations found' : 'No active conversations' }}</p>
              <p class="text-xs mt-2">Switch to "All Users" to start a new chat</p>
            </div>
            
            <div v-else class="divide-y divide-gray-200">
              <button 
                v-for="conv in filteredConversations" 
                :key="conv.document_id || conv.user_id"
                @click="selectConversation(conv)"
                type="button"
                class="w-full p-4 bg-white hover:bg-indigo-50 cursor-pointer transition-all duration-150 text-left border-b border-gray-200 focus:outline-none focus:bg-indigo-100 active:bg-indigo-100"
              >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0 pr-3">
                  <h4 
                    :class="[
                      'truncate mb-1',
                      conv.unread_count > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'
                    ]"
                  >
                    {{ conv.document_name }}
                  </h4>
                  <p 
                    :class="[
                      'text-sm mb-1',
                      conv.unread_count > 0 ? 'font-semibold text-indigo-700' : 'font-medium text-indigo-600'
                    ]"
                  >
                    {{ conv.owner_name }}
                  </p>
                  <p 
                    :class="[
                      'text-xs truncate',
                      conv.unread_count > 0 ? 'font-semibold text-gray-700' : 'text-gray-500'
                    ]"
                  >
                    {{ conv.last_message }}
                  </p>
                </div>
                <div class="flex flex-col items-end flex-shrink-0">
                  <span class="text-xs text-gray-400 whitespace-nowrap mb-1">{{ formatTime(conv.last_message_time) }}</span>
                  <!-- Blue dot indicator for unread messages -->
                  <span 
                    v-if="conv.unread_count > 0"
                    class="w-3 h-3 bg-blue-500 rounded-full"
                  ></span>
                </div>
              </div>
            </button>
          </div>
          </div>
        </div>

        <!-- All Users View -->
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <!-- Search Bar -->
          <div class="p-3 bg-white border-b border-gray-200">
            <div class="relative">
              <input
                v-model="userSearchQuery"
                type="text"
                placeholder="Search users..."
                class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span class="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>
          </div>

          <!-- User List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="isLoadingUsers" class="p-8 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="mt-2 text-sm text-gray-600">Loading users...</p>
            </div>
            
            <div v-else-if="filteredAvailableUsers.length === 0" class="p-8 text-center text-gray-500">
              <span class="text-4xl mb-2 block">👥</span>
              <p>{{ userSearchQuery ? 'No users found' : 'No users available' }}</p>
            </div>
            
            <div v-else class="divide-y divide-gray-200">
              <button 
                v-for="user in filteredAvailableUsers" 
                :key="user.id"
                @click="selectUser(user)"
                type="button"
                class="w-full p-4 bg-white hover:bg-indigo-50 cursor-pointer transition-all duration-150 text-left border-b border-gray-200 focus:outline-none focus:bg-indigo-100 active:bg-indigo-100"
              >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {{ user.full_name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 
                      :class="[
                        user.unread_count > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'
                      ]"
                    >
                      {{ user.full_name }}
                    </h4>
                    <p 
                      :class="[
                        'text-xs',
                        user.unread_count > 0 ? 'font-semibold text-gray-600' : 'text-gray-500'
                      ]"
                    >
                      {{ user.email }}
                    </p>
                    <span 
                      :class="[
                        'text-xs px-2 py-0.5 rounded-full',
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ user.role === 'admin' ? 'Admin' : 'User' }}
                    </span>
                  </div>
                </div>
                <!-- Blue dot indicator for unread messages -->
                <span 
                  v-if="user.unread_count > 0"
                  class="w-3 h-3 bg-blue-500 rounded-full"
                ></span>
              </div>
            </button>
          </div>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div v-else class="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <!-- Sticky Back button -->
        <div 
          v-if="(isAdmin || !isAdmin) && (selectedDocument || selectedUserId)"
          class="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-3"
        >
          <button 
            @click="goBack"
            class="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back to {{ isAdmin ? 'conversations' : 'users' }}</span>
          </button>
        </div>

        <!-- Scrollable Messages Container -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="messagesContainer">
          <div v-if="isLoadingMessages" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600">Loading messages...</p>
          </div>
          
          <div v-else-if="messages.length === 0" class="text-center py-8 text-gray-500">
            <span class="text-4xl mb-2 block">💬</span>
            <p>No messages yet</p>
            <p class="text-sm mt-1">Start a conversation!</p>
          </div>
          
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            :class="[
              'flex gap-3 items-start',
              msg.sender === currentUserId ? 'justify-start' : 'justify-end'
            ]"
          >
            <!-- Profile Avatar - Always on the left, clickable -->
            <div class="flex-shrink-0 order-first">
              <button
                @click="viewUserProfile(msg.sender, msg.sender_role)"
                class="block focus:outline-none"
              >
                <div 
                  v-if="msg.sender_profile_picture"
                  class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-400 transition-all cursor-pointer"
                >
                  <img 
                    :src="`http://localhost:8000${msg.sender_profile_picture}`" 
                    :alt="msg.sender_name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div 
                  v-else
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 hover:scale-110 transition-all cursor-pointer',
                    msg.sender_role === 'admin' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-300 hover:border-purple-400' 
                      : 'bg-gradient-to-br from-indigo-500 to-blue-600 border-blue-300 hover:border-blue-400'
                  ]"
                >
                  {{ msg.sender_name.charAt(0).toUpperCase() }}
                </div>
              </button>
            </div>

            <!-- Message bubble -->
            <div 
              :class="[
                'rounded-2xl px-4 py-2 shadow-sm max-w-[70%]',
                msg.sender === currentUserId 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-900'
              ]"
            >
              <p class="text-sm whitespace-pre-wrap break-words">{{ msg.message }}</p>
              <p 
                :class="[
                  'text-xs mt-1',
                  msg.sender === currentUserId ? 'text-indigo-200' : 'text-gray-500'
                ]"
              >
                {{ formatTime(msg.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-3 lg:p-4 bg-white border-t border-gray-200">
        <div class="flex items-end space-x-2">
          <textarea
            v-model="newMessage"
            @keydown.enter.prevent="sendMessage"
            placeholder="Type your message..."
            rows="2"
            class="flex-1 px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm lg:text-base"
          ></textarea>
          <button 
            @click="sendMessage"
            :disabled="!newMessage.trim() || isSending"
            class="px-4 lg:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[72px] font-medium text-sm lg:text-base"
          >
            <span v-if="!isSending">Send</span>
            <span v-else>Sending...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div 
      v-if="showProfileModal && profileModalUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      @click="closeProfileModal"
    >
      <div 
        class="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">User Profile</h3>
          <button 
            @click="closeProfileModal"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <!-- Profile Content -->
        <div class="space-y-4">
          <!-- Profile Picture -->
          <div class="flex justify-center">
            <div 
              v-if="profileModalUser.profile_picture"
              class="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-200"
            >
              <img 
                :src="`http://localhost:8000${profileModalUser.profile_picture}`" 
                :alt="profileModalUser.full_name"
                class="w-full h-full object-cover"
              />
            </div>
            <div 
              v-else
              :class="[
                'w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4',
                profileModalUser.role === 'admin' 
                  ? 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-300' 
                  : 'bg-gradient-to-br from-indigo-500 to-blue-600 border-blue-300'
              ]"
            >
              {{ profileModalUser.full_name.charAt(0).toUpperCase() }}
            </div>
          </div>

          <!-- User Info -->
          <div class="text-center">
            <h4 class="text-2xl font-bold text-gray-900">{{ profileModalUser.full_name }}</h4>
            <span 
              :class="[
                'inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium',
                profileModalUser.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              ]"
            >
              {{ profileModalUser.role === 'admin' ? 'Admin' : 'User' }}
            </span>
          </div>

          <!-- Details -->
          <div class="space-y-3 pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-3">
              <span class="text-gray-500 text-sm w-20">Email:</span>
              <span class="text-gray-900 font-medium">{{ profileModalUser.email }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-gray-500 text-sm w-20">Status:</span>
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  profileModalUser.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ profileModalUser.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-gray-500 text-sm w-20">Joined:</span>
              <span class="text-gray-900">{{ new Date(profileModalUser.date_joined).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="mt-6 flex justify-end">
          <button
            @click="closeProfileModal"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '../eventBus.js'

export default {
  name: 'ChatWidget',
  props: {
    documentId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      showChat: false,
      userSearchQuery: '',
      conversationSearchQuery: '',
      messages: [],
      conversations: [],
      availableUsers: [],
      newMessage: '',
      isLoadingMessages: false,
      isLoadingConversations: false,
      isLoadingUsers: false,
      isSending: false,
      unreadCount: 0,
      currentUserId: null,
      isAdmin: false,
      selectedDocument: null,
      selectedUserId: null,
      selectedUserName: '',
      showingMessages: false,
      chatInterval: null,
      adminView: 'conversations', // 'conversations' or 'users'
      showProfileModal: false,
      profileModalUser: null
    }
  },
  computed: {
    filteredAvailableUsers() {
      if (!this.userSearchQuery) {
        return this.availableUsers;
      }
      const query = this.userSearchQuery.toLowerCase();
      return this.availableUsers.filter(user => 
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    },
    filteredConversations() {
      if (!this.conversationSearchQuery) {
        return this.conversations;
      }
      const query = this.conversationSearchQuery.toLowerCase();
      return this.conversations.filter(conv => 
        conv.document_name.toLowerCase().includes(query) ||
        conv.owner_name.toLowerCase().includes(query) ||
        (conv.last_message && conv.last_message.toLowerCase().includes(query))
      );
    },
    conversationUnreadCount() {
      return this.conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
    },
    chatTitle() {
      if (this.isAdmin) {
        return this.selectedUserId ? `Chat with ${this.selectedUserName}` : 'Support Chat';
      } else {
        return this.selectedUserId ? `Chat with ${this.selectedUserName}` : 'Messages';
      }
    },
    chatSubtitle() {
      if (this.isAdmin) {
        return this.selectedUserId ? 'Support conversation' : 'Help users with their documents';
      } else {
        return this.selectedUserId ? 'Send a message' : 'Select a user to chat';
      }
    }
  },
  mounted() {
    const userRole = localStorage.getItem('userRole');
    this.isAdmin = userRole === 'admin';
    
    // Get current user ID
    this.getCurrentUserId();
    
    // Load initial data
    if (this.isAdmin) {
      this.loadConversations();
      this.loadAvailableUsers(); // Load users for admin too
    } else {
      // For regular users, load available users to chat with
      this.loadAvailableUsers();
    }
    
    // Listen for external chat open requests
    eventBus.$on('openChatWithUser', this.handleOpenChatWithUser);
    eventBus.$on('openChatWidget', this.handleOpenChatWidget);
    
    // Poll for new messages every 10 seconds
    this.chatInterval = setInterval(() => {
      if (this.selectedDocument || this.selectedUserId) {
        this.loadMessages(true);
      } else if (this.isAdmin) {
        this.loadConversations();
        if (this.adminView === 'users') {
          this.loadAvailableUsers(true);
        }
      } else {
        // Keep refreshing user list with unread counts
        this.loadAvailableUsers(true);
      }
    }, 10000);
  },
  beforeUnmount() {
    if (this.chatInterval) {
      clearInterval(this.chatInterval);
    }
    // Remove event listener
    eventBus.$off('openChatWithUser', this.handleOpenChatWithUser);
    eventBus.$off('openChatWidget', this.handleOpenChatWidget);
  },
  methods: {
    async getCurrentUserId() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/auth/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.currentUserId = data.user.id;
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    },
    toggleChat() {
      this.showChat = !this.showChat;
      
      if (this.showChat) {
        if (this.isAdmin && !this.selectedDocument && !this.selectedUserId) {
          this.loadConversations();
          this.loadAvailableUsers(); // Load users for admin too
        } else if (!this.isAdmin && !this.selectedUserId) {
          this.loadAvailableUsers();
        } else {
          // Load messages for selected conversation
          this.loadMessages();
          this.markMessagesAsRead();
        }
      }
    },
    async loadAvailableUsers(silent = false) {
      if (!silent) {
        this.isLoadingUsers = true;
      }
      
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/chat/available-users/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.availableUsers = data.users;
            // Calculate total unread count
            this.unreadCount = this.availableUsers.reduce((sum, user) => sum + (user.unread_count || 0), 0);
          }
        }
      } catch (error) {
        console.error('Error loading available users:', error);
      } finally {
        this.isLoadingUsers = false;
      }
    },
    selectUser(user) {
      this.selectedUserId = user.id;
      this.selectedUserName = user.full_name;
      this.showingMessages = true;
      this.loadMessages();
      this.markMessagesAsRead();
    },
    handleOpenChatWithUser(data) {
      // Open chat widget with specific user
      this.showChat = true;
      this.selectedUserId = data.userId;
      this.selectedUserName = data.userName;
      this.showingMessages = true;
      this.selectedDocument = null;
      this.loadMessages();
      this.markMessagesAsRead();
    },
    handleOpenChatWidget() {
      // Simply open the chat widget
      this.showChat = true;
    },
    goBack() {
      this.selectedDocument = null;
      this.selectedUserId = null;
      this.selectedUserName = '';
      this.showingMessages = false;
      this.messages = [];
      
      if (this.isAdmin) {
        this.loadConversations();
        this.loadAvailableUsers(); // Refresh user list too
      } else {
        this.loadAvailableUsers();
      }
    },
    async loadConversations() {
      this.isLoadingConversations = true;
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/chat/conversations/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.conversations = data.conversations;
            this.unreadCount = this.conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        this.isLoadingConversations = false;
      }
    },
    selectConversation(conv) {
      console.log('Selecting conversation:', conv);
      this.selectedDocument = conv.document_id || null;
      this.selectedUserId = conv.user_id || null;
      this.loadMessages();
      this.markMessagesAsRead();
    },
    async loadMessages(silent = false) {
      if (!silent) {
        this.isLoadingMessages = true;
      }
      
      try {
        const token = localStorage.getItem('authToken');
        let url = 'http://localhost:8000/api/chat/messages/';
        
        // Build query parameters
        const params = new URLSearchParams();
        if (this.selectedDocument) {
          params.append('document_id', this.selectedDocument);
        } else if (this.selectedUserId) {
          params.append('user_id', this.selectedUserId);
        }
        
        if (params.toString()) {
          url += '?' + params.toString();
        }
        
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.messages = data.messages;
            this.unreadCount = data.unread_count;
            
            // Scroll to bottom
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        this.isLoadingMessages = false;
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim() || this.isSending) return;
      
      this.isSending = true;
      try {
        const token = localStorage.getItem('authToken');
        const payload = {
          message: this.newMessage
        };
        
        // Add document_id if in document conversation
        if (this.selectedDocument) {
          payload.document_id = this.selectedDocument;
        }
        
        // Add receiver_id if in general conversation with specific user
        if (this.selectedUserId) {
          payload.receiver_id = this.selectedUserId;
        }
        
        const response = await fetch('http://localhost:8000/api/chat/send/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          this.newMessage = '';
          await this.loadMessages(true);
        } else {
          alert('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message');
      } finally {
        this.isSending = false;
      }
    },
    async markMessagesAsRead() {
      try {
        const token = localStorage.getItem('authToken');
        const payload = {};
        
        if (this.selectedDocument) {
          payload.document_id = this.selectedDocument;
        } else if (this.selectedUserId) {
          payload.user_id = this.selectedUserId;
        }
        
        await fetch('http://localhost:8000/api/chat/mark-read/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        this.unreadCount = 0;
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    formatTime(dateString) {
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
    async viewUserProfile(userId, userRole) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8000/api/users/${userId}/profile/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.profileModalUser = data.user;
          this.showProfileModal = true;
        } else {
          console.error('Failed to load user profile');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    },
    closeProfileModal() {
      this.showProfileModal = false;
      this.profileModalUser = null;
    }
  }
}
</script>

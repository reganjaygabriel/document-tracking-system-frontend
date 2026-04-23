<template>
  <div>
    <!-- Chat Button (Floating) -->
    <button 
      @click="toggleChat"
      class="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center z-40"
      :class="{ 'animate-bounce': unreadCount > 0 }"
    >
      <span class="text-2xl">💬</span>
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Chat Window -->
    <div 
      v-if="showChat"
      class="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-lg">{{ isAdmin ? 'Support Chat' : 'Chat with Admin' }}</h3>
          <p class="text-xs text-indigo-100">{{ isAdmin ? 'Help users with their documents' : 'Get help with your documents' }}</p>
        </div>
        <button @click="showChat = false" class="text-white hover:text-gray-200">
          <span class="text-2xl">✕</span>
        </button>
      </div>

      <!-- Conversations List (if admin and no selected conversation) -->
      <div v-if="isAdmin && !selectedDocument && !selectedUserId" class="flex-1 overflow-y-auto bg-gray-50">
        <div v-if="isLoadingConversations" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600">Loading conversations...</p>
        </div>
        
        <div v-else-if="conversations.length === 0" class="p-8 text-center text-gray-500">
          <span class="text-4xl mb-2 block">💬</span>
          <p>No conversations yet</p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <button 
            v-for="conv in conversations" 
            :key="conv.document_id || conv.user_id"
            @click="selectConversation(conv)"
            type="button"
            class="w-full p-4 bg-white hover:bg-indigo-50 cursor-pointer transition-all duration-150 text-left border-b border-gray-200 focus:outline-none focus:bg-indigo-100 active:bg-indigo-100"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0 pr-3">
                <h4 class="font-semibold text-gray-900 truncate mb-1">{{ conv.document_name }}</h4>
                <p class="text-sm text-indigo-600 font-medium mb-1">{{ conv.owner_name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ conv.last_message }}</p>
              </div>
              <div class="flex flex-col items-end flex-shrink-0">
                <span class="text-xs text-gray-400 whitespace-nowrap mb-1">{{ formatTime(conv.last_message_time) }}</span>
                <span 
                  v-if="conv.unread_count > 0"
                  class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ conv.unread_count }}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div v-else class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" ref="messagesContainer">
        <!-- Back button for admin -->
        <button 
          v-if="isAdmin && (selectedDocument || selectedUserId)"
          @click="selectedDocument = null; selectedUserId = null; loadConversations()"
          class="mb-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to conversations
        </button>

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
            'flex',
            msg.sender === currentUserId ? 'justify-end' : 'justify-start'
          ]"
        >
          <div 
            :class="[
              'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
              msg.sender === currentUserId 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-900'
            ]"
          >
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-xs font-semibold">{{ msg.sender_name }}</span>
              <span 
                :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  msg.sender_role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ msg.sender_role === 'admin' ? 'Admin' : 'User' }}
              </span>
            </div>
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

      <!-- Message Input -->
      <div class="p-4 bg-white border-t border-gray-200">
        <div class="flex items-end space-x-2">
          <textarea
            v-model="newMessage"
            @keydown.enter.prevent="sendMessage"
            placeholder="Type your message..."
            rows="2"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          ></textarea>
          <button 
            @click="sendMessage"
            :disabled="!newMessage.trim() || isSending"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[72px] font-medium"
          >
            <span v-if="!isSending">Send</span>
            <span v-else>Sending...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      messages: [],
      conversations: [],
      newMessage: '',
      isLoadingMessages: false,
      isLoadingConversations: false,
      isSending: false,
      unreadCount: 0,
      currentUserId: null,
      isAdmin: false,
      selectedDocument: null,
      selectedUserId: null,
      chatInterval: null
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
    } else {
      // For regular users, automatically load their general chat
      this.loadMessages();
    }
    
    // Poll for new messages every 10 seconds
    this.chatInterval = setInterval(() => {
      if (this.selectedDocument || this.selectedUserId) {
        this.loadMessages(true);
      } else if (this.isAdmin) {
        this.loadConversations();
      } else {
        // Keep refreshing user's general chat
        this.loadMessages(true);
      }
    }, 10000);
  },
  beforeUnmount() {
    if (this.chatInterval) {
      clearInterval(this.chatInterval);
    }
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
        } else {
          // Load messages for users or when admin has selected conversation
          this.loadMessages();
          this.markMessagesAsRead();
        }
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
    }
  }
}
</script>

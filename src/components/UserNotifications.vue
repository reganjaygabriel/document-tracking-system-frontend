<template>
  <div>
    <!-- Notification Bell Button -->
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
          <button 
            @click="refreshNotifications"
            class="text-gray-500 hover:text-gray-700"
          >
            <span class="text-lg">🔄</span>
          </button>
          <button 
            @click="showNotifications = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <span class="text-xl">✕</span>
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="overflow-y-auto max-h-[500px]">
        <div v-if="isLoading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600">Loading notifications...</p>
        </div>

        <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-500">
          <span class="text-4xl mb-2 block">🔔</span>
          <p>No notifications yet</p>
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
            <div class="flex items-start space-x-3">
              <!-- Icon based on type -->
              <div class="flex-shrink-0 mt-1">
                <span v-if="notification.type === 'document_upload'" class="text-2xl">📤</span>
                <span v-else-if="notification.type === 'status_change'" class="text-2xl">🔄</span>
                <span v-else-if="notification.type === 'document_shared'" class="text-2xl">🔗</span>
                <span v-else class="text-2xl">💬</span>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <h4 class="text-sm font-semibold text-gray-900">{{ notification.title }}</h4>
                  <span 
                    v-if="!notification.is_read"
                    class="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                  ></span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTime(notification.created_at) }}</p>
              </div>

              <!-- Delete button -->
              <button 
                @click.stop="deleteNotification(notification.id)"
                class="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
              >
                <span class="text-sm">🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'UserNotifications',
  data() {
    return {
      showNotifications: false,
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      refreshInterval: null
    }
  },
  mounted() {
    this.loadNotifications();
    
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadNotifications(true);
    }, 30000);
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.loadNotifications();
      }
    },
    async loadNotifications(silent = false) {
      if (!silent) {
        this.isLoading = true;
      }

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/notifications/', {
          headers: { 'Authorization': `Bearer ${token}` }
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
      } finally {
        this.isLoading = false;
      }
    },
    async handleNotificationClick(notification) {
      // Mark as read
      if (!notification.is_read) {
        await this.markAsRead(notification.id);
      }

      // Navigate based on notification type
      if (notification.type === 'system' && notification.message.includes('message')) {
        // Open chat - trigger chat widget
        window.dispatchEvent(new CustomEvent('openChat'));
      } else if (notification.document) {
        // Navigate to documents page
        this.$router.push('/documents');
      }

      this.showNotifications = false;
    },
    async markAsRead(notificationId) {
      try {
        const token = localStorage.getItem('authToken');
        await fetch(`http://localhost:8000/api/notifications/${notificationId}/read/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Update local state
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.is_read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    async markAllAsRead() {
      try {
        const token = localStorage.getItem('authToken');
        await fetch('http://localhost:8000/api/notifications/mark-all-read/', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Update local state
        this.notifications.forEach(n => n.is_read = true);
        this.unreadCount = 0;
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    },
    async deleteNotification(notificationId) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/delete/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
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
    refreshNotifications() {
      this.loadNotifications();
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

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
  </div>
</template>

<script>
export default {
  name: 'AdminNotifications',
  data() {
    return {
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      isLoadingNotifications: false,
      notificationInterval: null
    }
  },
  mounted() {
    // Load notifications
    this.loadNotifications();
    
    // Poll for new notifications every 30 seconds
    this.notificationInterval = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  },
  beforeUnmount() {
    // Clear notification polling interval
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
  },
  methods: {
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
        this.showNotifications = false;
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
    }
  }
}
</script>

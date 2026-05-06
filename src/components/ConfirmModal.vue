<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fadeIn">
      <!-- Modal Header -->
      <div 
        class="flex items-center justify-between p-6 border-b border-gray-200"
        :class="headerClass"
      >
        <div class="flex items-center space-x-3">
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="iconBgClass"
          >
            <span class="text-2xl">{{ icon }}</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm text-gray-600">{{ subtitle }}</p>
          </div>
        </div>
        <button 
          @click="cancel" 
          class="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-all duration-200"
        >
          <span class="text-2xl">✕</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <div class="mb-6">
          <p class="text-gray-700 text-base mb-4">
            {{ message }}
          </p>
          
          <!-- Item Info (if provided) -->
          <div v-if="itemName" class="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 mb-4">
            <div class="flex items-center space-x-3">
              <span v-if="itemIcon" class="text-4xl">{{ itemIcon }}</span>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate">
                  {{ itemName }}
                </p>
                <p v-if="itemDetails" class="text-sm text-gray-500">
                  {{ itemDetails }}
                </p>
              </div>
            </div>
          </div>

          <!-- Info/Warning Message -->
          <div v-if="infoMessage" :class="infoBoxClass" class="border-l-4 p-4 rounded">
            <div class="flex items-start">
              <span class="text-xl mr-2">{{ infoIcon }}</span>
              <div>
                <p v-if="infoTitle" class="text-sm font-medium mb-1" :class="infoTitleClass">
                  {{ infoTitle }}
                </p>
                <p class="text-sm" :class="infoTextClass">
                  {{ infoMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-3">
          <button 
            @click="cancel"
            :disabled="loading"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="confirm"
            :disabled="loading"
            class="flex-1 px-6 py-3 rounded-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            :class="confirmButtonClass"
          >
            <span v-if="!loading" class="flex items-center">
              <span v-if="confirmIcon" class="mr-2">{{ confirmIcon }}</span>
              {{ confirmText }}
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loadingText }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'warning', // warning, danger, info, success
      validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '⚠️'
    },
    itemName: {
      type: String,
      default: ''
    },
    itemIcon: {
      type: String,
      default: ''
    },
    itemDetails: {
      type: String,
      default: ''
    },
    infoMessage: {
      type: String,
      default: ''
    },
    infoTitle: {
      type: String,
      default: ''
    },
    infoIcon: {
      type: String,
      default: 'ℹ️'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    confirmIcon: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'Processing...'
    }
  },
  computed: {
    headerClass() {
      const classes = {
        warning: 'bg-gradient-to-r from-yellow-50 to-orange-50',
        danger: 'bg-gradient-to-r from-red-50 to-orange-50',
        info: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        success: 'bg-gradient-to-r from-green-50 to-emerald-50'
      };
      return classes[this.type] || classes.warning;
    },
    iconBgClass() {
      const classes = {
        warning: 'bg-yellow-100',
        danger: 'bg-red-100',
        info: 'bg-blue-100',
        success: 'bg-green-100'
      };
      return classes[this.type] || classes.warning;
    },
    confirmButtonClass() {
      const classes = {
        warning: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white',
        info: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
        success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
      };
      return classes[this.type] || classes.warning;
    },
    infoBoxClass() {
      const classes = {
        warning: 'bg-yellow-50 border-yellow-500',
        danger: 'bg-red-50 border-red-500',
        info: 'bg-blue-50 border-blue-500',
        success: 'bg-green-50 border-green-500'
      };
      return classes[this.type] || classes.info;
    },
    infoTitleClass() {
      const classes = {
        warning: 'text-yellow-900',
        danger: 'text-red-900',
        info: 'text-blue-900',
        success: 'text-green-900'
      };
      return classes[this.type] || classes.info;
    },
    infoTextClass() {
      const classes = {
        warning: 'text-yellow-700',
        danger: 'text-red-700',
        info: 'text-blue-700',
        success: 'text-green-700'
      };
      return classes[this.type] || classes.info;
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

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
</style>

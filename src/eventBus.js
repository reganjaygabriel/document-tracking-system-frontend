// Simple event bus for Vue 3
class EventBus {
  constructor() {
    this.events = {};
  }

  $on(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }

  $off(eventName, fn) {
    if (this.events[eventName]) {
      const index = this.events[eventName].indexOf(fn);
      if (index > -1) {
        this.events[eventName].splice(index, 1);
      }
    }
  }

  $emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(fn => fn(data));
    }
  }
}

export default new EventBus();

// WayFair Utilities Module

class Utils {
    // Format currency
    static formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Format date
    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // Format time only
    static formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // Calculate distance
    static calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Validate email
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate phone
    static validatePhone(phone) {
        const re = /^\+?1?\d{9,15}$/;
        return re.test(phone);
    }

    // Generate random ID
    static generateId(prefix = '') {
        return prefix + Math.random().toString(36).substring(2, 11).toUpperCase();
    }

    // Deep clone object
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Sort array by property
    static sortBy(array, property, ascending = true) {
        return array.sort((a, b) => {
            if (a[property] < b[property]) return ascending ? -1 : 1;
            if (a[property] > b[property]) return ascending ? 1 : -1;
            return 0;
        });
    }

    // Filter by property
    static filterBy(array, property, value) {
        return array.filter(item => item[property] === value);
    }

    // Group by property
    static groupBy(array, property) {
        return array.reduce((acc, item) => {
            const key = item[property];
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }

    // Get initials from name
    static getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Truncate string
    static truncate(str, length = 50) {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    // Check if online
    static isOnline() {
        return navigator.onLine;
    }

    // Get device type
    static getDeviceType() {
        if (/Mobile|Android|iPhone/.test(navigator.userAgent)) return 'mobile';
        if (/iPad|Tablet/.test(navigator.userAgent)) return 'tablet';
        return 'desktop';
    }

    // Local storage utilities
    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }

    static clearStorage() {
        localStorage.clear();
    }

    // Show toast notification
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#3b82f6'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }
}

// Export or make global
window.Utils = Utils;

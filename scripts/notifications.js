// WayFair Notification Service

class NotificationService {
    constructor() {
        this.notifications = this.loadNotifications();
        this.preferences = this.loadPreferences();
        this.initializeNotifications();
    }

    // Initialize notifications
    initializeNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // Create notification
    createNotification(title, options = {}) {
        const notification = {
            id: 'NOT' + Date.now(),
            title,
            message: options.message || '',
            type: options.type || 'info',
            icon: options.icon || '../assets/icons/logo.png',
            read: false,
            createdAt: new Date(),
            action: options.action || null
        };

        this.notifications.push(notification);
        this.saveNotifications();

        // Send browser notification if enabled
        if (this.preferences.enableBrowserNotifications && Notification.permission === 'granted') {
            new Notification(title, {
                body: notification.message,
                icon: notification.icon
            });
        }

        return notification;
    }

    // Send ride update notification
    sendRideNotification(rideId, message, type = 'info') {
        return this.createNotification('Ride Update', {
            message: message,
            type: type,
            action: { rideId, type: 'view_ride' }
        });
    }

    // Send payment notification
    sendPaymentNotification(amount, status) {
        return this.createNotification('Payment ' + status, {
            message: `$${amount} payment ${status.toLowerCase()}`,
            type: status === 'Completed' ? 'success' : 'pending'
        });
    }

    // Send message notification
    sendMessageNotification(senderName, preview) {
        return this.createNotification(`Message from ${senderName}`, {
            message: Utils.truncate(preview, 100),
            type: 'message'
        });
    }

    // Send SOS notification (for admin/nearby users)
    sendSOSNotification(userId, location) {
        return this.createNotification('⚠️ SOS Alert', {
            message: `User needs emergency assistance at ${location}`,
            type: 'warning',
            action: { userId, type: 'view_sos' }
        });
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    // Mark all as read
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
    }

    // Get notifications
    getNotifications(unreadOnly = false) {
        if (unreadOnly) {
            return this.notifications.filter(n => !n.read);
        }
        return this.notifications.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Delete notification
    deleteNotification(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index > -1) {
            this.notifications.splice(index, 1);
            this.saveNotifications();
        }
    }

    // Clear all notifications
    clearAllNotifications() {
        this.notifications = [];
        this.saveNotifications();
    }

    // Get unread count
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    // Update preferences
    updatePreferences(preferences) {
        Object.assign(this.preferences, preferences);
        this.savePreferences();
    }

    // Get preferences
    getPreferences() {
        return this.preferences;
    }

    // Load notifications
    loadNotifications() {
        const data = localStorage.getItem('wayfairNotifications');
        return data ? JSON.parse(data) : [];
    }

    // Save notifications
    saveNotifications() {
        localStorage.setItem('wayfairNotifications', JSON.stringify(this.notifications));
    }

    // Load preferences
    loadPreferences() {
        const data = localStorage.getItem('wayfairNotificationPrefs');
        return data ? JSON.parse(data) : {
            enableBrowserNotifications: true,
            enableEmailNotifications: true,
            enableSMSNotifications: false,
            enableRideUpdates: true,
            enablePaymentUpdates: true,
            enableMessageNotifications: true,
            enableSOSAlerts: true
        };
    }

    // Save preferences
    savePreferences() {
        localStorage.setItem('wayfairNotificationPrefs', JSON.stringify(this.preferences));
    }
}

// Initialize notification service
const notificationService = new NotificationService();

// Listen for events to trigger notifications
document.addEventListener('rideCreated', (e) => {
    notificationService.sendRideNotification(e.detail.rideId, 'Your ride has been created!', 'success');
});

document.addEventListener('rideAccepted', (e) => {
    notificationService.sendRideNotification(e.detail.rideId, 'Your ride has been accepted!', 'success');
});

document.addEventListener('paymentCompleted', (e) => {
    notificationService.sendPaymentNotification(e.detail.amount, 'Completed');
});

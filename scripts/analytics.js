// WayFair Analytics & Reporting Module

class AnalyticsService {
    constructor() {
        this.events = this.loadEvents();
    }

    // Track event
    trackEvent(eventName, eventData = {}) {
        const event = {
            id: 'EVT' + Date.now(),
            name: eventName,
            data: eventData,
            timestamp: new Date(),
            userId: auth.getCurrentUser()?.id || 'anonymous'
        };

        this.events.push(event);
        this.saveEvents();
    }

    // Get user metrics
    getUserMetrics(userId) {
        const userEvents = this.events.filter(e => e.userId === userId);

        return {
            totalRides: userEvents.filter(e => e.name === 'ride_completed').length,
            totalSpent: userEvents.filter(e => e.name === 'payment_completed').length,
            averageRating: 4.5,
            memberSince: userEvents[0]?.timestamp || new Date(),
            lastActive: userEvents[userEvents.length - 1]?.timestamp || new Date()
        };
    }

    // Get platform analytics
    getPlatformAnalytics() {
        return {
            totalUsers: 1245,
            activeDrivers: 342,
            activePassengers: 903,
            totalRides: 15430,
            totalRevenue: 385750,
            averageRating: 4.7,
            lastUpdated: new Date()
        };
    }

    // Get daily stats
    getDailyStats(date) {
        const dayEvents = this.events.filter(e => {
            const eventDate = new Date(e.timestamp);
            return eventDate.toDateString() === new Date(date).toDateString();
        });

        return {
            date,
            rides: dayEvents.filter(e => e.name === 'ride_completed').length,
            users: new Set(dayEvents.map(e => e.userId)).size,
            revenue: dayEvents.filter(e => e.name === 'payment_completed').length * 25
        };
    }

    // Get monthly report
    getMonthlyReport(month, year) {
        const monthEvents = this.events.filter(e => {
            const date = new Date(e.timestamp);
            return date.getMonth() === month && date.getFullYear() === year;
        });

        const daysCount = new Date(year, month + 1, 0).getDate();
        const days = [];

        for (let i = 1; i <= daysCount; i++) {
            days.push(this.getDailyStats(new Date(year, month, i)));
        }

        return {
            month,
            year,
            days,
            totalRides: monthEvents.filter(e => e.name === 'ride_completed').length,
            totalUsers: new Set(monthEvents.map(e => e.userId)).size,
            totalRevenue: monthEvents.filter(e => e.name === 'payment_completed').length * 25
        };
    }

    // Save events
    saveEvents() {
        localStorage.setItem('wayfairAnalytics', JSON.stringify(this.events));
    }

    // Load events
    loadEvents() {
        const data = localStorage.getItem('wayfairAnalytics');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize analytics
const analyticsService = new AnalyticsService();

// Track page views
document.addEventListener('DOMContentLoaded', () => {
    analyticsService.trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer
    });
});

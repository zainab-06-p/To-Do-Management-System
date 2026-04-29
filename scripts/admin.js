// WayFair Admin Module

class AdminService {
    constructor() {
        this.currentUser = auth.getCurrentUser();
        if (this.currentUser?.role !== 'admin') {
            throw new Error('Admin access required');
        }
        this.users = this.loadAllUsers();
        this.reports = this.loadReports();
    }

    // Get all users
    getAllUsers() {
        return this.users;
    }

    // Get user by ID
    getUserById(userId) {
        return this.users.find(u => u.id === userId);
    }

    // Block user
    blockUser(userId, reason = '') {
        const user = this.users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');

        user.blocked = true;
        user.blockedReason = reason;
        user.blockedAt = new Date();
        user.blockedBy = this.currentUser.id;

        this.saveUsers();
        return user;
    }

    // Unblock user
    unblockUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');

        user.blocked = false;
        user.blockedReason = null;
        user.blockedAt = null;

        this.saveUsers();
        return user;
    }

    // Verify user documents
    verifyDocuments(userId, documentIds, approved = true) {
        const verification = {
            id: 'VER' + Date.now(),
            userId,
            documentIds,
            approved,
            verifiedBy: this.currentUser.id,
            verifiedAt: new Date()
        };

        if (approved) {
            const user = this.users.find(u => u.id === userId);
            if (user) user.verified = true;
        }

        this.saveUsers();
        return verification;
    }

    // File report
    fileReport(reportedUserId, reportedByUserId, reason, details = '') {
        const report = {
            id: 'RPT' + Date.now(),
            reportedUserId,
            reportedByUserId,
            reason,
            details,
            status: 'open',
            createdAt: new Date(),
            resolvedAt: null,
            resolution: null
        };

        this.reports.push(report);
        this.saveReports();
        return report;
    }

    // Resolve report
    resolveReport(reportId, resolution, action = '') {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) throw new Error('Report not found');

        report.status = 'resolved';
        report.resolvedAt = new Date();
        report.resolution = resolution;

        if (action === 'block') {
            this.blockUser(report.reportedUserId, `Report: ${report.reason}`);
        }

        this.saveReports();
        return report;
    }

    // Get admin dashboard stats
    getDashboardStats() {
        return {
            totalUsers: this.users.length,
            activeRides: Math.floor(Math.random() * 100) + 50,
            pendingVerifications: this.users.filter(u => !u.verified).length,
            blockedUsers: this.users.filter(u => u.blocked).length,
            openReports: this.reports.filter(r => r.status === 'open').length,
            totalTransactions: Math.floor(Math.random() * 10000) + 1000,
            sosAlerts: Math.floor(Math.random() * 5) + 1
        };
    }

    // Get payment analytics
    getPaymentAnalytics() {
        return {
            totalRevenue: Math.floor(Math.random() * 50000) + 10000,
            averageRidePrice: 25.50,
            commissionEarned: Math.floor(Math.random() * 5000) + 1000,
            activeWallets: Math.floor(Math.random() * 500) + 200,
            pendingPayouts: Math.floor(Math.random() * 50) + 10
        };
    }

    // Get reports
    getReports(status = null) {
        if (status) {
            return this.reports.filter(r => r.status === status);
        }
        return this.reports;
    }

    // Save users
    saveUsers() {
        localStorage.setItem('wayfairAllUsers', JSON.stringify(this.users));
    }

    // Load users
    loadAllUsers() {
        const data = localStorage.getItem('wayfairAllUsers');
        return data ? JSON.parse(data) : [];
    }

    // Save reports
    saveReports() {
        localStorage.setItem('wayfairReports', JSON.stringify(this.reports));
    }

    // Load reports
    loadReports() {
        const data = localStorage.getItem('wayfairReports');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize admin service only for admin users
let adminService = null;
if (auth.getCurrentUser()?.role === 'admin') {
    adminService = new AdminService();
}

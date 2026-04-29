// WayFair SOS (Safety) Service

class SOSService {
    constructor() {
        this.alerts = this.loadAlerts();
        this.emergencyContacts = this.loadEmergencyContacts();
        this.trustedUsers = this.loadTrustedUsers();
    }

    // Create SOS alert
    createAlert(userId, currentLocation, description = '') {
        const alert = {
            id: 'SOS' + Date.now(),
            userId,
            location: currentLocation,
            description,
            status: 'open',
            createdAt: new Date(),
            respondedAt: null,
            resolvedAt: null,
            respondedBy: null,
            nearbyHelp: []
        };

        this.alerts.push(alert);
        this.saveAlerts();

        // Notify emergency services
        this.notifyEmergencyServices(alert);

        // Notify trusted contacts
        this.notifyTrustedContacts(userId, alert);

        return alert;
    }

    // Respond to SOS alert
    respondToAlert(alertId, responderId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (!alert) throw new Error('Alert not found');

        alert.status = 'responding';
        alert.respondedAt = new Date();
        alert.respondedBy = responderId;

        this.saveAlerts();
        return alert;
    }

    // Resolve SOS alert
    resolveAlert(alertId, resolution = '') {
        const alert = this.alerts.find(a => a.id === alertId);
        if (!alert) throw new Error('Alert not found');

        alert.status = 'resolved';
        alert.resolvedAt = new Date();
        alert.resolution = resolution;

        this.saveAlerts();
        return alert;
    }

    // Add emergency contact
    addEmergencyContact(userId, name, phone, relationship = '') {
        const contact = {
            id: 'EC' + Date.now(),
            userId,
            name,
            phone,
            relationship,
            addedAt: new Date()
        };

        this.emergencyContacts.push(contact);
        this.saveEmergencyContacts();
        return contact;
    }

    // Get emergency contacts
    getEmergencyContacts(userId) {
        return this.emergencyContacts.filter(c => c.userId === userId);
    }

    // Add trusted user
    addTrustedUser(userId, trustedUserId) {
        const trusted = {
            id: 'TR' + Date.now(),
            userId,
            trustedUserId,
            addedAt: new Date()
        };

        this.trustedUsers.push(trusted);
        this.saveTrustedUsers();
        return trusted;
    }

    // Get trusted users
    getTrustedUsers(userId) {
        return this.trustedUsers.filter(t => t.userId === userId);
    }

    // Share live location with trusted users
    shareLiveLocation(userId, duration = 3600000) { // 1 hour default
        return {
            userId,
            sharedAt: new Date(),
            expiresAt: new Date(Date.now() + duration),
            viewers: this.getTrustedUsers(userId).map(t => t.trustedUserId)
        };
    }

    // Get nearby police/ambulance (mock)
    getNearbyEmergencyServices(location) {
        return [
            {
                type: 'police',
                name: 'Downtown Police Station',
                distance: 2.5,
                eta: 5
            },
            {
                type: 'ambulance',
                name: 'City Hospital',
                distance: 3.2,
                eta: 8
            }
        ];
    }

    // Notify emergency services
    notifyEmergencyServices(alert) {
        // Mock notification
        console.log('Emergency services notified about:', alert);
    }

    // Notify trusted contacts
    notifyTrustedContacts(userId, alert) {
        const contacts = this.getEmergencyContacts(userId);
        contacts.forEach(contact => {
            console.log(`Notifying ${contact.name} at ${contact.phone}`);
        });
    }

    // Get active alerts
    getActiveAlerts() {
        return this.alerts.filter(a => a.status !== 'resolved');
    }

    // Get user's alerts
    getUserAlerts(userId) {
        return this.alerts.filter(a => a.userId === userId);
    }

    // Save alerts
    saveAlerts() {
        localStorage.setItem('wayfairSOSAlerts', JSON.stringify(this.alerts));
    }

    // Load alerts
    loadAlerts() {
        const data = localStorage.getItem('wayfairSOSAlerts');
        return data ? JSON.parse(data) : [];
    }

    // Save emergency contacts
    saveEmergencyContacts() {
        localStorage.setItem('wayfairEmergencyContacts', JSON.stringify(this.emergencyContacts));
    }

    // Load emergency contacts
    loadEmergencyContacts() {
        const data = localStorage.getItem('wayfairEmergencyContacts');
        return data ? JSON.parse(data) : [];
    }

    // Save trusted users
    saveTrustedUsers() {
        localStorage.setItem('wayfairTrustedUsers', JSON.stringify(this.trustedUsers));
    }

    // Load trusted users
    loadTrustedUsers() {
        const data = localStorage.getItem('wayfairTrustedUsers');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize SOS service
const sosService = new SOSService();

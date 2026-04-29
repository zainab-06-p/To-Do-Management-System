// WayFair Live Tracking Module

class LiveTracker {
    constructor() {
        this.activeRides = new Map();
        this.locations = new Map();
        this.updateInterval = 5000; // Update every 5 seconds
    }

    // Start tracking
    startTracking(rideId, initialLat, initialLng) {
        const ride = {
            id: rideId,
            currentLocation: { lat: initialLat, lng: initialLng },
            startedAt: new Date(),
            path: [{ lat: initialLat, lng: initialLng, time: new Date() }],
            status: 'active'
        };

        this.activeRides.set(rideId, ride);
        this.startPositionUpdates(rideId);
        return ride;
    }

    // Update location
    updateLocation(rideId, lat, lng) {
        const ride = this.activeRides.get(rideId);
        if (!ride) return null;

        ride.currentLocation = { lat, lng };
        ride.path.push({ lat, lng, time: new Date() });

        return ride;
    }

    // Get current location
    getCurrentLocation(rideId) {
        const ride = this.activeRides.get(rideId);
        return ride ? ride.currentLocation : null;
    }

    // Get ride path
    getRidePath(rideId) {
        const ride = this.activeRides.get(rideId);
        return ride ? ride.path : [];
    }

    // Calculate ETA
    calculateETA(currentLat, currentLng, destLat, destLng) {
        // Mock calculation
        const distance = Math.sqrt(
            Math.pow(destLat - currentLat, 2) + Math.pow(destLng - currentLng, 2)
        ) * 111; // Approximate km
        const avgSpeed = 40; // km/h
        return Math.ceil((distance / avgSpeed) * 60); // minutes
    }

    // Get speed
    getSpeed(rideId) {
        const ride = this.activeRides.get(rideId);
        if (!ride || ride.path.length < 2) return 0;

        const lastPoint = ride.path[ride.path.length - 1];
        const prevPoint = ride.path[ride.path.length - 2];

        const distance = Math.sqrt(
            Math.pow(lastPoint.lat - prevPoint.lat, 2) +
            Math.pow(lastPoint.lng - prevPoint.lng, 2)
        ) * 111;

        const timeDiff = (lastPoint.time - prevPoint.time) / 3600000;
        return Math.round(distance / timeDiff);
    }

    // Stop tracking
    stopTracking(rideId) {
        const ride = this.activeRides.get(rideId);
        if (ride) {
            ride.status = 'completed';
            ride.endedAt = new Date();
        }
        this.activeRides.delete(rideId);
    }

    // Simulate position updates
    startPositionUpdates(rideId) {
        const updateTimer = setInterval(() => {
            const ride = this.activeRides.get(rideId);
            if (!ride) {
                clearInterval(updateTimer);
                return;
            }

            // Simulate movement
            const newLat = ride.currentLocation.lat + (Math.random() - 0.5) * 0.0001;
            const newLng = ride.currentLocation.lng + (Math.random() - 0.5) * 0.0001;

            this.updateLocation(rideId, newLat, newLng);
            this.broadcastLocationUpdate(rideId);
        }, this.updateInterval);
    }

    // Broadcast location update
    broadcastLocationUpdate(rideId) {
        const event = new CustomEvent('locationUpdate', {
            detail: {
                rideId,
                location: this.getCurrentLocation(rideId),
                speed: this.getSpeed(rideId)
            }
        });
        document.dispatchEvent(event);
    }

    // Get active rides
    getActiveRides() {
        return Array.from(this.activeRides.values());
    }

    // Check if ride is being tracked
    isTracking(rideId) {
        return this.activeRides.has(rideId);
    }
}

// Initialize live tracker
const liveTracker = new LiveTracker();

// Listen for location updates
document.addEventListener('locationUpdate', (e) => {
    console.log('Location updated:', e.detail);
    // Update map or display
});

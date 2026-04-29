// WayFair Geolocation & Maps Service

class GeolocationService {
    constructor() {
        this.currentLocation = null;
        this.watchId = null;
        this.locationHistory = [];
    }

    // Get current location
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date(position.timestamp)
                    };
                    this.currentLocation = location;
                    this.locationHistory.push(location);
                    resolve(location);
                },
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 5000 }
            );
        });
    }

    // Watch location changes
    watchLocation(callback) {
        if (!navigator.geolocation) {
            throw new Error('Geolocation not supported');
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    speed: position.coords.speed,
                    heading: position.coords.heading,
                    timestamp: new Date(position.timestamp)
                };
                this.currentLocation = location;
                this.locationHistory.push(location);
                callback(location);
            },
            (error) => console.error('Geolocation error:', error),
            { enableHighAccuracy: true }
        );
    }

    // Stop watching location
    stopWatching() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    // Calculate distance between two points
    calculateDistance(from, to) {
        return Utils.calculateDistance(from.lat, from.lng, to.lat, to.lng);
    }

    // Get location address (reverse geocoding)
    async getAddress(location) {
        // Mock implementation
        return {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA'
        };
    }

    // Get location from address (geocoding)
    async getLocationFromAddress(address) {
        // Mock implementation
        return {
            lat: 40.7128,
            lng: -74.0060
        };
    }

    // Get nearby places
    async getNearbyPlaces(type = 'restaurant') {
        // Mock implementation
        return [
            { name: 'Place 1', distance: 0.5, rating: 4.5 },
            { name: 'Place 2', distance: 1.2, rating: 4.2 }
        ];
    }

    // Calculate route
    async calculateRoute(from, to) {
        // Mock implementation
        return {
            distance: this.calculateDistance(from, to),
            duration: 25, // minutes
            route: []
        };
    }

    // Get location history
    getLocationHistory(limit = 100) {
        return this.locationHistory.slice(-limit);
    }

    // Clear location history
    clearLocationHistory() {
        this.locationHistory = [];
    }
}

// Initialize geolocation service
const geolocationService = new GeolocationService();

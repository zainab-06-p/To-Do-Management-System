// WayFair Rides Management Module

class RidesManager {
    constructor() {
        this.rides = this.loadRides();
        this.currentUser = auth.getCurrentUser();
        this.init();
    }

    init() {
        this.setupSearchForm();
        this.renderRides();
    }

    // Create a new ride
    createRide(fromLocation, toLocation, departureTime, seatsAvailable, pricePerSeat) {
        const ride = {
            id: 'RD' + Date.now(),
            driverId: this.currentUser.id,
            driverName: this.currentUser.name,
            driverRating: 4.8,
            fromLocation,
            toLocation,
            departureTime,
            seatsAvailable,
            seatsBooked: 0,
            pricePerSeat,
            totalPrice: seatsAvailable * pricePerSeat,
            status: 'open',
            passengers: [],
            createdAt: new Date(),
            route: `${fromLocation} → ${toLocation}`
        };

        this.rides.push(ride);
        this.saveRides();
        return ride;
    }

    // Search rides
    searchRides(fromLocation, toLocation, date) {
        return this.rides.filter(ride => {
            return ride.fromLocation.toLowerCase().includes(fromLocation.toLowerCase()) &&
                   ride.toLocation.toLowerCase().includes(toLocation.toLowerCase()) &&
                   ride.status === 'open' &&
                   ride.seatsAvailable > ride.seatsBooked;
        });
    }

    // Get user's rides (for driver)
    getUserRides(userId) {
        return this.rides.filter(ride => ride.driverId === userId);
    }

    // Get ride details
    getRideDetails(rideId) {
        return this.rides.find(ride => ride.id === rideId);
    }

    // Book a ride
    bookRide(rideId, passengerId) {
        const ride = this.rides.find(r => r.id === rideId);
        if (!ride) throw new Error('Ride not found');
        if (ride.seatsAvailable <= ride.seatsBooked) throw new Error('No seats available');

        ride.passengers.push(passengerId);
        ride.seatsBooked += 1;
        this.saveRides();

        // Create booking record
        const booking = {
            id: 'BK' + Date.now(),
            rideId,
            passengerId,
            driverId: ride.driverId,
            route: ride.route,
            price: ride.pricePerSeat,
            status: 'confirmed',
            createdAt: new Date()
        };

        return booking;
    }

    // Start ride
    startRide(rideId) {
        const ride = this.rides.find(r => r.id === rideId);
        if (!ride) throw new Error('Ride not found');

        ride.status = 'active';
        ride.startedAt = new Date();
        this.saveRides();
        return ride;
    }

    // End ride
    endRide(rideId) {
        const ride = this.rides.find(r => r.id === rideId);
        if (!ride) throw new Error('Ride not found');

        ride.status = 'completed';
        ride.endedAt = new Date();
        this.saveRides();
        return ride;
    }

    // Cancel ride
    cancelRide(rideId, reason = '') {
        const ride = this.rides.find(r => r.id === rideId);
        if (!ride) throw new Error('Ride not found');

        ride.status = 'cancelled';
        ride.cancelledAt = new Date();
        ride.cancellationReason = reason;
        this.saveRides();
        return ride;
    }

    // Rate driver/passenger
    rateUser(fromUserId, toUserId, rating, comment = '') {
        const review = {
            id: 'REV' + Date.now(),
            fromUserId,
            toUserId,
            rating,
            comment,
            createdAt: new Date()
        };

        const reviews = this.loadReviews();
        reviews.push(review);
        localStorage.setItem('wayfairReviews', JSON.stringify(reviews));
        return review;
    }

    // Setup search form
    setupSearchForm() {
        const searchForm = document.querySelector('.search-form form');
        if (!searchForm) return;

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fromInput = searchForm.querySelectorAll('input')[0];
            const toInput = searchForm.querySelectorAll('input')[1];

            const results = this.searchRides(fromInput.value, toInput.value, new Date());
            this.displayRides(results);
        });
    }

    // Display rides
    displayRides(rides) {
        const resultsDiv = document.getElementById('ride-results');
        if (!resultsDiv) return;

        if (rides.length === 0) {
            resultsDiv.innerHTML = '<p>No rides found. Try different search criteria.</p>';
            return;
        }

        resultsDiv.innerHTML = rides.map(ride => `
            <div class="ride-card">
                <div class="driver-info">
                    <h4>${ride.driverName}</h4>
                    <p>★ ${ride.driverRating} (250 ratings)</p>
                </div>
                <div class="ride-details">
                    <p><strong>Route:</strong> ${ride.route}</p>
                    <p><strong>Departure:</strong> ${ride.departureTime}</p>
                    <p><strong>Seats Available:</strong> ${ride.seatsAvailable - ride.seatsBooked}</p>
                    <p><strong>Price:</strong> $${ride.pricePerSeat}</p>
                </div>
                <button class="btn-primary" onclick="ridesManager.bookRide('${ride.id}', '${this.currentUser.id}')">Book Now</button>
            </div>
        `).join('');
    }

    // Render rides
    renderRides() {
        // Show sample rides
        const sampleRides = [
            this.createRide('Downtown', 'Airport', '10:00 AM', 3, 25),
            this.createRide('Main Street', 'City Center', '2:00 PM', 2, 15),
            this.createRide('Suburbs', 'Downtown', '5:30 PM', 4, 20)
        ];

        this.displayRides(sampleRides);
    }

    // Load rides from localStorage
    loadRides() {
        const rides = localStorage.getItem('wayfairRides');
        return rides ? JSON.parse(rides) : [];
    }

    // Save rides to localStorage
    saveRides() {
        localStorage.setItem('wayfairRides', JSON.stringify(this.rides));
    }

    // Load reviews from localStorage
    loadReviews() {
        const reviews = localStorage.getItem('wayfairReviews');
        return reviews ? JSON.parse(reviews) : [];
    }

    // Get average rating
    getAverageRating(userId) {
        const reviews = this.loadReviews();
        const userReviews = reviews.filter(r => r.toUserId === userId);
        if (userReviews.length === 0) return 5;
        const sum = userReviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / userReviews.length).toFixed(1);
    }

    // Get live tracking data (mock)
    getLiveTrackingData(rideId) {
        return {
            rideId,
            currentLat: 40.7128 + (Math.random() - 0.5) * 0.01,
            currentLng: -74.0060 + (Math.random() - 0.5) * 0.01,
            eta: Math.floor(Math.random() * 15) + 1,
            speed: Math.floor(Math.random() * 60) + 20,
            distance: (Math.random() * 5).toFixed(1),
            status: 'on_the_way'
        };
    }

    // Get SOS alerts
    getSosAlerts() {
        return [
            { id: 'SOS001', userId: 'USR001', location: 'Main St', time: new Date(), status: 'responded' }
        ];
    }
}

// Initialize rides manager
let ridesManager;
document.addEventListener('DOMContentLoaded', () => {
    ridesManager = new RidesManager();
});

// Add sample data if not exists
function initializeSampleData() {
    const existingRides = localStorage.getItem('wayfairRides');
    if (!existingRides) {
        ridesManager.createRide('Downtown', 'Airport', '10:00 AM', 3, 25);
        ridesManager.createRide('Main Street', 'City Center', '2:00 PM', 2, 15);
        ridesManager.createRide('Suburbs', 'Downtown', '5:30 PM', 4, 20);
    }
}

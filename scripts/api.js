// WayFair API Client

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL || 'https://api.wayfair.com/v1';
        this.token = this.getToken();
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Get stored token
    getToken() {
        return localStorage.getItem('authToken');
    }

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(email, password, name, phone, role) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, phone, role })
        });
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    // Rides endpoints
    async searchRides(fromLocation, toLocation, date) {
        return this.request(`/rides/search?from=${fromLocation}&to=${toLocation}&date=${date}`);
    }

    async createRide(rideData) {
        return this.request('/rides', {
            method: 'POST',
            body: JSON.stringify(rideData)
        });
    }

    async getRideDetails(rideId) {
        return this.request(`/rides/${rideId}`);
    }

    async bookRide(rideId) {
        return this.request(`/rides/${rideId}/book`, {
            method: 'POST'
        });
    }

    // User endpoints
    async getUserProfile() {
        return this.request('/users/profile');
    }

    async updateProfile(updates) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    // Payment endpoints
    async processPayment(paymentData) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    // Chat endpoints
    async sendMessage(rideId, message) {
        return this.request(`/chat/${rideId}/send`, {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    }

    async getMessages(rideId) {
        return this.request(`/chat/${rideId}/messages`);
    }

    // Rating endpoints
    async submitRating(rideId, rating, comment) {
        return this.request(`/rides/${rideId}/rate`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment })
        });
    }

    // Blockchain endpoints
    async getBlockchainData() {
        return this.request('/blockchain/data');
    }

    async getRideTransactions(rideId) {
        return this.request(`/blockchain/rides/${rideId}/transactions`);
    }
}

// Initialize API client
const api = new APIClient();

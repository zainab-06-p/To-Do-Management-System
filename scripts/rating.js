// WayFair Rating & Review Service

class RatingService {
    constructor() {
        this.reviews = this.loadReviews();
    }

    // Submit review
    submitReview(rideId, fromUserId, toUserId, rating, comment = '', category = 'driver') {
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        const review = {
            id: 'REV' + Date.now(),
            rideId,
            fromUserId,
            toUserId,
            rating,
            comment,
            category,
            createdAt: new Date(),
            helpful: 0,
            flagged: false
        };

        this.reviews.push(review);
        this.saveReviews();
        return review;
    }

    // Get user reviews
    getUserReviews(userId) {
        return this.reviews.filter(r => r.toUserId === userId);
    }

    // Get user rating
    getUserRating(userId) {
        const userReviews = this.getUserReviews(userId);
        if (userReviews.length === 0) return 5;

        const sum = userReviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / userReviews.length).toFixed(1);
    }

    // Get rating breakdown
    getRatingBreakdown(userId) {
        const userReviews = this.getUserReviews(userId);
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        userReviews.forEach(review => {
            breakdown[review.rating]++;
        });

        return breakdown;
    }

    // Mark review as helpful
    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful++;
            this.saveReviews();
        }
    }

    // Flag review (inappropriate)
    flagReview(reviewId, reason = '') {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.flagged = true;
            review.flagReason = reason;
            this.saveReviews();
        }
    }

    // Get ride reviews
    getRideReviews(rideId) {
        return this.reviews.filter(r => r.rideId === rideId);
    }

    // Delete review (admin only)
    deleteReview(reviewId) {
        const index = this.reviews.findIndex(r => r.id === reviewId);
        if (index > -1) {
            this.reviews.splice(index, 1);
            this.saveReviews();
            return true;
        }
        return false;
    }

    // Get top rated users
    getTopRatedUsers(limit = 10) {
        const users = {};

        this.reviews.forEach(review => {
            if (!users[review.toUserId]) {
                users[review.toUserId] = { reviews: [], rating: 0 };
            }
            users[review.toUserId].reviews.push(review);
        });

        return Object.entries(users)
            .map(([userId, data]) => ({
                userId,
                rating: data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length,
                reviewCount: data.reviews.length
            }))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    // Save reviews
    saveReviews() {
        localStorage.setItem('wayfairReviews', JSON.stringify(this.reviews));
    }

    // Load reviews
    loadReviews() {
        const data = localStorage.getItem('wayfairReviews');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize rating service
const ratingService = new RatingService();

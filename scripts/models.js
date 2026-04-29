// WayFair Database Models

const Models = {
    // User Model
    User: {
        id: String,
        email: String,
        password: String,
        name: String,
        phone: String,
        role: String, // 'passenger', 'driver', 'admin'
        verified: Boolean,
        blocked: Boolean,
        walletAddress: String,
        profilePhoto: String,
        documents: Array,
        rating: Number,
        reviews: Array,
        createdAt: Date,
        updatedAt: Date
    },

    // Ride Model
    Ride: {
        id: String,
        driverId: String,
        fromLocation: String,
        toLocation: String,
        departureTime: String,
        seatsAvailable: Number,
        seatsBooked: Number,
        pricePerSeat: Number,
        passengers: Array,
        status: String, // 'open', 'active', 'completed', 'cancelled'
        createdAt: Date,
        startedAt: Date,
        endedAt: Date,
        route: String,
        estimatedDuration: Number
    },

    // Booking Model
    Booking: {
        id: String,
        rideId: String,
        passengerId: String,
        driverId: String,
        status: String, // 'pending', 'confirmed', 'active', 'completed', 'cancelled'
        price: Number,
        paymentStatus: String,
        createdAt: Date,
        completedAt: Date,
        feedback: Object
    },

    // Payment Model
    Payment: {
        id: String,
        userId: String,
        rideId: String,
        amount: Number,
        method: String, // 'card', 'wallet', 'crypto'
        status: String, // 'pending', 'completed', 'failed', 'refunded'
        transactionHash: String,
        createdAt: Date,
        completedAt: Date
    },

    // Message Model
    Message: {
        id: String,
        conversationId: String,
        senderId: String,
        recipientId: String,
        text: String,
        attachments: Array,
        read: Boolean,
        createdAt: Date
    },

    // Review Model
    Review: {
        id: String,
        rideId: String,
        fromUserId: String,
        toUserId: String,
        rating: Number, // 1-5
        comment: String,
        category: String, // 'driver', 'passenger'
        createdAt: Date
    },

    // Document Model
    Document: {
        id: String,
        userId: String,
        type: String, // 'license', 'id', 'insurance', 'registration'
        fileUrl: String,
        status: String, // 'pending', 'approved', 'rejected'
        uploadedAt: Date,
        verifiedAt: Date,
        verifiedBy: String
    },

    // SOSAlert Model
    SOSAlert: {
        id: String,
        userId: String,
        rideId: String,
        location: Object, // {lat, lng}
        description: String,
        status: String, // 'open', 'responding', 'resolved'
        createdAt: Date,
        respondedAt: Date,
        resolvedAt: Date
    }
};

// Export Models
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Models;
}

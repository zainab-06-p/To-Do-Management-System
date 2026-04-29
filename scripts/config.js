// WayFair Configuration

const config = {
    API_BASE_URL: 'https://api.wayfair.com',
    API_VERSION: 'v1',
    
    // Blockchain
    BLOCKCHAIN: {
        NETWORK: 'Ethereum Mainnet',
        CONTRACT_ADDRESS: '0x...',
        RPC_URL: 'https://mainnet.infura.io/v3/...'
    },

    // Payment
    PAYMENT: {
        STRIPE_KEY: 'pk_live_...',
        TRANSACTION_FEE: 0.1, // 10%
        MIN_AMOUNT: 5,
        MAX_AMOUNT: 5000
    },

    // Features
    FEATURES: {
        LIVE_TRACKING: true,
        CHAT: true,
        PAYMENT: true,
        REFERRAL: true,
        BLOCKCHAIN_EXPLORER: true,
        SOS_ALERTS: true
    },

    // Timeouts
    TIMEOUTS: {
        API_CALL: 30000,
        RIDE_ACCEPTANCE: 60000,
        PAYMENT_PROCESSING: 45000
    },

    // Validation
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_NAME_LENGTH: 50,
        PHONE_PATTERN: /^\+?1?\d{9,15}$/
    },

    // Locations
    LOCATIONS: {
        DEFAULT_CITY: 'New York',
        SUPPORTED_CITIES: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
    }
};

// Export for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

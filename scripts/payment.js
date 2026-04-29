// WayFair Payment Processing Module

class PaymentProcessor {
    constructor() {
        this.transactions = this.loadTransactions();
        this.wallets = this.loadWallets();
    }

    // Process payment
    async processPayment(userId, amount, rideId, paymentMethod = 'card') {
        try {
            const transaction = {
                id: 'TXN' + Date.now(),
                userId,
                rideId,
                amount,
                method: paymentMethod,
                status: 'pending',
                createdAt: new Date()
            };

            // Mock payment gateway
            await this.simulatePaymentGateway(amount);

            transaction.status = 'completed';
            transaction.completedAt = new Date();

            this.transactions.push(transaction);
            this.saveTransactions();

            return transaction;
        } catch (error) {
            throw new Error('Payment processing failed: ' + error.message);
        }
    }

    // Simulate payment gateway
    async simulatePaymentGateway(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true, amount });
                } else {
                    reject(new Error('Payment declined'));
                }
            }, 2000);
        });
    }

    // Get transaction history
    getTransactionHistory(userId) {
        return this.transactions.filter(t => t.userId === userId);
    }

    // Calculate commission
    calculateCommission(amount) {
        const commissionRate = 0.1; // 10%
        return amount * commissionRate;
    }

    // Transfer funds (driver earnings)
    transferFunds(driverId, amount) {
        const transfer = {
            id: 'TRF' + Date.now(),
            driverId,
            amount,
            status: 'completed',
            createdAt: new Date()
        };

        return transfer;
    }

    // Get wallet balance
    getWalletBalance(userId) {
        const wallet = this.wallets.find(w => w.userId === userId);
        return wallet ? wallet.balance : 0;
    }

    // Update wallet
    updateWallet(userId, amount, type = 'credit') {
        let wallet = this.wallets.find(w => w.userId === userId);
        
        if (!wallet) {
            wallet = {
                userId,
                balance: 0,
                currency: 'USD',
                createdAt: new Date()
            };
            this.wallets.push(wallet);
        }

        if (type === 'credit') {
            wallet.balance += amount;
        } else if (type === 'debit') {
            wallet.balance -= amount;
        }

        this.saveWallets();
        return wallet;
    }

    // Refund payment
    refundPayment(transactionId, reason = '') {
        const transaction = this.transactions.find(t => t.id === transactionId);
        if (!transaction) throw new Error('Transaction not found');

        transaction.status = 'refunded';
        transaction.refundedAt = new Date();
        transaction.refundReason = reason;

        this.saveTransactions();
        return transaction;
    }

    // Save transactions
    saveTransactions() {
        localStorage.setItem('wayfairTransactions', JSON.stringify(this.transactions));
    }

    // Load transactions
    loadTransactions() {
        const data = localStorage.getItem('wayfairTransactions');
        return data ? JSON.parse(data) : [];
    }

    // Save wallets
    saveWallets() {
        localStorage.setItem('wayfairWallets', JSON.stringify(this.wallets));
    }

    // Load wallets
    loadWallets() {
        const data = localStorage.getItem('wayfairWallets');
        return data ? JSON.parse(data) : [];
    }
}

// Initialize payment processor
const paymentProcessor = new PaymentProcessor();

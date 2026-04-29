// WayFair Main Application Module

class WayFairApp {
    constructor() {
        this.currentUser = auth.getCurrentUser();
        this.bookings = this.loadBookings();
        this.messages = this.loadMessages();
        this.referralCode = this.generateReferralCode();
        this.init();
    }

    init() {
        this.setupDashboard();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadUserData();
    }

    // Setup dashboard cards
    setupDashboard() {
        const searchRidesCard = document.getElementById('search-rides');
        if (searchRidesCard) {
            searchRidesCard.addEventListener('click', () => {
                window.location.href = './search-rides.html';
            });
        }

        const myRidesCard = document.getElementById('my-rides');
        if (myRidesCard) {
            myRidesCard.addEventListener('click', () => {
                window.location.href = './bookings.html';
            });
        }

        const createRideCard = document.getElementById('create-ride');
        if (createRideCard) {
            createRideCard.addEventListener('click', () => {
                window.location.href = './search-rides.html?mode=create';
            });
        }

        const myBookingsCard = document.getElementById('my-bookings');
        if (myBookingsCard) {
            myBookingsCard.addEventListener('click', () => {
                window.location.href = './bookings.html';
            });
        }

        const explorerCard = document.getElementById('explorer');
        if (explorerCard) {
            explorerCard.addEventListener('click', () => {
                this.openExplorer();
            });
        }

        const chatCard = document.getElementById('chat');
        if (chatCard) {
            chatCard.addEventListener('click', () => {
                this.openChat();
            });
        }
    }

    // Setup navigation
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const sidebar = document.querySelector('.sidebar');

        if (hamburger && sidebar) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn && sidebar) {
            closeBtn.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Booking actions
        const rideCards = document.querySelectorAll('.ride-card');
        rideCards.forEach(card => {
            const bookBtn = card.querySelector('.btn-primary');
            if (bookBtn && bookBtn.textContent === 'Book Now') {
                bookBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openBookingDialog(card);
                });
            }
        });

        // Tab switching for bookings
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterBookings(e.target.dataset.filter);
            });
        });

        // Chat functionality
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Profile updates
        const profileForm = document.querySelector('.profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile(new FormData(profileForm));
            });
        }
    }

    // Load user data
    loadUserData() {
        if (!this.currentUser) {
            window.location.href = '../pages/login.html';
            return;
        }

        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const userEmail = document.getElementById('user-email');
        const userPhone = document.getElementById('user-phone');

        if (userName) userName.textContent = this.currentUser.name;
        if (userRole) userRole.textContent = this.currentUser.role;
        if (userEmail) userEmail.textContent = this.currentUser.email;
        if (userPhone) userPhone.textContent = this.currentUser.phone;
    }

    // Open booking dialog
    openBookingDialog(rideCard) {
        const dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.innerHTML = `
            <div class="modal-content">
                <h3>Confirm Booking</h3>
                <p>Driver: ${rideCard.querySelector('h4').textContent}</p>
                <p>Price: ${rideCard.querySelector('p:nth-child(2)').textContent}</p>
                <div class="modal-buttons">
                    <button class="btn-primary" id="confirm-book">Confirm</button>
                    <button class="btn-secondary" id="cancel-book">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        document.getElementById('confirm-book').addEventListener('click', () => {
            this.createBooking();
            dialog.remove();
        });

        document.getElementById('cancel-book').addEventListener('click', () => {
            dialog.remove();
        });
    }

    // Create booking
    createBooking() {
        const booking = {
            id: 'BK' + Date.now(),
            userId: this.currentUser.id,
            route: 'Sample Route',
            price: 25,
            status: 'active',
            createdAt: new Date(),
            driverId: 'DRV001'
        };

        this.bookings.push(booking);
        this.saveBookings();
        alert('Booking confirmed!');
    }

    // Filter bookings
    filterBookings(filter) {
        const bookingsList = document.getElementById('bookings-list');
        if (!bookingsList) return;

        const filtered = this.bookings.filter(b => {
            if (filter === 'active') return b.status === 'active';
            if (filter === 'completed') return b.status === 'completed';
            if (filter === 'cancelled') return b.status === 'cancelled';
            return true;
        });

        this.renderBookings(filtered);
    }

    // Render bookings
    renderBookings(bookings) {
        const bookingsList = document.getElementById('bookings-list');
        if (!bookingsList) return;

        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-card">
                <h4>${booking.route}</h4>
                <p>Price: $${booking.price}</p>
                <p class="status ${booking.status}">${booking.status}</p>
            </div>
        `).join('');
    }

    // Open chat
    openChat() {
        window.location.href = '../components/chat-widget.html';
    }

    // Open explorer
    openExplorer() {
        alert('Blockchain Explorer - Showing rides, transactions, and stats');
    }

    // Send message
    sendMessage() {
        const input = document.getElementById('message-input');
        if (!input || !input.value.trim()) return;

        const message = {
            id: 'MSG' + Date.now(),
            sender: this.currentUser.id,
            text: input.value,
            timestamp: new Date()
        };

        this.messages.push(message);
        this.saveMessages();
        input.value = '';

        // Display message
        const messagesDiv = document.getElementById('chat-messages');
        if (messagesDiv) {
            const msgElement = document.createElement('div');
            msgElement.className = 'message user-message';
            msgElement.innerHTML = `
                <p>${message.text}</p>
                <small>${message.timestamp.toLocaleTimeString()}</small>
            `;
            messagesDiv.appendChild(msgElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    // Update profile
    updateProfile(formData) {
        const updates = {
            name: formData.get('name') || this.currentUser.name,
            phone: formData.get('phone') || this.currentUser.phone
        };

        auth.updateProfile(updates);
        this.currentUser = auth.getCurrentUser();
        alert('Profile updated successfully!');
    }

    // Load bookings from localStorage
    loadBookings() {
        const bookings = localStorage.getItem('wayfairBookings');
        return bookings ? JSON.parse(bookings) : [];
    }

    // Save bookings to localStorage
    saveBookings() {
        localStorage.setItem('wayfairBookings', JSON.stringify(this.bookings));
    }

    // Load messages from localStorage
    loadMessages() {
        const messages = localStorage.getItem('wayfairMessages');
        return messages ? JSON.parse(messages) : [];
    }

    // Save messages to localStorage
    saveMessages() {
        localStorage.setItem('wayfairMessages', JSON.stringify(this.messages));
    }

    // Generate referral code
    generateReferralCode() {
        return 'WAYFAIR' + this.currentUser.id.substring(3).toUpperCase();
    }

    // Get referral stats
    getReferralStats() {
        return {
            referrals: Math.floor(Math.random() * 10),
            earnings: Math.floor(Math.random() * 100)
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WayFairApp();
});

// WayFair Authentication Module

class Auth {
    constructor() {
        this.currentUser = this.loadUser();
        this.users = this.loadUsers();
    }

    // Register new user
    register(email, password, name, phone, role) {
        if (this.users.find(u => u.email === email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: 'USR' + Date.now(),
            email,
            password: this.hashPassword(password),
            name,
            phone,
            role,
            createdAt: new Date(),
            verified: false,
            walletAddress: null
        };

        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    // Login user
    login(email, password, isAdmin = false) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== this.hashPassword(password)) {
            throw new Error('Invalid password');
        }

        if (isAdmin && user.role !== 'admin') {
            throw new Error('Admin access required');
        }

        this.currentUser = user;
        this.saveUser();
        return user;
    }

    // Verify email
    verifyEmail(email, code) {
        const user = this.users.find(u => u.email === email);
        if (!user) throw new Error('User not found');
        
        user.verified = true;
        this.saveUsers();
        return user;
    }

    // Send verification code (mock)
    sendVerificationCode(email) {
        console.log(`Verification code sent to ${email}`);
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Hash password (mock - use bcrypt in production)
    hashPassword(password) {
        return btoa(password);
    }

    // Save user to localStorage
    saveUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    // Load user from localStorage
    loadUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('wayfairUsers', JSON.stringify(this.users));
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('wayfairUsers');
        if (users) {
            return JSON.parse(users);
        }
        // Create default admin user
        return [{
            id: 'ADM001',
            email: 'admin@wayfair.com',
            password: btoa('admin123'),
            name: 'Admin',
            phone: '+1234567890',
            role: 'admin',
            createdAt: new Date(),
            verified: true,
            walletAddress: '0xadmin123'
        }];
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) throw new Error('Not logged in');
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        Object.assign(this.users[userIndex], updates);
        Object.assign(this.currentUser, updates);
        
        this.saveUsers();
        this.saveUser();
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get user role
    getUserRole() {
        return this.currentUser ? this.currentUser.role : null;
    }
}

// Initialize auth
const auth = new Auth();

// Handle registration form
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const role = document.querySelector('input[name="role"]:checked').value;
            
            try {
                auth.register(
                    registerForm.querySelectorAll('input')[0].value,
                    registerForm.querySelectorAll('input')[1].value,
                    registerForm.querySelectorAll('input')[2].value,
                    registerForm.querySelectorAll('input')[3].value,
                    role
                );
                alert('Registration successful! Please verify your email.');
                window.location.href = './login.html';
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Handle login form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelectorAll('input')[0].value;
            const password = loginForm.querySelectorAll('input')[1].value;
            const isAdmin = document.getElementById('admin-mode')?.checked || false;

            try {
                auth.login(email, password, isAdmin);
                window.location.href = isAdmin ? './admin.html' : './dashboard.html';
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});

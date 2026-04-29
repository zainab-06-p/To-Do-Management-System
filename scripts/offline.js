// WayFair Offline Support Module (Service Worker)

class OfflineService {
    constructor() {
        this.cacheVersion = 'wayfair-v1';
        this.pendingRequests = this.loadPendingRequests();
        this.init();
    }

    // Initialize offline support
    init() {
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
            this.setupSyncListener();
        }
    }

    // Register service worker
    registerServiceWorker() {
        navigator.serviceWorker.register('../service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }

    // Check if online
    isOnline() {
        return navigator.onLine;
    }

    // Queue request when offline
    queueRequest(method, url, data) {
        const request = {
            id: 'REQ' + Date.now(),
            method,
            url,
            data,
            timestamp: new Date(),
            retries: 0
        };

        this.pendingRequests.push(request);
        this.savePendingRequests();
        return request;
    }

    // Sync pending requests when online
    syncPendingRequests() {
        if (!this.isOnline()) return;

        this.pendingRequests.forEach(async (request) => {
            try {
                const response = await fetch(request.url, {
                    method: request.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request.data)
                });

                if (response.ok) {
                    this.removePendingRequest(request.id);
                } else {
                    request.retries++;
                    if (request.retries > 3) {
                        this.removePendingRequest(request.id);
                    }
                }
            } catch (error) {
                console.error('Sync error:', error);
            }
        });
    }

    // Setup sync listener
    setupSyncListener() {
        window.addEventListener('online', () => {
            this.syncPendingRequests();
            notificationService?.createNotification('You are back online', {
                message: 'Syncing offline changes...',
                type: 'info'
            });
        });

        window.addEventListener('offline', () => {
            notificationService?.createNotification('You are offline', {
                message: 'Changes will sync when you reconnect',
                type: 'warning'
            });
        });
    }

    // Remove pending request
    removePendingRequest(requestId) {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
        this.savePendingRequests();
    }

    // Get pending requests
    getPendingRequests() {
        return this.pendingRequests;
    }

    // Cache static assets
    async precacheAssets() {
        const cache = await caches.open(this.cacheVersion);
        await cache.addAll([
            '../index.html',
            '../style.css',
            '../scripts/app.js',
            '../scripts/auth.js',
            '../assets/icons/',
            '../assets/images/'
        ]);
    }

    // Save pending requests
    savePendingRequests() {
        localStorage.setItem('pendingRequests', JSON.stringify(this.pendingRequests));
    }

    // Load pending requests
    loadPendingRequests() {
        const data = localStorage.getItem('pendingRequests');
        return data ? JSON.parse(data) : [];
    }

    // Clear cache
    async clearCache() {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
    }

    // Get cache size
    async getCacheSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            return await navigator.storage.estimate();
        }
        return null;
    }
}

// Initialize offline service
const offlineService = new OfflineService();

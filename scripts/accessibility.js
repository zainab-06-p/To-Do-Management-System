// WayFair Accessibility Module (WCAG 2.1 AA Compliance)

class AccessibilityService {
    constructor() {
        this.darkModeEnabled = this.loadDarkModePreference();
        this.fontSize = this.loadFontSizePreference();
        this.highContrast = this.loadHighContrastPreference();
        this.reduceMotion = this.loadReduceMotionPreference();
        this.init();
    }

    // Initialize accessibility features
    init() {
        this.applyDarkMode(this.darkModeEnabled);
        this.applyFontSize(this.fontSize);
        this.applyHighContrast(this.highContrast);
        this.applyReduceMotion(this.reduceMotion);
        this.setupKeyboardNavigation();
        this.addAriaLabels();
    }

    // Dark mode
    toggleDarkMode() {
        this.darkModeEnabled = !this.darkModeEnabled;
        this.applyDarkMode(this.darkModeEnabled);
        this.saveDarkModePreference();
    }

    applyDarkMode(enabled) {
        if (enabled) {
            document.documentElement.style.setProperty('--bg-color', '#1f2937');
            document.documentElement.style.setProperty('--text-color', '#f3f4f6');
        } else {
            document.documentElement.style.setProperty('--bg-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#1f2937');
        }
    }

    // Font size adjustment
    setFontSize(size) {
        this.fontSize = size;
        this.applyFontSize(size);
        this.saveFontSizePreference();
    }

    applyFontSize(size) {
        const scale = { small: 0.875, normal: 1, large: 1.25, xlarge: 1.5 };
        document.documentElement.style.fontSize = (16 * scale[size]) + 'px';
    }

    // High contrast mode
    toggleHighContrast() {
        this.highContrast = !this.highContrast;
        this.applyHighContrast(this.highContrast);
        this.saveHighContrastPreference();
    }

    applyHighContrast(enabled) {
        if (enabled) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    }

    // Reduce motion
    toggleReduceMotion() {
        this.reduceMotion = !this.reduceMotion;
        this.applyReduceMotion(this.reduceMotion);
        this.saveReduceMotionPreference();
    }

    applyReduceMotion(enabled) {
        if (enabled) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        } else {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Skip to main content (Alt + M)
            if (e.altKey && e.key === 'm') {
                const main = document.querySelector('main') || document.querySelector('body');
                main.focus();
                e.preventDefault();
            }
        });
    }

    // Add ARIA labels
    addAriaLabels() {
        // Add aria-labels to interactive elements
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });

        // Add roles
        document.querySelectorAll('nav').forEach(nav => {
            nav.setAttribute('role', 'navigation');
        });
    }

    // Screen reader announcements
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Preferences storage
    saveDarkModePreference() {
        localStorage.setItem('a11y_darkMode', this.darkModeEnabled);
    }

    loadDarkModePreference() {
        return localStorage.getItem('a11y_darkMode') === 'true';
    }

    saveFontSizePreference() {
        localStorage.setItem('a11y_fontSize', this.fontSize);
    }

    loadFontSizePreference() {
        return localStorage.getItem('a11y_fontSize') || 'normal';
    }

    saveHighContrastPreference() {
        localStorage.setItem('a11y_highContrast', this.highContrast);
    }

    loadHighContrastPreference() {
        return localStorage.getItem('a11y_highContrast') === 'true';
    }

    saveReduceMotionPreference() {
        localStorage.setItem('a11y_reduceMotion', this.reduceMotion);
    }

    loadReduceMotionPreference() {
        return localStorage.getItem('a11y_reduceMotion') === 'true' ||
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

// Initialize accessibility
const a11y = new AccessibilityService();

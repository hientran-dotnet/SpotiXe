/**
 * Authentication Management
 * Handles user authentication, session management, and route protection
 */

const Auth = {
    /**
     * Check if user is authenticated
     * @returns {boolean} Is authenticated
     */
    isAuthenticated() {
        const token = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        return !!token;
    },

    /**
     * Get current user data
     * @returns {Object|null} User data
     */
    getCurrentUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Set current user data
     * @param {Object} user - User data
     */
    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        } else {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
        }
    },

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {boolean} rememberMe - Remember user
     * @returns {Promise<Object>} Login response
     */
    async login(email, password, rememberMe = false) {
        try {
            const response = await api.login(email, password);

            if (response.success && response.data) {
                const { token, user } = response.data;

                // Store token
                api.setToken(token);

                // Store user data
                this.setCurrentUser(user);

                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem(CONFIG.STORAGE_KEYS.REMEMBER_ME, 'true');
                } else {
                    localStorage.removeItem(CONFIG.STORAGE_KEYS.REMEMBER_ME);
                }

                return { success: true, user };
            }

            throw new Error(response.message || 'Login failed');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     */
    async logout() {
        try {
            // Call logout API
            await api.logout().catch(() => {
                // Ignore API errors during logout
            });
        } finally {
            // Clear all stored data
            api.setToken(null);
            this.setCurrentUser(null);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.REMEMBER_ME);

            // Redirect to login page
            window.location.href = '/index.html';
        }
    },

    /**
     * Protect route - redirect to login if not authenticated
     */
    protectRoute() {
        // Skip authentication check in DEV_MODE
        if (CONFIG.DEV_MODE) {
            console.log('🔓 DEV_MODE: Authentication bypassed');
            // Set mock user data for dev mode
            if (!this.getCurrentUser()) {
                this.setCurrentUser({
                    id: 1,
                    email: 'admin@spotixe.com',
                    fullName: 'Admin User',
                    name: 'Admin',
                    role: 'Administrator',
                    avatar: null
                });
            }
            return true;
        }

        if (!this.isAuthenticated()) {
            // Store current URL for redirect after login
            const currentUrl = window.location.pathname + window.location.search;
            if (currentUrl !== '/index.html' && currentUrl !== '/') {
                sessionStorage.setItem('redirectAfterLogin', currentUrl);
            }

            // Redirect to login
            window.location.href = '/index.html';
            return false;
        }
        return true;
    },

    /**
     * Redirect if already authenticated
     */
    redirectIfAuthenticated() {
        // In DEV_MODE, don't redirect from login page
        if (CONFIG.DEV_MODE) {
            console.log('🔓 DEV_MODE: Login redirect bypassed');
            return false;
        }

        if (this.isAuthenticated()) {
            // Check for redirect URL
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            } else {
                window.location.href = '/pages/dashboard.html';
            }
            return true;
        }
        return false;
    },

    /**
     * Initialize authentication on page load
     */
    init() {
        // Check if on login page
        const isLoginPage = window.location.pathname === '/index.html' || 
                           window.location.pathname === '/' ||
                           window.location.pathname.endsWith('/index.html');

        if (isLoginPage) {
            this.redirectIfAuthenticated();
        } else {
            this.protectRoute();
        }
    },

    /**
     * Get user display name
     * @returns {string} Display name
     */
    getUserDisplayName() {
        const user = this.getCurrentUser();
        if (!user) return 'Admin';
        return user.fullName || user.name || user.email || 'Admin';
    },

    /**
     * Get user initials
     * @returns {string} User initials
     */
    getUserInitials() {
        const user = this.getCurrentUser();
        if (!user) return 'AD';
        const name = user.fullName || user.name || user.email || 'Admin';
        return Utils.getInitials(name);
    },

    /**
     * Get user avatar URL
     * @returns {string|null} Avatar URL
     */
    getUserAvatar() {
        const user = this.getCurrentUser();
        return user?.avatar || user?.profileImage || null;
    }
};

// Make Auth globally available
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}

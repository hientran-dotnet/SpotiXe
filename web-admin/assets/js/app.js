/**
 * Main Application Entry Point
 * Initializes the application and handles global functionality
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Check authentication
        Auth.init();

        // Initialize UI components
        this.initSidebar();
        this.initHeader();
        this.initTheme();

        // Load user profile
        this.loadUserProfile();

        // Set active menu item
        this.setActiveMenuItem();
    },

    /**
     * Initialize sidebar
     */
    initSidebar() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        const appContent = document.querySelector('.app-content');
        const header = document.querySelector('.header');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                appContent?.classList.toggle('sidebar-collapsed');
                header?.classList.toggle('sidebar-collapsed');
            });
        }

        // Mobile sidebar overlay
        if (window.innerWidth <= 992) {
            sidebar?.addEventListener('click', (e) => {
                if (e.target.classList.contains('sidebar-menu-item')) {
                    sidebar.classList.add('collapsed');
                }
            });
        }
    },

    /**
     * Initialize header components
     */
    initHeader() {
        // User profile dropdown
        const userProfile = document.getElementById('userProfile');
        const userDropdown = document.getElementById('userDropdown');

        if (userProfile && userDropdown) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                Utils.showConfirm(
                    'Logout',
                    'Are you sure you want to logout?',
                    async () => {
                        try {
                            await Auth.logout();
                        } catch (error) {
                            console.error('Logout error:', error);
                            // Force logout even if API fails
                            Auth.logout();
                        }
                    }
                );
            });
        }

        // Global search
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            const debouncedSearch = Utils.debounce((query) => {
                this.performGlobalSearch(query);
            }, CONFIG.UI.DEBOUNCE_DELAY);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    },

    /**
     * Load and display user profile
     */
    async loadUserProfile() {
        try {
            const user = Auth.getCurrentUser();
            
            if (user) {
                this.updateUserProfile(user);
            } else {
                // Fetch user data from API
                const response = await api.getCurrentUser();
                if (response.success && response.data) {
                    Auth.setCurrentUser(response.data);
                    this.updateUserProfile(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    },

    /**
     * Update user profile UI
     * @param {Object} user - User data
     */
    updateUserProfile(user) {
        // Update user name
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.fullName || user.name || user.email;
        });

        // Update user role
        const userRoleElements = document.querySelectorAll('.user-role');
        userRoleElements.forEach(el => {
            el.textContent = user.role || 'Administrator';
        });

        // Update avatar
        const avatarElements = document.querySelectorAll('.user-avatar');
        avatarElements.forEach(el => {
            if (user.avatar) {
                el.src = user.avatar;
            }
        });

        // Update avatar placeholder
        const avatarPlaceholders = document.querySelectorAll('.user-avatar-placeholder');
        avatarPlaceholders.forEach(el => {
            el.textContent = Auth.getUserInitials();
        });
    },

    /**
     * Set active menu item based on current page
     */
    setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.sidebar-menu-item');

        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPath.includes(href)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    /**
     * Initialize theme
     */
    initTheme() {
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
        
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        }

        // Theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || CONFIG.THEMES.LIGHT;
        const newTheme = currentTheme === CONFIG.THEMES.LIGHT ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, newTheme);

        Utils.showToast(`Theme changed to ${newTheme} mode`, 'success');
    },

    /**
     * Perform global search
     * @param {string} query - Search query
     */
    async performGlobalSearch(query) {
        if (!query || query.length < 2) return;

        console.log('Searching for:', query);
        // Implement global search logic
        // This would search across songs, artists, albums, etc.
    },

    /**
     * Format data for display
     * @param {*} value - Value to format
     * @param {string} type - Data type
     * @returns {string} Formatted value
     */
    formatValue(value, type = 'text') {
        switch (type) {
            case 'date':
                return Utils.formatDate(value);
            case 'datetime':
                return Utils.formatDate(value, true);
            case 'duration':
                return Utils.formatDuration(value);
            case 'filesize':
                return Utils.formatFileSize(value);
            case 'number':
                return Utils.formatNumber(value);
            default:
                return value || 'N/A';
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App globally available
if (typeof window !== 'undefined') {
    window.App = App;
}

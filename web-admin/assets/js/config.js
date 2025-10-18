/**
 * Application Configuration
 * Contains all configuration settings, API endpoints, and constants
 */

const CONFIG = {
    // Development Mode - Set to true to bypass authentication (for UI testing)
    DEV_MODE: true, // Change to false in production
    DEMO_MODE: true, // Mock data without API calls
    
    // API Configuration
    API: {
        BASE_URL: 'https://your-api.com/api',
        VERSION: 'v1',
        TIMEOUT: 30000, // 30 seconds
    },

    // API Endpoints
    ENDPOINTS: {
        auth: {
            login: '/auth/login',
            logout: '/auth/logout',
            refresh: '/auth/refresh',
            me: '/auth/me'
        },
        songs: {
            list: '/songs',
            create: '/songs',
            update: '/songs/:id',
            delete: '/songs/:id',
            details: '/songs/:id',
            search: '/songs/search'
        },
        artists: {
            list: '/artists',
            create: '/artists',
            update: '/artists/:id',
            delete: '/artists/:id',
            details: '/artists/:id',
            search: '/artists/search'
        },
        users: {
            list: '/users',
            create: '/users',
            update: '/users/:id',
            delete: '/users/:id',
            details: '/users/:id',
            suspend: '/users/:id/suspend',
            ban: '/users/:id/ban',
            resetPassword: '/users/:id/reset-password'
        },
        albums: {
            list: '/albums',
            create: '/albums',
            update: '/albums/:id',
            delete: '/albums/:id',
            details: '/albums/:id',
            search: '/albums/search'
        },
        playlists: {
            list: '/playlists',
            create: '/playlists',
            update: '/playlists/:id',
            delete: '/playlists/:id',
            details: '/playlists/:id',
            addSong: '/playlists/:id/songs',
            removeSong: '/playlists/:id/songs/:songId'
        },
        dashboard: {
            stats: '/dashboard/stats',
            activities: '/dashboard/recent-activities',
            charts: '/dashboard/charts'
        },
        upload: {
            audio: '/upload/audio',
            image: '/upload/image'
        }
    },

    // Pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 25,
        PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
        MAX_PAGE_SIZE: 100
    },

    // File Upload
    UPLOAD: {
        MAX_FILE_SIZE: {
            AUDIO: 50 * 1024 * 1024, // 50MB
            IMAGE: 5 * 1024 * 1024,  // 5MB
        },
        ALLOWED_TYPES: {
            AUDIO: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac'],
            IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        },
        ALLOWED_EXTENSIONS: {
            AUDIO: ['.mp3', '.wav', '.flac'],
            IMAGE: ['.jpg', '.jpeg', '.png', '.webp']
        }
    },

    // Music Genres
    GENRES: [
        'Pop',
        'Rock',
        'Hip Hop',
        'R&B',
        'Jazz',
        'Classical',
        'Electronic',
        'Country',
        'Blues',
        'Reggae',
        'Metal',
        'Folk',
        'Latin',
        'Indie',
        'Soul',
        'Funk',
        'Disco',
        'House',
        'Techno',
        'Alternative',
        'Punk',
        'Gospel',
        'Other'
    ],

    // Album Types
    ALBUM_TYPES: ['Album', 'EP', 'Single', 'Compilation'],

    // User Subscription Types
    SUBSCRIPTION_TYPES: ['Free', 'Premium', 'Family', 'Student'],

    // User Status
    USER_STATUS: ['Active', 'Suspended', 'Banned', 'Inactive'],

    // Playlist Visibility
    PLAYLIST_VISIBILITY: ['Public', 'Private', 'Unlisted'],

    // UI Settings
    UI: {
        TOAST_DURATION: 4000, // 4 seconds
        DEBOUNCE_DELAY: 500, // 500ms for search
        ANIMATION_DURATION: 300, // 300ms
        TABLE_REFRESH_INTERVAL: 30000 // 30 seconds
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'spotixe_admin_token',
        USER_DATA: 'spotixe_admin_user',
        THEME: 'spotixe_admin_theme',
        REMEMBER_ME: 'spotixe_admin_remember'
    },

    // Theme
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    // Date Formats
    DATE_FORMATS: {
        DISPLAY: 'MMM DD, YYYY',
        DISPLAY_TIME: 'MMM DD, YYYY HH:mm',
        API: 'YYYY-MM-DD',
        API_TIME: 'YYYY-MM-DDTHH:mm:ss'
    }
};

// Make config globally available
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

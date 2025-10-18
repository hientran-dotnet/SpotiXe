/**
 * API Service Layer
 * Handles all HTTP requests to the backend API
 */

class ApiService {
    constructor() {
        this.baseURL = CONFIG.API.BASE_URL + '/' + CONFIG.API.VERSION;
        this.timeout = CONFIG.API.TIMEOUT;
    }

    /**
     * Get authentication token from localStorage
     * @returns {string|null} JWT token
     */
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    }

    /**
     * Set authentication token to localStorage
     * @param {string} token - JWT token
     */
    setToken(token) {
        if (token) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        }
    }

    /**
     * Build request headers
     * @param {boolean} includeAuth - Include authorization header
     * @param {boolean} isFormData - Is request body FormData
     * @returns {Object} Headers object
     */
    buildHeaders(includeAuth = true, isFormData = false) {
        const headers = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        headers['Accept'] = 'application/json';

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Build full URL with endpoint
     * @param {string} endpoint - API endpoint
     * @param {Object} pathParams - Path parameters to replace in endpoint
     * @returns {string} Full URL
     */
    buildUrl(endpoint, pathParams = {}) {
        let url = this.baseURL + endpoint;

        // Replace path parameters
        Object.keys(pathParams).forEach(key => {
            url = url.replace(`:${key}`, pathParams[key]);
        });

        return url;
    }

    /**
     * Add query parameters to URL
     * @param {string} url - Base URL
     * @param {Object} params - Query parameters
     * @returns {string} URL with query parameters
     */
    addQueryParams(url, params = {}) {
        const urlObj = new URL(url);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                urlObj.searchParams.append(key, params[key]);
            }
        });
        return urlObj.toString();
    }

    /**
     * Handle API response
     * @param {Response} response - Fetch response
     * @returns {Promise<Object>} Parsed response data
     */
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            // Handle specific HTTP status codes
            if (response.status === 401) {
                // Unauthorized - redirect to login
                this.handleUnauthorized();
                throw new Error('Unauthorized. Please login again.');
            } else if (response.status === 403) {
                throw new Error('Access forbidden. You don\'t have permission to perform this action.');
            } else if (response.status === 404) {
                throw new Error('Resource not found.');
            } else if (response.status === 422) {
                // Validation error
                const message = data.message || 'Validation error';
                const errors = data.errors || {};
                throw { message, errors, status: 422 };
            } else if (response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }

            // Generic error
            const errorMessage = data.message || data.error || 'An error occurred';
            throw new Error(errorMessage);
        }

        return data;
    }

    /**
     * Handle unauthorized access
     */
    handleUnauthorized() {
        // Clear token and user data
        this.setToken(null);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);

        // Redirect to login page
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = '/index.html';
        }
    }

    /**
     * Make HTTP request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body = null,
            pathParams = {},
            queryParams = {},
            includeAuth = true,
            signal = null
        } = options;

        try {
            const isFormData = body instanceof FormData;
            const headers = this.buildHeaders(includeAuth, isFormData);
            let url = this.buildUrl(endpoint, pathParams);

            if (Object.keys(queryParams).length > 0) {
                url = this.addQueryParams(url, queryParams);
            }

            const fetchOptions = {
                method,
                headers,
                signal
            };

            if (body) {
                fetchOptions.body = isFormData ? body : JSON.stringify(body);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...fetchOptions,
                signal: signal || controller.signal
            });

            clearTimeout(timeoutId);

            return await this.handleResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }
            throw error;
        }
    }

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async post(endpoint, body = null, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async put(endpoint, body = null, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    /**
     * PATCH request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async patch(endpoint, body = null, options = {}) {
        return this.request(endpoint, { ...options, method: 'PATCH', body });
    }

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} Response data
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * Upload file with progress tracking
     * @param {string} endpoint - Upload endpoint
     * @param {FormData} formData - Form data with file
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>} Upload response
     */
    async uploadFile(endpoint, formData, onProgress = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const token = this.getToken();
            let url = this.buildUrl(endpoint);

            xhr.open('POST', url);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('Accept', 'application/json');

            // Progress tracking
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        resolve(xhr.responseText);
                    }
                } else if (xhr.status === 401) {
                    this.handleUnauthorized();
                    reject(new Error('Unauthorized. Please login again.'));
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        reject(new Error(error.message || 'Upload failed'));
                    } catch (e) {
                        reject(new Error('Upload failed'));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Upload cancelled'));
            });

            xhr.send(formData);
        });
    }

    // ==================== Authentication APIs ====================

    /**
     * Login
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Login response with token
     */
    async login(email, password) {
        return this.post(CONFIG.ENDPOINTS.auth.login, { email, password }, { includeAuth: false });
    }

    /**
     * Logout
     * @returns {Promise<Object>} Logout response
     */
    async logout() {
        return this.post(CONFIG.ENDPOINTS.auth.logout);
    }

    /**
     * Get current user
     * @returns {Promise<Object>} User data
     */
    async getCurrentUser() {
        return this.get(CONFIG.ENDPOINTS.auth.me);
    }

    // ==================== Dashboard APIs ====================

    /**
     * Get dashboard statistics
     * @returns {Promise<Object>} Dashboard stats
     */
    async getDashboardStats() {
        return this.get(CONFIG.ENDPOINTS.dashboard.stats);
    }

    /**
     * Get recent activities
     * @param {number} limit - Number of activities
     * @returns {Promise<Object>} Recent activities
     */
    async getRecentActivities(limit = 10) {
        return this.get(CONFIG.ENDPOINTS.dashboard.activities, { queryParams: { limit } });
    }

    // ==================== Song APIs ====================

    /**
     * Get songs list
     * @param {Object} params - Query parameters (page, pageSize, search, filter, sort)
     * @returns {Promise<Object>} Songs list with pagination
     */
    async getSongs(params = {}) {
        return this.get(CONFIG.ENDPOINTS.songs.list, { queryParams: params });
    }

    /**
     * Get song details
     * @param {number} id - Song ID
     * @returns {Promise<Object>} Song details
     */
    async getSong(id) {
        return this.get(CONFIG.ENDPOINTS.songs.details, { pathParams: { id } });
    }

    /**
     * Create new song
     * @param {Object} data - Song data
     * @returns {Promise<Object>} Created song
     */
    async createSong(data) {
        return this.post(CONFIG.ENDPOINTS.songs.create, data);
    }

    /**
     * Update song
     * @param {number} id - Song ID
     * @param {Object} data - Updated song data
     * @returns {Promise<Object>} Updated song
     */
    async updateSong(id, data) {
        return this.put(CONFIG.ENDPOINTS.songs.update, data, { pathParams: { id } });
    }

    /**
     * Delete song
     * @param {number} id - Song ID
     * @returns {Promise<Object>} Delete response
     */
    async deleteSong(id) {
        return this.delete(CONFIG.ENDPOINTS.songs.delete, { pathParams: { id } });
    }

    /**
     * Search songs
     * @param {string} query - Search query
     * @returns {Promise<Object>} Search results
     */
    async searchSongs(query) {
        return this.get(CONFIG.ENDPOINTS.songs.search, { queryParams: { q: query } });
    }

    // ==================== Artist APIs ====================

    /**
     * Get artists list
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Artists list with pagination
     */
    async getArtists(params = {}) {
        return this.get(CONFIG.ENDPOINTS.artists.list, { queryParams: params });
    }

    /**
     * Get artist details
     * @param {number} id - Artist ID
     * @returns {Promise<Object>} Artist details
     */
    async getArtist(id) {
        return this.get(CONFIG.ENDPOINTS.artists.details, { pathParams: { id } });
    }

    /**
     * Create new artist
     * @param {Object} data - Artist data
     * @returns {Promise<Object>} Created artist
     */
    async createArtist(data) {
        return this.post(CONFIG.ENDPOINTS.artists.create, data);
    }

    /**
     * Update artist
     * @param {number} id - Artist ID
     * @param {Object} data - Updated artist data
     * @returns {Promise<Object>} Updated artist
     */
    async updateArtist(id, data) {
        return this.put(CONFIG.ENDPOINTS.artists.update, data, { pathParams: { id } });
    }

    /**
     * Delete artist
     * @param {number} id - Artist ID
     * @returns {Promise<Object>} Delete response
     */
    async deleteArtist(id) {
        return this.delete(CONFIG.ENDPOINTS.artists.delete, { pathParams: { id } });
    }

    // ==================== Album APIs ====================

    /**
     * Get albums list
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Albums list with pagination
     */
    async getAlbums(params = {}) {
        return this.get(CONFIG.ENDPOINTS.albums.list, { queryParams: params });
    }

    /**
     * Get album details
     * @param {number} id - Album ID
     * @returns {Promise<Object>} Album details
     */
    async getAlbum(id) {
        return this.get(CONFIG.ENDPOINTS.albums.details, { pathParams: { id } });
    }

    /**
     * Create new album
     * @param {Object} data - Album data
     * @returns {Promise<Object>} Created album
     */
    async createAlbum(data) {
        return this.post(CONFIG.ENDPOINTS.albums.create, data);
    }

    /**
     * Update album
     * @param {number} id - Album ID
     * @param {Object} data - Updated album data
     * @returns {Promise<Object>} Updated album
     */
    async updateAlbum(id, data) {
        return this.put(CONFIG.ENDPOINTS.albums.update, data, { pathParams: { id } });
    }

    /**
     * Delete album
     * @param {number} id - Album ID
     * @returns {Promise<Object>} Delete response
     */
    async deleteAlbum(id) {
        return this.delete(CONFIG.ENDPOINTS.albums.delete, { pathParams: { id } });
    }

    // ==================== User APIs ====================

    /**
     * Get users list
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Users list with pagination
     */
    async getUsers(params = {}) {
        return this.get(CONFIG.ENDPOINTS.users.list, { queryParams: params });
    }

    /**
     * Get user details
     * @param {number} id - User ID
     * @returns {Promise<Object>} User details
     */
    async getUser(id) {
        return this.get(CONFIG.ENDPOINTS.users.details, { pathParams: { id } });
    }

    /**
     * Create new user
     * @param {Object} data - User data
     * @returns {Promise<Object>} Created user
     */
    async createUser(data) {
        return this.post(CONFIG.ENDPOINTS.users.create, data);
    }

    /**
     * Update user
     * @param {number} id - User ID
     * @param {Object} data - Updated user data
     * @returns {Promise<Object>} Updated user
     */
    async updateUser(id, data) {
        return this.put(CONFIG.ENDPOINTS.users.update, data, { pathParams: { id } });
    }

    /**
     * Delete user
     * @param {number} id - User ID
     * @returns {Promise<Object>} Delete response
     */
    async deleteUser(id) {
        return this.delete(CONFIG.ENDPOINTS.users.delete, { pathParams: { id } });
    }

    /**
     * Suspend user
     * @param {number} id - User ID
     * @returns {Promise<Object>} Response
     */
    async suspendUser(id) {
        return this.post(CONFIG.ENDPOINTS.users.suspend, null, { pathParams: { id } });
    }

    /**
     * Ban user
     * @param {number} id - User ID
     * @returns {Promise<Object>} Response
     */
    async banUser(id) {
        return this.post(CONFIG.ENDPOINTS.users.ban, null, { pathParams: { id } });
    }

    // ==================== Playlist APIs ====================

    /**
     * Get playlists list
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Playlists list with pagination
     */
    async getPlaylists(params = {}) {
        return this.get(CONFIG.ENDPOINTS.playlists.list, { queryParams: params });
    }

    /**
     * Get playlist details
     * @param {number} id - Playlist ID
     * @returns {Promise<Object>} Playlist details
     */
    async getPlaylist(id) {
        return this.get(CONFIG.ENDPOINTS.playlists.details, { pathParams: { id } });
    }

    /**
     * Create new playlist
     * @param {Object} data - Playlist data
     * @returns {Promise<Object>} Created playlist
     */
    async createPlaylist(data) {
        return this.post(CONFIG.ENDPOINTS.playlists.create, data);
    }

    /**
     * Update playlist
     * @param {number} id - Playlist ID
     * @param {Object} data - Updated playlist data
     * @returns {Promise<Object>} Updated playlist
     */
    async updatePlaylist(id, data) {
        return this.put(CONFIG.ENDPOINTS.playlists.update, data, { pathParams: { id } });
    }

    /**
     * Delete playlist
     * @param {number} id - Playlist ID
     * @returns {Promise<Object>} Delete response
     */
    async deletePlaylist(id) {
        return this.delete(CONFIG.ENDPOINTS.playlists.delete, { pathParams: { id } });
    }

    /**
     * Add song to playlist
     * @param {number} playlistId - Playlist ID
     * @param {number} songId - Song ID
     * @returns {Promise<Object>} Response
     */
    async addSongToPlaylist(playlistId, songId) {
        return this.post(CONFIG.ENDPOINTS.playlists.addSong, { songId }, { pathParams: { id: playlistId } });
    }

    /**
     * Remove song from playlist
     * @param {number} playlistId - Playlist ID
     * @param {number} songId - Song ID
     * @returns {Promise<Object>} Response
     */
    async removeSongFromPlaylist(playlistId, songId) {
        return this.delete(CONFIG.ENDPOINTS.playlists.removeSong, { 
            pathParams: { id: playlistId, songId } 
        });
    }

    // ==================== File Upload APIs ====================

    /**
     * Upload audio file
     * @param {File} file - Audio file
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>} Upload response with file URL
     */
    async uploadAudio(file, onProgress = null) {
        const formData = new FormData();
        formData.append('audio', file);
        return this.uploadFile(CONFIG.ENDPOINTS.upload.audio, formData, onProgress);
    }

    /**
     * Upload image file
     * @param {File} file - Image file
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>} Upload response with file URL
     */
    async uploadImage(file, onProgress = null) {
        const formData = new FormData();
        formData.append('image', file);
        return this.uploadFile(CONFIG.ENDPOINTS.upload.image, formData, onProgress);
    }
}

// Create and export API service instance
const api = new ApiService();

// Make API service globally available
if (typeof window !== 'undefined') {
    window.api = api;
    window.ApiService = ApiService;
}

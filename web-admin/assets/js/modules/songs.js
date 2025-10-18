/**
 * Song Management Module
 * Handles all song-related operations (CRUD, search, filter, etc.)
 */

const SongManager = {
    currentPage: 1,
    pageSize: 25,
    totalPages: 1,
    searchQuery: '',
    filters: {
        genre: '',
        artist: '',
        album: '',
        featured: '',
        premium: ''
    },
    sortBy: 'createdAt',
    sortOrder: 'desc',

    /**
     * Initialize the song manager
     */
    async init() {
        this.setupEventListeners();
        await this.loadSongs();
        await this.loadFilterOptions();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchSongs');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.loadSongs();
            }, CONFIG.UI.DEBOUNCE_DELAY));
        }

        // Filters
        const filterGenre = document.getElementById('filterGenre');
        if (filterGenre) {
            filterGenre.addEventListener('change', () => {
                this.filters.genre = filterGenre.value;
                this.currentPage = 1;
                this.loadSongs();
            });
        }

        const filterArtist = document.getElementById('filterArtist');
        if (filterArtist) {
            filterArtist.addEventListener('change', () => {
                this.filters.artist = filterArtist.value;
                this.currentPage = 1;
                this.loadSongs();
            });
        }

        // Page size
        const pageSize = document.getElementById('pageSize');
        if (pageSize) {
            pageSize.addEventListener('change', () => {
                this.pageSize = parseInt(pageSize.value);
                this.currentPage = 1;
                this.loadSongs();
            });
        }

        // Add song button
        const addSongBtn = document.getElementById('addSongBtn');
        if (addSongBtn) {
            addSongBtn.addEventListener('click', () => this.showAddModal());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV());
        }
    },

    /**
     * Load songs from API
     */
    async loadSongs() {
        try {
            const tableBody = document.getElementById('songsTableBody');
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>';

            const params = {
                page: this.currentPage,
                pageSize: this.pageSize,
                search: this.searchQuery,
                sortBy: this.sortBy,
                sortOrder: this.sortOrder,
                ...this.filters
            };

            // In production: const response = await api.getSongs(params);
            // Mock data for demonstration
            const response = this.getMockSongs();

            if (response.success && response.data) {
                this.renderSongs(response.data.items);
                this.updatePagination(response.data.pagination);
            } else {
                throw new Error('Failed to load songs');
            }
        } catch (error) {
            console.error('Error loading songs:', error);
            Utils.showToast('Failed to load songs', 'error');
            document.getElementById('songsTableBody').innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-exclamation-circle"></i></div>
                            <div class="empty-state-title">Failed to load songs</div>
                            <div class="empty-state-text">${error.message}</div>
                            <button class="btn btn-primary mt-2" onclick="SongManager.loadSongs()">Retry</button>
                        </div>
                    </td>
                </tr>
            `;
        }
    },

    /**
     * Render songs in table
     */
    renderSongs(songs) {
        const tableBody = document.getElementById('songsTableBody');

        if (!songs || songs.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="empty-state">
                            <div class="empty-state-icon"><i class="fas fa-music"></i></div>
                            <div class="empty-state-title">No songs found</div>
                            <div class="empty-state-text">Try adjusting your search or filters</div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = songs.map(song => `
            <tr>
                <td>
                    <img src="${song.coverImage || 'https://via.placeholder.com/40'}" 
                         style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                </td>
                <td>
                    <div style="font-weight: 600; color: var(--gray-700);">${Utils.escapeHtml(song.title)}</div>
                    ${song.featured ? '<span class="badge badge-warning mt-1">Featured</span>' : ''}
                    ${song.premium ? '<span class="badge badge-info mt-1">Premium</span>' : ''}
                </td>
                <td>${Utils.escapeHtml(song.artist)}</td>
                <td>${Utils.escapeHtml(song.album || 'N/A')}</td>
                <td>${Utils.formatDuration(song.duration)}</td>
                <td><span class="badge badge-primary">${Utils.escapeHtml(song.genre)}</span></td>
                <td>${Utils.formatDate(song.uploadDate)}</td>
                <td>${Utils.formatNumber(song.plays || 0)}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="SongManager.viewSong(${song.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="SongManager.editSong(${song.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="SongManager.deleteSong(${song.id}, '${Utils.escapeHtml(song.title)}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    /**
     * Update pagination
     */
    updatePagination(pagination) {
        this.totalPages = pagination.totalPages;
        this.currentPage = pagination.currentPage;

        // Update info
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, pagination.totalItems);
        document.getElementById('paginationInfo').textContent = 
            `Showing ${start}-${end} of ${pagination.totalItems} songs`;

        // Update controls
        const controls = document.getElementById('paginationControls');
        let html = '';

        // Previous button
        html += `<button ${this.currentPage === 1 ? 'disabled' : ''} onclick="SongManager.goToPage(${this.currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += `<button onclick="SongManager.goToPage(1)">1</button>`;
            if (startPage > 2) html += `<button disabled>...</button>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="${i === this.currentPage ? 'active' : ''}" onclick="SongManager.goToPage(${i})">${i}</button>`;
        }

        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) html += `<button disabled>...</button>`;
            html += `<button onclick="SongManager.goToPage(${this.totalPages})">${this.totalPages}</button>`;
        }

        // Next button
        html += `<button ${this.currentPage === this.totalPages ? 'disabled' : ''} onclick="SongManager.goToPage(${this.currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;

        controls.innerHTML = html;
    },

    /**
     * Go to page
     */
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.loadSongs();
    },

    /**
     * Load filter options
     */
    async loadFilterOptions() {
        // Load genres
        const genreSelect = document.getElementById('filterGenre');
        if (genreSelect) {
            CONFIG.GENRES.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreSelect.appendChild(option);
            });
        }

        // Load artists (would fetch from API in production)
        const artistSelect = document.getElementById('filterArtist');
        if (artistSelect) {
            // Mock data
            const artists = ['The Weeknd', 'Dua Lipa', 'Justin Bieber', 'Ed Sheeran'];
            artists.forEach(artist => {
                const option = document.createElement('option');
                option.value = artist;
                option.textContent = artist;
                artistSelect.appendChild(option);
            });
        }
    },

    /**
     * Show add song modal
     */
    showAddModal() {
        const modal = this.createSongModal();
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    },

    /**
     * View song details
     */
    async viewSong(id) {
        try {
            // In production: const response = await api.getSong(id);
            const song = this.getMockSong(id);
            
            const modal = this.createSongDetailModal(song);
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);
        } catch (error) {
            console.error('Error loading song:', error);
            Utils.showToast('Failed to load song details', 'error');
        }
    },

    /**
     * Edit song
     */
    async editSong(id) {
        try {
            // In production: const response = await api.getSong(id);
            const song = this.getMockSong(id);
            
            const modal = this.createSongModal(song);
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);
        } catch (error) {
            console.error('Error loading song:', error);
            Utils.showToast('Failed to load song for editing', 'error');
        }
    },

    /**
     * Delete song
     */
    deleteSong(id, title) {
        Utils.showConfirm(
            'Delete Song',
            `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            async () => {
                try {
                    // In production: await api.deleteSong(id);
                    Utils.showToast(`Song "${title}" deleted successfully`, 'success');
                    this.loadSongs();
                } catch (error) {
                    console.error('Error deleting song:', error);
                    Utils.showToast('Failed to delete song', 'error');
                }
            }
        );
    },

    /**
     * Create song modal (add/edit)
     */
    createSongModal(song = null) {
        const isEdit = !!song;
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content" style="border-radius: 16px; overflow: hidden;">
                    <div class="modal-header" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white;">
                        <h5 class="modal-title">
                            <i class="fas fa-music me-2"></i>
                            ${isEdit ? 'Edit Song' : 'Add New Song'}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        <form id="songForm">
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label class="form-label required">Song Title</label>
                                    <input type="text" class="form-control" id="songTitle" required value="${song?.title || ''}">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label class="form-label required">Artist</label>
                                    <select class="form-control form-select" id="songArtist" required>
                                        <option value="">Select Artist</option>
                                        ${CONFIG.GENRES.slice(0, 5).map(g => `<option value="${g}" ${song?.artist === g ? 'selected' : ''}>${g}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label class="form-label">Album</label>
                                    <select class="form-control form-select" id="songAlbum">
                                        <option value="">Select Album (Optional)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label class="form-label required">Genre</label>
                                    <select class="form-control form-select" id="songGenre" required>
                                        <option value="">Select Genre</option>
                                        ${CONFIG.GENRES.map(genre => `<option value="${genre}" ${song?.genre === genre ? 'selected' : ''}>${genre}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 form-group">
                                    <label class="form-label required">Duration (MM:SS)</label>
                                    <input type="text" class="form-control" id="songDuration" placeholder="3:45" required value="${song ? Utils.formatDuration(song.duration) : ''}">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label class="form-label">Release Date</label>
                                    <input type="date" class="form-control" id="songReleaseDate" value="${song?.releaseDate || ''}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Lyrics</label>
                                <textarea class="form-control" id="songLyrics" rows="4" placeholder="Enter song lyrics...">${song?.lyrics || ''}</textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="songFeatured" ${song?.featured ? 'checked' : ''}>
                                        <label class="form-check-label" for="songFeatured">Featured Song</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="songPremium" ${song?.premium ? 'checked' : ''}>
                                        <label class="form-check-label" for="songPremium">Premium Only</label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="SongManager.saveSong(${song?.id || null})">
                            <i class="fas fa-save me-2"></i>
                            ${isEdit ? 'Update Song' : 'Add Song'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                backdrop.remove();
            }
        });

        return modal;
    },

    /**
     * Create song detail modal
     */
    createSongDetailModal(song) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.style.display = 'block';
        
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content" style="border-radius: 16px; overflow: hidden;">
                    <div class="modal-header" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); color: white;">
                        <h5 class="modal-title">
                            <i class="fas fa-music me-2"></i>
                            Song Details
                        </h5>
                        <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <img src="${song.coverImage || 'https://via.placeholder.com/200'}" 
                                 style="width: 200px; height: 200px; border-radius: 12px; object-fit: cover; box-shadow: var(--shadow-lg);">
                        </div>
                        <table class="table">
                            <tr><th style="width: 150px;">Title:</th><td>${Utils.escapeHtml(song.title)}</td></tr>
                            <tr><th>Artist:</th><td>${Utils.escapeHtml(song.artist)}</td></tr>
                            <tr><th>Album:</th><td>${Utils.escapeHtml(song.album || 'N/A')}</td></tr>
                            <tr><th>Genre:</th><td><span class="badge badge-primary">${Utils.escapeHtml(song.genre)}</span></td></tr>
                            <tr><th>Duration:</th><td>${Utils.formatDuration(song.duration)}</td></tr>
                            <tr><th>Upload Date:</th><td>${Utils.formatDate(song.uploadDate, true)}</td></tr>
                            <tr><th>Total Plays:</th><td>${Utils.formatNumber(song.plays || 0)}</td></tr>
                            <tr><th>Status:</th><td>
                                ${song.featured ? '<span class="badge badge-warning me-2">Featured</span>' : ''}
                                ${song.premium ? '<span class="badge badge-info">Premium</span>' : '<span class="badge badge-success">Free</span>'}
                            </td></tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                        <button type="button" class="btn btn-primary" onclick="SongManager.editSong(${song.id})">
                            <i class="fas fa-edit me-2"></i>
                            Edit Song
                        </button>
                    </div>
                </div>
            </div>
        `;

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                backdrop.remove();
            }
        });

        return modal;
    },

    /**
     * Save song (add or update)
     */
    async saveSong(id = null) {
        try {
            const data = {
                title: document.getElementById('songTitle').value,
                artist: document.getElementById('songArtist').value,
                album: document.getElementById('songAlbum').value,
                genre: document.getElementById('songGenre').value,
                duration: Utils.parseDuration(document.getElementById('songDuration').value),
                releaseDate: document.getElementById('songReleaseDate').value,
                lyrics: document.getElementById('songLyrics').value,
                featured: document.getElementById('songFeatured').checked,
                premium: document.getElementById('songPremium').checked
            };

            // Validate
            if (!data.title || !data.artist || !data.genre) {
                Utils.showToast('Please fill in all required fields', 'warning');
                return;
            }

            // In production:
            // if (id) await api.updateSong(id, data);
            // else await api.createSong(data);

            Utils.showToast(`Song ${id ? 'updated' : 'added'} successfully`, 'success');
            document.querySelector('.modal').remove();
            document.querySelector('.modal-backdrop').remove();
            this.loadSongs();
        } catch (error) {
            console.error('Error saving song:', error);
            Utils.showToast('Failed to save song', 'error');
        }
    },

    /**
     * Export songs to CSV
     */
    exportToCSV() {
        // Mock data for export
        const songs = this.getMockSongs().data.items;
        Utils.exportToCSV(songs, 'songs_export.csv');
    },

    /**
     * Get mock songs (for demonstration)
     */
    getMockSongs() {
        const songs = [];
        for (let i = 1; i <= 50; i++) {
            songs.push({
                id: i,
                title: `Song Title ${i}`,
                artist: ['The Weeknd', 'Dua Lipa', 'Justin Bieber', 'Ed Sheeran'][i % 4],
                album: i % 3 === 0 ? null : `Album ${Math.ceil(i / 3)}`,
                duration: 180 + (i * 10),
                genre: CONFIG.GENRES[i % CONFIG.GENRES.length],
                uploadDate: new Date(Date.now() - i * 86400000).toISOString(),
                plays: Math.floor(Math.random() * 1000000),
                featured: i % 5 === 0,
                premium: i % 7 === 0,
                coverImage: `https://via.placeholder.com/40?text=Song${i}`
            });
        }

        return {
            success: true,
            data: {
                items: songs.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize),
                pagination: {
                    currentPage: this.currentPage,
                    totalPages: Math.ceil(songs.length / this.pageSize),
                    pageSize: this.pageSize,
                    totalItems: songs.length
                }
            }
        };
    },

    /**
     * Get mock song (for demonstration)
     */
    getMockSong(id) {
        return {
            id,
            title: `Song Title ${id}`,
            artist: 'The Weeknd',
            album: 'After Hours',
            duration: 215,
            genre: 'Pop',
            uploadDate: new Date().toISOString(),
            releaseDate: '2024-01-15',
            plays: 1245678,
            featured: true,
            premium: false,
            lyrics: 'Sample lyrics...',
            coverImage: `https://via.placeholder.com/200?text=Song${id}`
        };
    }
};

// Make SongManager globally available
if (typeof window !== 'undefined') {
    window.SongManager = SongManager;
}

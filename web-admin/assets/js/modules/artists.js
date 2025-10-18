/**
 * Artist Management Module
 * Handles all artist-related operations (CRUD, search, filter, etc.)
 */

const ArtistManager = {
    currentPage: 1,
    pageSize: 25,
    totalPages: 1,
    searchQuery: '',
    filters: { genre: '', verified: '' },

    async init() {
        this.setupEventListeners();
        await this.loadArtists();
    },

    setupEventListeners() {
        document.getElementById('searchArtists')?.addEventListener('input', Utils.debounce((e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.loadArtists();
        }, CONFIG.UI.DEBOUNCE_DELAY));

        document.getElementById('addArtistBtn')?.addEventListener('click', () => this.showAddModal());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportToCSV());
    },

    async loadArtists() {
        try {
            const tableBody = document.getElementById('artistsTableBody');
            tableBody.innerHTML = '<tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>';

            const response = this.getMockArtists();
            if (response.success && response.data) {
                this.renderArtists(response.data.items);
                this.updatePagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error loading artists:', error);
            Utils.showToast('Failed to load artists', 'error');
        }
    },

    renderArtists(artists) {
        const tableBody = document.getElementById('artistsTableBody');
        if (!artists || artists.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-user-music"></i></div><div class="empty-state-title">No artists found</div></div></td></tr>';
            return;
        }

        tableBody.innerHTML = artists.map(artist => `
            <tr>
                <td><img src="${artist.image || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
                <td>
                    <div style="font-weight: 600; color: var(--gray-700);">${Utils.escapeHtml(artist.name)}</div>
                    ${artist.verified ? '<span class="badge badge-success mt-1"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                </td>
                <td><span class="badge badge-primary">${Utils.escapeHtml(artist.genre)}</span></td>
                <td>${artist.songsCount}</td>
                <td>${Utils.formatNumber(artist.followers)}</td>
                <td>${Utils.formatDate(artist.joinDate)}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="ArtistManager.viewArtist(${artist.id})" title="View"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="ArtistManager.editArtist(${artist.id})" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="ArtistManager.deleteArtist(${artist.id}, '${Utils.escapeHtml(artist.name)}')" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    updatePagination(pagination) {
        document.getElementById('paginationInfo').textContent = `Showing ${(pagination.currentPage-1)*this.pageSize+1}-${Math.min(pagination.currentPage*this.pageSize, pagination.totalItems)} of ${pagination.totalItems} artists`;
    },

    viewArtist(id) { Utils.showToast('View artist: ' + id, 'info'); },
    editArtist(id) { Utils.showToast('Edit artist: ' + id, 'info'); },
    deleteArtist(id, name) {
        Utils.showConfirm('Delete Artist', `Delete "${name}"?`, () => {
            Utils.showToast(`Artist "${name}" deleted`, 'success');
            this.loadArtists();
        });
    },
    showAddModal() { Utils.showToast('Add artist modal', 'info'); },
    exportToCSV() { Utils.exportToCSV(this.getMockArtists().data.items, 'artists_export.csv'); },

    getMockArtists() {
        const artists = [];
        for (let i = 1; i <= 30; i++) {
            artists.push({
                id: i,
                name: `Artist ${i}`,
                genre: CONFIG.GENRES[i % CONFIG.GENRES.length],
                songsCount: Math.floor(Math.random() * 100) + 10,
                followers: Math.floor(Math.random() * 100000),
                verified: i % 3 === 0,
                joinDate: new Date(Date.now() - i * 86400000 * 30).toISOString(),
                image: `https://via.placeholder.com/40?text=A${i}`
            });
        }
        return {
            success: true,
            data: {
                items: artists.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize),
                pagination: { currentPage: this.currentPage, totalPages: Math.ceil(artists.length / this.pageSize), pageSize: this.pageSize, totalItems: artists.length }
            }
        };
    }
};

if (typeof window !== 'undefined') window.ArtistManager = ArtistManager;

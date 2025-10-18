/**
 * Album Management Module
 */

const AlbumManager = {
    currentPage: 1,
    pageSize: 25,
    searchQuery: '',

    async init() {
        this.setupEventListeners();
        await this.loadAlbums();
    },

    setupEventListeners() {
        document.getElementById('searchAlbums')?.addEventListener('input', Utils.debounce((e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.loadAlbums();
        }, CONFIG.UI.DEBOUNCE_DELAY));
        document.getElementById('addAlbumBtn')?.addEventListener('click', () => this.showAddModal());
    },

    async loadAlbums() {
        try {
            const tableBody = document.getElementById('albumsTableBody');
            tableBody.innerHTML = '<tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>';
            const response = this.getMockAlbums();
            if (response.success) this.renderAlbums(response.data.items);
        } catch (error) {
            console.error('Error loading albums:', error);
            Utils.showToast('Failed to load albums', 'error');
        }
    },

    renderAlbums(albums) {
        const tableBody = document.getElementById('albumsTableBody');
        if (!albums || albums.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-compact-disc"></i></div><div class="empty-state-title">No albums found</div></div></td></tr>';
            return;
        }
        tableBody.innerHTML = albums.map(album => `
            <tr>
                <td><img src="${album.cover || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;"></td>
                <td><div style="font-weight: 600;">${Utils.escapeHtml(album.title)}</div></td>
                <td>${Utils.escapeHtml(album.artist)}</td>
                <td><span class="badge badge-info">${album.type}</span></td>
                <td>${album.songsCount} songs</td>
                <td>${Utils.formatDate(album.releaseDate)}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="AlbumManager.viewAlbum(${album.id})"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="AlbumManager.editAlbum(${album.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="AlbumManager.deleteAlbum(${album.id}, '${Utils.escapeHtml(album.title)}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    viewAlbum(id) { Utils.showToast('View album: ' + id, 'info'); },
    editAlbum(id) { Utils.showToast('Edit album: ' + id, 'info'); },
    deleteAlbum(id, title) {
        Utils.showConfirm('Delete Album', `Delete "${title}"?`, () => {
            Utils.showToast(`Album "${title}" deleted`, 'success');
            this.loadAlbums();
        });
    },
    showAddModal() { Utils.showToast('Add album modal', 'info'); },

    getMockAlbums() {
        const albums = [];
        for (let i = 1; i <= 25; i++) {
            albums.push({
                id: i,
                title: `Album ${i}`,
                artist: ['The Weeknd', 'Dua Lipa', 'Ed Sheeran'][i % 3],
                type: CONFIG.ALBUM_TYPES[i % CONFIG.ALBUM_TYPES.length],
                songsCount: Math.floor(Math.random() * 15) + 5,
                releaseDate: new Date(Date.now() - i * 86400000 * 30).toISOString(),
                cover: `https://via.placeholder.com/40?text=Album${i}`
            });
        }
        return { success: true, data: { items: albums.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize) } };
    }
};

if (typeof window !== 'undefined') window.AlbumManager = AlbumManager;

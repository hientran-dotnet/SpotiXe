/**
 * Playlist Management Module
 */

const PlaylistManager = {
    currentPage: 1,
    pageSize: 25,
    searchQuery: '',

    async init() {
        this.setupEventListeners();
        await this.loadPlaylists();
    },

    setupEventListeners() {
        document.getElementById('searchPlaylists')?.addEventListener('input', Utils.debounce((e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.loadPlaylists();
        }, CONFIG.UI.DEBOUNCE_DELAY));
        document.getElementById('addPlaylistBtn')?.addEventListener('click', () => this.showAddModal());
    },

    async loadPlaylists() {
        try {
            const tableBody = document.getElementById('playlistsTableBody');
            tableBody.innerHTML = '<tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>';
            const response = this.getMockPlaylists();
            if (response.success) this.renderPlaylists(response.data.items);
        } catch (error) {
            console.error('Error loading playlists:', error);
            Utils.showToast('Failed to load playlists', 'error');
        }
    },

    renderPlaylists(playlists) {
        const tableBody = document.getElementById('playlistsTableBody');
        if (!playlists || playlists.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-list-ul"></i></div><div class="empty-state-title">No playlists found</div></div></td></tr>';
            return;
        }
        tableBody.innerHTML = playlists.map(playlist => `
            <tr>
                <td><img src="${playlist.cover || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;"></td>
                <td><div style="font-weight: 600;">${Utils.escapeHtml(playlist.name)}</div></td>
                <td>${Utils.escapeHtml(playlist.creator)}</td>
                <td>${playlist.songsCount} songs</td>
                <td><span class="badge badge-${playlist.visibility === 'Public' ? 'success' : 'secondary'}">${playlist.visibility}</span></td>
                <td>${playlist.featured ? '<span class="badge badge-warning"><i class="fas fa-star"></i> Featured</span>' : ''}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="PlaylistManager.viewPlaylist(${playlist.id})"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="PlaylistManager.editPlaylist(${playlist.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="PlaylistManager.deletePlaylist(${playlist.id}, '${Utils.escapeHtml(playlist.name)}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    viewPlaylist(id) { Utils.showToast('View playlist: ' + id, 'info'); },
    editPlaylist(id) { Utils.showToast('Edit playlist: ' + id, 'info'); },
    deletePlaylist(id, name) {
        Utils.showConfirm('Delete Playlist', `Delete "${name}"?`, () => {
            Utils.showToast(`Playlist "${name}" deleted`, 'success');
            this.loadPlaylists();
        });
    },
    showAddModal() { Utils.showToast('Add playlist modal', 'info'); },

    getMockPlaylists() {
        const playlists = [];
        for (let i = 1; i <= 20; i++) {
            playlists.push({
                id: i,
                name: `Playlist ${i}`,
                creator: i % 3 === 0 ? 'Admin' : `User ${i}`,
                songsCount: Math.floor(Math.random() * 50) + 10,
                visibility: CONFIG.PLAYLIST_VISIBILITY[i % CONFIG.PLAYLIST_VISIBILITY.length],
                featured: i % 4 === 0,
                cover: `https://via.placeholder.com/40?text=PL${i}`
            });
        }
        return { success: true, data: { items: playlists.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize) } };
    }
};

if (typeof window !== 'undefined') window.PlaylistManager = PlaylistManager;

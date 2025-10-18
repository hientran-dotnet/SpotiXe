/**
 * User Management Module
 */

const UserManager = {
    currentPage: 1,
    pageSize: 25,
    searchQuery: '',

    async init() {
        this.setupEventListeners();
        await this.loadUsers();
    },

    setupEventListeners() {
        document.getElementById('searchUsers')?.addEventListener('input', Utils.debounce((e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.loadUsers();
        }, CONFIG.UI.DEBOUNCE_DELAY));
        document.getElementById('addUserBtn')?.addEventListener('click', () => this.showAddModal());
    },

    async loadUsers() {
        try {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '<tr><td colspan="7"><div class="loading-spinner"><div class="spinner"></div></div></td></tr>';
            const response = this.getMockUsers();
            if (response.success) this.renderUsers(response.data.items);
        } catch (error) {
            console.error('Error loading users:', error);
            Utils.showToast('Failed to load users', 'error');
        }
    },

    renderUsers(users) {
        const tableBody = document.getElementById('usersTableBody');
        if (!users || users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center"><div class="empty-state"><div class="empty-state-icon"><i class="fas fa-users"></i></div><div class="empty-state-title">No users found</div></div></td></tr>';
            return;
        }
        tableBody.innerHTML = users.map(user => `
            <tr>
                <td><div class="user-avatar-placeholder" style="width: 35px; height: 35px; font-size: 12px;">${Utils.getInitials(user.name)}</div></td>
                <td><div style="font-weight: 600;">${Utils.escapeHtml(user.name)}</div><div style="font-size: 12px; color: var(--gray-500);">${Utils.escapeHtml(user.email)}</div></td>
                <td><span class="badge badge-${user.subscription === 'Premium' ? 'warning' : user.subscription === 'Free' ? 'secondary' : 'info'}">${user.subscription}</span></td>
                <td><span class="badge badge-${user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'warning' : 'danger'}">${user.status}</span></td>
                <td>${Utils.formatDate(user.registeredDate)}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="UserManager.viewUser(${user.id})"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="UserManager.editUser(${user.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn" style="background-color: rgba(237, 137, 54, 0.1); color: var(--warning);" onclick="UserManager.suspendUser(${user.id})" title="Suspend"><i class="fas fa-ban"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    viewUser(id) { Utils.showToast('View user: ' + id, 'info'); },
    editUser(id) { Utils.showToast('Edit user: ' + id, 'info'); },
    suspendUser(id) {
        Utils.showConfirm('Suspend User', 'Suspend this user?', () => {
            Utils.showToast('User suspended', 'success');
            this.loadUsers();
        });
    },
    showAddModal() { Utils.showToast('Add user modal', 'info'); },

    getMockUsers() {
        const users = [];
        const statuses = ['Active', 'Active', 'Active', 'Suspended', 'Banned'];
        for (let i = 1; i <= 40; i++) {
            users.push({
                id: i,
                name: `User ${i}`,
                email: `user${i}@example.com`,
                subscription: CONFIG.SUBSCRIPTION_TYPES[i % CONFIG.SUBSCRIPTION_TYPES.length],
                status: statuses[i % statuses.length],
                registeredDate: new Date(Date.now() - i * 86400000 * 10).toISOString()
            });
        }
        return { success: true, data: { items: users.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize) } };
    }
};

if (typeof window !== 'undefined') window.UserManager = UserManager;

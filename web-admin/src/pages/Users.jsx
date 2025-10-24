import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Mail, Ban, Crown, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'premium',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    avatar: 'JD',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    plan: 'free',
    status: 'active',
    joinDate: '2024-01-10',
    lastActive: '1 day ago',
    avatar: 'JS',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    plan: 'premium',
    status: 'suspended',
    joinDate: '2023-12-20',
    lastActive: '1 week ago',
    avatar: 'MJ',
  },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-admin-text-primary">Users Management</h1>
          <p className="text-admin-text-secondary mt-1">Manage user accounts and subscriptions</p>
        </div>
        <Button>
          <UserPlus size={18} className="mr-2" />
          Add User
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '120,000', color: 'bg-blue-500' },
          { label: 'Premium Users', value: '35,000', color: 'bg-spotify-green' },
          { label: 'Free Users', value: '85,000', color: 'bg-admin-text-tertiary' },
          { label: 'Suspended', value: '120', color: 'bg-apple-red' },
        ].map((stat, index) => (
          <Card key={index} hover>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-admin-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-admin-text-primary mt-1">{stat.value}</p>
                </div>
                <div className={`w-2 h-12 ${stat.color} rounded-full`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search users by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="all">All Plans</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </Select>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{user.avatar}</span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.plan === 'premium' ? (
                      <Badge variant="premium">
                        <Crown size={12} className="mr-1" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge>Free</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>{formatDate(user.joinDate)}</TableCell>
                  <TableCell className="text-admin-text-secondary">{user.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Mail size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Ban size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-admin-border-default flex items-center justify-between">
            <span className="text-sm text-admin-text-secondary">Showing 1-10 of 120,000 users</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;

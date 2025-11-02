import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Loader2,
  Globe,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { ConfirmDeleteSong } from '@/components/ui/ConfirmDeleteSong';
import { ConfirmBulkDelete } from '@/components/ui/ConfirmBulkDelete';
import { formatNumber, formatDate } from '@/lib/utils';
import { getAllArtists, deleteArtist } from '@/services/api/artists';

const ArtistManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, artistId: null, artistName: '' });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ isOpen: false, count: 0 });
  const itemsPerPage = 10;

  // Fetch artists using React Query
  const {
    data: artistsData = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['artists', 'all'],
    queryFn: getAllArtists,
    staleTime: 60000, // 60 seconds
  });

  // Show toast on error
  React.useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch artists');
    }
  }, [isError, error]);

  // Delete artist mutation
  const deleteMutation = useMutation({
    mutationFn: (artistId) => deleteArtist(artistId),
    onSuccess: () => {
      queryClient.invalidateQueries(['artists']);
      toast.success('Artist deleted successfully');
      setDeleteModal({ isOpen: false, artistId: null, artistName: '' });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete artist');
    },
  });

  const handleDeleteClick = (artistId, artistName) => {
    setDeleteModal({ isOpen: true, artistId, artistName });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.artistId) {
      deleteMutation.mutate(deleteModal.artistId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, artistId: null, artistName: '' });
  };

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (artistIds) => {
      const deletePromises = artistIds.map(id => deleteArtist(id));
      return await Promise.all(deletePromises);
    },
    onSuccess: (data, artistIds) => {
      queryClient.invalidateQueries(['artists']);
      toast.success(`Successfully deleted ${artistIds.length} artist${artistIds.length > 1 ? 's' : ''}`);
      setBulkDeleteModal({ isOpen: false, count: 0 });
      setSelectedArtists([]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete artists');
    },
  });

  const handleBulkDeleteClick = () => {
    setBulkDeleteModal({ isOpen: true, count: selectedArtists.length });
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedArtists.length > 0) {
      bulkDeleteMutation.mutate(selectedArtists);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteModal({ isOpen: false, count: 0 });
  };

  // Filter and pagination client-side
  const filteredArtists = useMemo(() => {
    let filtered = artistsData;

    // Filter by search query (name)
    if (searchQuery) {
      filtered = filtered.filter(artist =>
        artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.country?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by country
    if (selectedCountry && selectedCountry !== 'all') {
      filtered = filtered.filter(artist => artist.country === selectedCountry);
    }

    return filtered;
  }, [artistsData, searchQuery, selectedCountry]);

  // Pagination
  const paginatedArtists = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArtists.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArtists, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);

  // Extract unique countries for filter
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(artistsData.map(a => a.country).filter(Boolean))];
    return ['all', ...uniqueCountries.sort()];
  }, [artistsData]);

  const toggleArtistSelection = (artistId) => {
    setSelectedArtists(prev =>
      prev.includes(artistId)
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCountry]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-admin-text-primary">Artist Management</h1>
          {/* <p className="text-admin-text-tertiary mt-1">Manage artists, view statistics, and more</p> */}
        </div>
        <Button onClick={() => navigate('/artists/create')}>
          <Plus size={18} className="mr-2" />
          Add New Artist
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-admin-text-tertiary mb-1">Total Artists</p>
                <p className="text-2xl font-bold text-admin-text-primary">
                  {formatNumber(artistsData.length)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-spotify-green/20 flex items-center justify-center">
                <Users size={24} className="text-spotify-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-admin-text-tertiary mb-1">Active Artists</p>
                <p className="text-2xl font-bold text-admin-text-primary">
                  {formatNumber(artistsData.filter(a => a.isActive).length)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <UserCheck size={24} className="text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-admin-text-tertiary mb-1">Countries</p>
                <p className="text-2xl font-bold text-admin-text-primary">
                  {countries.filter(c => c !== 'all').length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Globe size={24} className="text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <Input
                icon={Search}
                placeholder="Search by name or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Country filter */}
            <div>
              <Select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country === 'all' ? 'All Countries' : country}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedArtists.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-admin-bg-hover rounded-lg flex items-center justify-between"
            >
              <span className="text-sm text-admin-text-primary">
                {selectedArtists.length} artist{selectedArtists.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDeleteClick}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Selected
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Artists Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 size={48} className="text-spotify-green animate-spin" />
                  <p className="text-admin-text-secondary">Loading artists...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-apple-red font-medium mb-2">Failed to load artists</p>
                  <p className="text-admin-text-tertiary text-sm">
                    {error?.response?.data?.message || error?.message || 'An error occurred'}
                  </p>
                </div>
              </div>
            )}

            {/* Data Table */}
            {!isLoading && !isError && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow hover={false}>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          className="rounded border-admin-border-default bg-admin-bg-hover"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedArtists(paginatedArtists.map(a => a.artistId));
                            } else {
                              setSelectedArtists([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Debut Year</TableHead>
                      <TableHead>Total Followers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedArtists.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <p className="text-admin-text-tertiary">
                            {searchQuery || selectedCountry !== 'all'
                              ? 'No artists found matching your filters'
                              : 'No artists available'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedArtists.map((artist) => (
                        <TableRow key={artist.artistId}>
                          <TableCell>
                            <input
                              type="checkbox"
                              className="rounded border-admin-border-default bg-admin-bg-hover"
                              checked={selectedArtists.includes(artist.artistId)}
                              onChange={() => toggleArtistSelection(artist.artistId)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-lg font-bold text-white">
                                {artist.name?.charAt(0)?.toUpperCase() || 'A'}
                              </div>
                              <div>
                                <Link
                                  to={`/artists/${artist.artistId}`}
                                  className="font-medium text-admin-text-primary hover:text-spotify-green cursor-pointer transition-colors hover:underline"
                                >
                                  {artist.name || '-'}
                                </Link>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Globe size={16} className="text-admin-text-tertiary" />
                              <span className="text-admin-text-secondary">
                                {artist.country || '-'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-admin-text-tertiary" />
                              <span className="text-admin-text-secondary">
                                {artist.debutYear || '-'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {artist.totalFollowers ? formatNumber(artist.totalFollowers) : '0'}
                              </span>
                              {artist.totalFollowers > 100000 && (
                                <TrendingUp size={14} className="text-spotify-green" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={artist.isActive ? 'active' : 'inactive'} />
                          </TableCell>
                          <TableCell>
                            <div className="relative group">
                              <button className="p-1 hover:bg-admin-bg-hover rounded transition-colors">
                                <MoreVertical size={18} className="text-admin-text-tertiary" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-48 bg-admin-bg-card border border-admin-border-default rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <div className="p-1">
                                  <button
                                    onClick={() => navigate(`/artists/${artist.artistId}/edit`)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded text-admin-text-secondary hover:text-admin-text-primary text-sm"
                                  >
                                    <Edit size={16} />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(artist.artistId, artist.name)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded text-apple-red text-sm"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="p-4 border-t border-admin-border-default flex items-center justify-between">
                  <span className="text-sm text-admin-text-secondary">
                    Showing {filteredArtists.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredArtists.length)} of {filteredArtists.length} artists
                  </span>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-admin-text-secondary px-2">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteSong
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        songTitle={deleteModal.artistName}
        isDeleting={deleteMutation.isPending}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmBulkDelete
        isOpen={bulkDeleteModal.isOpen}
        onClose={handleBulkDeleteCancel}
        onConfirm={handleBulkDeleteConfirm}
        count={bulkDeleteModal.count}
        isDeleting={bulkDeleteMutation.isPending}
      />
    </div>
  );
};

export default ArtistManagement;

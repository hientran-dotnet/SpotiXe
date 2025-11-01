import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Play,
  Edit,
  Trash2,
  Star,
  BarChart3,
  Upload,
  Grid,
  List as ListIcon,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { ConfirmDeleteSong } from '@/components/ui/ConfirmDeleteSong';
import { ConfirmBulkDelete } from '@/components/ui/ConfirmBulkDelete';
import { formatNumber, formatDuration, formatDate } from '@/lib/utils';
import { getAllSongs } from "@/services/api/songs";
import { deleteSong } from "@/services/api/songs/deleteSong";


// const mockTracks = [
//   {
//     id: 1,
//     title: 'Blinding Lights',
//     artist: 'The Weeknd',
//     album: 'After Hours',
//     genre: 'Pop',
//     duration: 200,
//     uploadDate: '2024-01-15',
//     streams: 2840000,
//     status: 'active',
//     cover: '🎵',
//   },
//   {
//     id: 2,
//     title: 'Shape of You',
//     artist: 'Ed Sheeran',
//     album: 'Divide',
//     genre: 'Pop',
//     duration: 233,
//     uploadDate: '2024-01-10',
//     streams: 2650000,
//     status: 'active',
//     cover: '🎵',
//   },
//   {
//     id: 3,
//     title: 'Someone Like You',
//     artist: 'Adele',
//     album: '21',
//     genre: 'Soul',
//     duration: 285,
//     uploadDate: '2024-01-08',
//     streams: 2340000,
//     status: 'active',
//     cover: '🎵',
//   },
//   {
//     id: 4,
//     title: 'New Track Demo',
//     artist: 'Indie Artist',
//     album: 'Single',
//     genre: 'Rock',
//     duration: 180,
//     uploadDate: '2024-01-20',
//     streams: 1200,
//     status: 'pending',
//     cover: '🎵',
//   },
// ];

const MusicManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, songId: null, songTitle: '' });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ isOpen: false, count: 0 });
  const itemsPerPage = 10;

  // Fetch songs using React Query
  const { 
    data: songsData = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['songs', 'all'],
    queryFn: getAllSongs,
    staleTime: 60000, // 60 seconds
  });

  // Show toast on error
  React.useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch songs');
    }
  }, [isError, error]);

  // Delete song mutation
  const deleteMutation = useMutation({
    mutationFn: (songId) => deleteSong(songId),
    onSuccess: () => {
      queryClient.invalidateQueries(['songs']);
      toast.success('Song deleted successfully');
      setDeleteModal({ isOpen: false, songId: null, songTitle: '' });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete song');
    },
  });

  const handleDeleteClick = (songId, songTitle) => {
    setDeleteModal({ isOpen: true, songId, songTitle });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.songId) {
      deleteMutation.mutate(deleteModal.songId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, songId: null, songTitle: '' });
  };

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (songIds) => {
      // Delete all songs in parallel
      const deletePromises = songIds.map(id => deleteSong(id));
      return await Promise.all(deletePromises);
    },
    onSuccess: (data, songIds) => {
      queryClient.invalidateQueries(['songs']);
      toast.success(`Successfully deleted ${songIds.length} song${songIds.length > 1 ? 's' : ''}`);
      setBulkDeleteModal({ isOpen: false, count: 0 });
      setSelectedTracks([]); // Clear selection
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete songs');
    },
  });

  const handleBulkDeleteClick = () => {
    setBulkDeleteModal({ isOpen: true, count: selectedTracks.length });
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedTracks.length > 0) {
      bulkDeleteMutation.mutate(selectedTracks);
    }
  };

  const handleBulkDeleteCancel = () => {
    setBulkDeleteModal({ isOpen: false, count: 0 });
  };

  // Filter và phân trang client-side
  const filteredTracks = useMemo(() => {
    let filtered = songsData;

    // Filter by search query (title)
    if (searchQuery) {
      filtered = filtered.filter(track => 
        track.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre && selectedGenre !== 'all') {
      filtered = filtered.filter(track => track.genre === selectedGenre);
    }

    return filtered;
  }, [songsData, searchQuery, selectedGenre]);

  // Pagination
  const paginatedTracks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTracks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTracks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTracks.length / itemsPerPage);

  const tabs = [
    { id: 'all', label: 'All Tracks', count: songsData.length },
    { id: 'albums', label: 'Albums', count: 156 },
    { id: 'singles', label: 'Singles', count: 432 },
    { id: 'pending', label: 'Pending Approval', count: 12 },
  ];

  const genres = ['all', 'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical'];

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
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
  }, [searchQuery, selectedGenre]);

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
          <h1 className="text-3xl font-bold text-admin-text-primary">Music Management</h1>
        </div>
        <Button onClick={() => navigate('/songs/create')}>
          <Plus size={18} className="mr-2" />
          Create New Song
        </Button>
      </motion.div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-admin-border-default overflow-x-auto">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-spotify-green border-spotify-green'
                      : 'text-admin-text-secondary border-transparent hover:text-admin-text-primary'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-admin-bg-hover text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search - 2 columns on desktop */}
            <div className="md:col-span-1 lg:col-span-2">
              <Input
                icon={Search}
                placeholder="Search tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Genre filter - 1 column */}
            <div>
              <Select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTracks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-admin-bg-hover rounded-lg flex items-center justify-between"
            >
              <span className="text-sm text-admin-text-primary">
                {selectedTracks.length} track{selectedTracks.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="danger"
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

      {/* Tracks Table */}
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
                  <p className="text-admin-text-secondary">Loading songs...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-apple-red font-medium mb-2">Failed to load songs</p>
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
                              setSelectedTracks(paginatedTracks.map(t => t.songId));
                            } else {
                              setSelectedTracks([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Track</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Album</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Release Date</TableHead>
                      <TableHead>Streams</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTracks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-12">
                          <p className="text-admin-text-tertiary">
                            {searchQuery || selectedGenre !== 'all' 
                              ? 'No tracks found matching your filters' 
                              : 'No tracks available'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTracks.map((track) => (
                        <TableRow key={track.songId}>
                          <TableCell>
                            <input
                              type="checkbox"
                              className="rounded border-admin-border-default bg-admin-bg-hover"
                              checked={selectedTracks.includes(track.songId)}
                              onChange={() => toggleTrackSelection(track.songId)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative group">
                                <div className="w-10 h-10 bg-gradient-primary rounded flex items-center justify-center text-lg">
                                  {track.coverImageUrl ? (
                                    <img 
                                      src={track.coverImageUrl} 
                                      alt={track.title}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    '🎵'
                                  )}
                                </div>
                                <button className="absolute inset-0 bg-black/60 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Play size={14} fill="white" className="text-white" />
                                </button>
                              </div>
                              <div>
                                <Link
                                  to={`/songs/${track.songId}`}
                                  className="font-medium text-admin-text-primary hover:text-spotify-green cursor-pointer transition-colors hover:underline"
                                  aria-label={`View details for ${track.title}`}
                                >
                                  {track.title || '-'}
                                </Link>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/songs/${track.songId}`}
                              className="text-admin-text-secondary hover:text-spotify-green cursor-pointer transition-colors hover:underline"
                            >
                              {track.artistName || '-'}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/songs/${track.songId}`}
                              className="text-admin-text-secondary hover:text-spotify-green cursor-pointer transition-colors hover:underline"
                            >
                              {track.albumTitle || '-'}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">{track.genre || '-'}</Badge>
                          </TableCell>
                          <TableCell>
                            {track.duration ? formatDuration(track.duration) : '-'}
                          </TableCell>
                          <TableCell>
                            {track.releaseDate ? formatDate(track.releaseDate) : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {track.playCount ? formatNumber(track.playCount) : '0'}
                              </span>
                              {track.playCount > 1000000 && (
                                <TrendingUp size={14} className="text-spotify-green" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={track.isActive ? 'active' : 'inactive'} />
                          </TableCell>
                          <TableCell>
                            <div className="relative group">
                              <button className="p-1 hover:bg-admin-bg-hover rounded transition-colors">
                                <MoreVertical size={18} className="text-admin-text-tertiary" />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-48 bg-admin-bg-card border border-admin-border-default rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <div className="p-1">
                                  <button 
                                    onClick={() => navigate(`/songs/${track.songId}/edit`)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded text-admin-text-secondary hover:text-admin-text-primary text-sm"
                                  >
                                    <Edit size={16} />
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteClick(track.songId, track.title)}
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
                    Showing {filteredTracks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredTracks.length)} of {filteredTracks.length} tracks
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

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} size="lg">
        <ModalHeader onClose={() => setShowUploadModal(false)}>
          <ModalTitle>Upload New Track</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-admin-border-default rounded-lg p-8 text-center hover:border-spotify-green transition-colors cursor-pointer">
              <Upload size={48} className="mx-auto text-admin-text-tertiary mb-4" />
              <p className="text-admin-text-primary font-medium">Drop your audio file here</p>
              <p className="text-sm text-admin-text-tertiary mt-1">or click to browse (MP3, WAV, FLAC)</p>
            </div>
            <Input label="Track Title" placeholder="Enter track title" />
            <Input label="Artist Name" placeholder="Enter artist name" />
            <Input label="Album Name" placeholder="Enter album name" />
            <Select label="Genre">
              <option value="">Select genre</option>
              {genres.filter(g => g !== 'all').map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button>Upload Track</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteSong
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        songTitle={deleteModal.songTitle}
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

export default MusicManagement;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Heart,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { formatNumber, formatDuration, formatDate } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const mockTracks = [
  {
    id: 1,
    title: 'Blinding Lights',
    artists: ['The Weeknd'],
    album: 'After Hours',
    genre: 'Pop',
    duration: 200,
    releaseDate: new Date('2024-03-12'),
    plays: 2840000,
    likes: 458000,
    isPublic: true,
    isActive: true,
    isExplicit: false,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=64&h=64&fit=crop',
  },
  {
    id: 2,
    title: 'Shape of You',
    artists: ['Ed Sheeran'],
    album: 'Divide',
    genre: 'Pop',
    duration: 233,
    releaseDate: new Date('2024-01-17'),
    plays: 2650000,
    likes: 392000,
    isPublic: true,
    isActive: true,
    isExplicit: true,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop',
  },
  {
    id: 3,
    title: 'Someone Like You',
    artists: ['Adele', 'Rick Rubin'],
    album: '21',
    genre: 'Soul',
    duration: 285,
    releaseDate: new Date('2024-02-28'),
    plays: 2340000,
    likes: 521000,
    isPublic: true,
    isActive: true,
    isExplicit: false,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=64&h=64&fit=crop',
  },
  {
    id: 4,
    title: 'New Track Demo',
    artists: ['Indie Artist', 'Feat. Unknown'],
    album: 'Single',
    genre: 'Rock',
    duration: 180,
    releaseDate: new Date('2024-10-20'),
    plays: 1200,
    likes: 89,
    isPublic: false,
    isActive: false,
    isExplicit: true,
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=64&h=64&fit=crop',
  },
];

const MusicManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [tracks, setTracks] = useState(mockTracks);

  const tabs = [
    { id: 'all', label: 'All Tracks', count: 1234 },
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

  const handleTogglePublic = (trackId) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, isPublic: !track.isPublic } : track
      )
    );
  };

  const handleToggleActive = (trackId) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, isActive: !track.isActive } : track
      )
    );
  };

  const getGenreColor = (genre) => {
    const colors = {
      Pop: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      Rock: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Soul: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Hip Hop': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Electronic: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      Jazz: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Classical: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return colors[genre] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

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
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus size={18} className="mr-2" />
          Upload New Track
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter size={18} className="mr-2" />
                More Filters
              </Button>
              <div className="flex border border-admin-border-default rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-admin-bg-hover text-spotify-green' : 'text-admin-text-tertiary'}`}
                >
                  <ListIcon size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-admin-bg-hover text-spotify-green' : 'text-admin-text-tertiary'}`}
                >
                  <Grid size={18} />
                </button>
              </div>
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
                <Button size="sm" variant="outline">
                  <Star size={16} className="mr-2" />
                  Feature
                </Button>
                <Button size="sm" variant="outline">
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="danger">
                  <Trash2 size={16} className="mr-2" />
                  Delete
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
            <Table>
              <TableHeader>
                <TableRow hover={false}>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-admin-border-default bg-admin-bg-hover"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTracks(tracks.map(t => t.id));
                        } else {
                          setSelectedTracks([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Release</TableHead>
                  <TableHead>Plays</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Public</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracks.map((track) => (
                  <TableRow key={track.id}>
                    {/* Checkbox */}
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-admin-border-default bg-admin-bg-hover"
                        checked={selectedTracks.includes(track.id)}
                        onChange={() => toggleTrackSelection(track.id)}
                      />
                    </TableCell>

                    {/* Cover */}
                    <TableCell>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-admin-bg-hover transition-transform hover:scale-110 cursor-pointer">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-admin-text-primary">
                          {track.title}
                        </span>
                        {track.isExplicit && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">
                            E
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Artist */}
                    <TableCell>
                      <span className="text-admin-text-secondary text-sm">
                        {track.artists.join(', ')}
                      </span>
                    </TableCell>

                    {/* Album */}
                    <TableCell>
                      <span className="text-admin-text-tertiary text-sm italic">
                        {track.album}
                      </span>
                    </TableCell>

                    {/* Genre */}
                    <TableCell>
                      <Badge className={`border ${getGenreColor(track.genre)}`}>
                        {track.genre}
                      </Badge>
                    </TableCell>

                    {/* Duration */}
                    <TableCell>
                      <span className="text-admin-text-secondary text-sm font-mono">
                        {formatDuration(track.duration)}
                      </span>
                    </TableCell>

                    {/* Release */}
                    <TableCell>
                      <span className="text-admin-text-secondary text-sm">
                        {formatDate(track.releaseDate)}
                      </span>
                    </TableCell>

                    {/* Plays */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Play size={14} className="text-spotify-green" />
                        <span className="text-admin-text-primary text-sm font-medium">
                          {formatNumber(track.plays)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Likes */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Heart size={14} className="text-apple-red" />
                        <span className="text-admin-text-primary text-sm font-medium">
                          {formatNumber(track.likes)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Public */}
                    <TableCell>
                      <Switch
                        checked={track.isPublic}
                        onChange={() => handleTogglePublic(track.id)}
                      />
                    </TableCell>

                    {/* Active */}
                    <TableCell>
                      <Switch
                        checked={track.isActive}
                        onChange={() => handleToggleActive(track.id)}
                      />
                    </TableCell>

                    {/* Updated */}
                    <TableCell>
                      <span className="text-admin-text-tertiary text-xs">
                        {formatDistanceToNow(track.updatedAt, { addSuffix: true })}
                      </span>
                    </TableCell>

                    {/* Action Menu */}
                    <TableCell>
                      <div className="relative group">
                        <button className="p-1 hover:bg-admin-bg-hover rounded transition-colors">
                          <MoreVertical size={18} className="text-admin-text-tertiary" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-admin-bg-card border border-admin-border-default rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="p-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded text-admin-text-secondary hover:text-admin-text-primary text-sm">
                              <Edit size={16} />
                              Edit
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded text-admin-text-secondary hover:text-admin-text-primary text-sm">
                              <BarChart3 size={16} />
                              Analytics
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded text-admin-text-secondary hover:text-admin-text-primary text-sm">
                              <Star size={16} />
                              Feature Track
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded text-apple-red text-sm">
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t border-admin-border-default flex items-center justify-between">
              <span className="text-sm text-admin-text-secondary">
                Showing 1-10 of 1,234 tracks
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
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
    </div>
  );
};

export default MusicManagement;

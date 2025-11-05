import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Upload, Filter, MoreVertical, Play, Edit, ArrowLeft, Trash2, TrendingUp, Download, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { StatusBadge } from '@components/common/Badge'
import { TableSkeleton } from '@components/common/LoadingScreen'
import Modal, { ModalFooter } from '@components/common/Modal'
import Input, { Select } from '@components/common/Input'
import { formatNumber, formatDuration, formatCurrency } from '@utils/helpers'
import mockApi from '@services/mockApi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function MusicManagement() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [selectedTab, setSelectedTab] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTracks, setSelectedTracks] = useState([])
  const [filters, setFilters] = useState({
    genre: '',
    status: '',
    dateRange: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['tracks', page, filters],
    queryFn: () => mockApi.getTracks(page, 20, filters),
  })

  const tabs = [
    { id: 'all', label: 'All Tracks', count: data?.total || 0 },
    // { id: 'albums', label: 'Albums', count: 234 },
    // { id: 'singles', label: 'Singles', count: 567 },
    // { id: 'pending', label: 'Pending Approval', count: 23 },
  ]

  const handleSelectTrack = (trackId) => {
    setSelectedTracks(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTracks.length === data?.data.length) {
      setSelectedTracks([])
    } else {
      setSelectedTracks(data?.data.map(track => track.id) || [])
    }
  }

  const handleDelete = (trackId) => {
    toast.success('Track deleted successfully')
  }

  const handleBulkAction = (action) => {
    toast.success(`${action} applied to ${selectedTracks.length} tracks`)
    setSelectedTracks([])
  }

  const handleRowClick = (trackId, e) => {
    // Don't navigate if clicking on checkbox, action button, or inside action menu
    if (
      e.target.closest('input[type="checkbox"]') ||
      e.target.closest('.action-menu') ||
      e.target.closest('button')
    ) {
      return
    }
    navigate(`/songs/${trackId}`)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Quản lý bài hát
          </h1>
        </div>
        <Button
          icon={Plus}
          iconPosition="left"
          onClick={() => navigate('/songs/add')}
        >
          Thêm bài hát
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2 font-medium transition-all ${
              selectedTab === tab.id
                ? 'text-spotify-green border-b-2 border-spotify-green'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-sm">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Filters & Bulk Actions */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            {selectedTracks.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">
                  {selectedTracks.length} selected
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('Delete')}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('Feature')}
                >
                  Feature
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('Export')}
                >
                  Export
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select
              options={[
                { value: '10', label: '10 / page' },
                { value: '20', label: '20 / page' },
                { value: '50', label: '50 / page' },
              ]}
              className="w-30"
            />
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Select
              label="Genre"
              options={[
                { value: '', label: 'All Genres' },
                { value: 'pop', label: 'Pop' },
                { value: 'rock', label: 'Rock' },
                { value: 'hip-hop', label: 'Hip Hop' },
                { value: 'electronic', label: 'Electronic' },
              ]}
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            />
            <Select
              label="Status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
              ]}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            />
            <Select
              label="Date Range"
              options={[
                { value: '', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
              ]}
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            />
            <div className="flex items-end gap-2">
              <Button variant="secondary" size="md" className="flex-1">
                Apply
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setFilters({ genre: '', status: '', dateRange: '' })}
              >
                Reset
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Tracks Table */}
      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={10} columns={8} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTracks.length === data?.data.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-border bg-bg-tertiary"
                      />
                    </th>
                    <th className="px-4 py-3 pl-12 text-xs font-medium text-text-tertiary uppercase text-left">
                      Track
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-text-tertiary uppercase text-left">
                      Artist
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase">
                      Album
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase">
                      Genre
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase">
                      Duration
                    </th>
                    {/* <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase">
                      Streams
                    </th> */}
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase">
                      Upload Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-tertiary uppercase">
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.data.map((track) => (
                    <tr
                      key={track.id}
                      onClick={(e) => handleRowClick(track.id, e)}
                      className="hover:bg-bg-hover transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedTracks.includes(track.id)}
                          onChange={() => handleSelectTrack(track.id)}
                          className="w-4 h-4 rounded border-border bg-bg-tertiary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative group/play flex-shrink-0">
                            <img
                              src={track.thumbnail}
                              alt={track.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            {/* <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-opacity">
                              <Play className="w-5 h-5 text-white" />
                            </div> */}
                          </div>
                          <div className="flex flex-col">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/songs/${track.id}`)
                              }}
                              className="font-medium text-text-primary hover:text-spotify-green transition-colors text-left"
                            >
                              {track.title}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {track.artist}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {track.album}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {track.genre}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatDuration(track.duration)}
                      </td>
                      {/* <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">
                            {formatNumber(track.streams)}
                          </span>
                          <TrendingUp className="w-4 h-4 text-spotify-green" />
                        </div>
                      </td> */}
                      <td className="px-4 py-3 text-text-secondary">
                        {format(new Date(track.uploadDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={track.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group/action action-menu" onClick={(e) => e.stopPropagation()}>
                          <button className="p-1.5 hover:bg-bg-hover rounded transition-colors">
                            <MoreVertical className="w-4 h-4 text-text-tertiary" />
                          </button>
                          
                          {/* Dropdown Menu - Shows on hover */}
                          <div className="absolute right-0 top-full mt-1 w-48 bg-bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible transition-all z-20">
                            <div className="p-1">
                              <button 
                                onClick={() => {
                                  navigate(`/songs/${track.id}/edit`)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary text-sm transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button 
                                onClick={() => {
                                  handleDelete(track.id)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bg-hover rounded text-apple-red text-sm transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data?.total || 0)} of {data?.total || 0} tracks
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= (data?.totalPages || 1)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

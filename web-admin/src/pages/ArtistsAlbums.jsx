import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Grid, List, Search, MoreVertical, Mail, Edit, Ban } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import Avatar from '@components/common/Avatar'
import Badge from '@components/common/Badge'
import { CardSkeleton } from '@components/common/LoadingScreen'
import { formatNumber } from '@utils/helpers'
import mockApi from '@services/mockApi'

export default function ArtistsAlbums() {
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['artists', page],
    queryFn: () => mockApi.getArtists(page, 12),
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Artists & Albums
          </h1>
          {/* <p className="text-text-secondary">
            Manage artists, albums, and their content
          </p> */}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            Add Artist
          </Button>
          <div className="flex items-center gap-1 p-1 bg-bg-secondary rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-bg-hover' : ''
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-bg-hover' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search artists..."
            className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border rounded-lg focus:border-spotify-green focus:outline-none"
          />
        </div>
      </Card>

      {/* Artists Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar
                      src={artist.avatar}
                      name={artist.name}
                      size="2xl"
                      className="border-4 border-spotify-green/20"
                    />
                    {artist.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-spotify-green rounded-full flex items-center justify-center border-2 border-bg-card">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {artist.name}
                  </h3>
                  <Badge variant="secondary" size="sm" className="mb-4">
                    {artist.genre}
                  </Badge>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-text-tertiary">Followers</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {formatNumber(artist.followers)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary">Albums</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {artist.albums}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary">Streams</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {formatNumber(artist.totalStreams)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button variant="secondary" size="sm" icon={MoreVertical}>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-secondary">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-text-tertiary uppercase">
                  Artist
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-text-tertiary uppercase">
                  Genre
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-text-tertiary uppercase">
                  Followers
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-text-tertiary uppercase">
                  Albums
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-text-tertiary uppercase">
                  Total Streams
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-text-tertiary uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.data.map((artist) => (
                <tr key={artist.id} className="hover:bg-bg-hover">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={artist.avatar} name={artist.name} />
                      <div>
                        <p className="font-medium text-text-primary flex items-center gap-2">
                          {artist.name}
                          {artist.verified && (
                            <svg className="w-4 h-4 text-spotify-green" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{artist.genre}</td>
                  <td className="px-6 py-4 text-text-primary font-medium">
                    {formatNumber(artist.followers)}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{artist.albums}</td>
                  <td className="px-6 py-4 text-text-primary font-medium">
                    {formatNumber(artist.totalStreams)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" icon={Edit} />
                      <Button variant="ghost" size="sm" icon={Mail} />
                      <Button variant="ghost" size="sm" icon={Ban} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={page >= (data?.totalPages || 1)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

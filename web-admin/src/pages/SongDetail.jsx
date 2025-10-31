import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Heart,
  Calendar,
  Clock,
  Music,
  Disc,
  FileAudio,
  HardDrive,
  Radio,
  ExternalLink,
  Eye,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
} from 'lucide-react';
import { getSongById } from '@/services/api/songs';
import { 
  formatDuration, 
  formatDateTime, 
  formatFileSize, 
  formatBitrate,
  formatNumber 
} from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const SongDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch song details
  const { 
    data: song, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['song', id],
    queryFn: () => getSongById(id),
    staleTime: 60000,
  });

  // Show toast on error
  React.useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch song details');
    }
  }, [isError, error]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-spotify-green animate-spin" />
          <p className="text-admin-text-secondary">Loading song details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !song) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle size={64} className="text-apple-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-admin-text-primary mb-2">
            Failed to Load Song
          </h2>
          <p className="text-admin-text-tertiary mb-6">
            {error?.response?.data?.message || error?.message || 'Song not found'}
          </p>
          <Button onClick={() => navigate('/music')}>
            <ArrowLeft size={18} className="mr-2" />
            Back to Music List
          </Button>
        </div>
      </div>
    );
  }

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-admin-border-default last:border-0">
      {Icon && <Icon size={20} className="text-admin-text-tertiary mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-admin-text-tertiary mb-1">{label}</p>
        <p className="text-admin-text-primary font-medium break-words">
          {value || '-'}
        </p>
      </div>
    </div>
  );

  const BooleanBadge = ({ value, trueLabel = 'Yes', falseLabel = 'No' }) => (
    <Badge variant={value ? 'success' : 'default'}>
      {value ? (
        <>
          <CheckCircle size={12} className="mr-1" />
          {trueLabel}
        </>
      ) : (
        <>
          <XCircle size={12} className="mr-1" />
          {falseLabel}
        </>
      )}
    </Badge>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/music')}
          className="mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Music List
        </Button>
        
        {/* <h1 className="text-3xl font-bold text-admin-text-primary">Song Details</h1> */}
      </motion.div>

      {/* Cover & Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Cover Image */}
              <div className="flex-shrink-0">
                <div className="w-64 h-64 rounded-lg overflow-hidden bg-admin-bg-hover shadow-lg">
                  {song.coverImageUrl ? (
                    <img
                      src={song.coverImageUrl}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music size={96} className="text-admin-text-tertiary" />
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-admin-text-primary mb-2">
                    {song.title}
                  </h2>
                  <p className="text-xl text-admin-text-secondary">
                    Artist ID: {song.artistId} • Album ID: {song.albumId}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge variant="info" className="text-sm">
                    <Music size={14} className="mr-1" />
                    {song.genre || 'Unknown Genre'}
                  </Badge>
                  <Badge variant="default" className="text-sm">
                    <Clock size={14} className="mr-1" />
                    {formatDuration(song.duration)}
                  </Badge>
                  <Badge variant="default" className="text-sm">
                    <FileAudio size={14} className="mr-1" />
                    {song.audioFormat || 'Unknown'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-admin-text-tertiary mb-1">Play Count</p>
                    <p className="text-2xl font-bold text-admin-text-primary flex items-center gap-2">
                      <Play size={20} className="text-spotify-green" />
                      {formatNumber(song.playCount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-text-tertiary mb-1">Likes</p>
                    <p className="text-2xl font-bold text-admin-text-primary flex items-center gap-2">
                      <Heart size={20} className="text-apple-red" />
                      {formatNumber(song.likeCount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-text-tertiary mb-1">File Size</p>
                    <p className="text-2xl font-bold text-admin-text-primary">
                      {formatFileSize(song.fileSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-text-tertiary mb-1">Bitrate</p>
                    <p className="text-2xl font-bold text-admin-text-primary">
                      {formatBitrate(song.bitrate)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    variant="default"
                    onClick={() => navigate(`/songs/${id}/edit`)}
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Song
                  </Button>
                  {song.streamingUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(song.streamingUrl, '_blank')}
                    >
                      <Radio size={18} className="mr-2" />
                      Open Streaming URL
                    </Button>
                  )}
                  {song.audioFileUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(song.audioFileUrl, '_blank')}
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Open Audio File
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <Music size={24} className="text-spotify-green" />
              Basic Information
            </h3>
            <div className="space-y-0">
              <InfoRow label="Song ID" value={song.songId} icon={Music} />
              <InfoRow label="Title" value={song.title} icon={Disc} />
              <InfoRow label="Genre" value={song.genre} icon={Music} />
              <InfoRow 
                label="Duration" 
                value={formatDuration(song.duration)} 
                icon={Clock} 
              />
              <InfoRow 
                label="Release Date" 
                value={song.releaseDate ? formatDateTime(song.releaseDate) : '-'} 
                icon={Calendar} 
              />
              <InfoRow label="Artist ID" value={song.artistId} />
              <InfoRow label="Album ID" value={song.albumId} />
            </div>
          </CardContent>
        </Card>

        {/* Audio Quality & URLs */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <FileAudio size={24} className="text-spotify-green" />
              Audio Quality & URLs
            </h3>
            <div className="space-y-0">
              <InfoRow label="Audio Format" value={song.audioFormat} icon={FileAudio} />
              <InfoRow label="Bitrate" value={formatBitrate(song.bitrate)} icon={Radio} />
              <InfoRow label="File Size" value={formatFileSize(song.fileSize)} icon={HardDrive} />
              <InfoRow 
                label="Low Quality URL" 
                value={song.lowQualityUrl ? (
                  <a 
                    href={song.lowQualityUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink size={14} />
                  </a>
                ) : '-'} 
              />
              <InfoRow 
                label="Medium Quality URL" 
                value={song.mediumQualityUrl ? (
                  <a 
                    href={song.mediumQualityUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink size={14} />
                  </a>
                ) : '-'} 
              />
              <InfoRow 
                label="High Quality URL" 
                value={song.highQualityUrl ? (
                  <a 
                    href={song.highQualityUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink size={14} />
                  </a>
                ) : '-'} 
              />
              <InfoRow 
                label="Lossless Quality URL" 
                value={song.losslessQualityUrl ? (
                  <a 
                    href={song.losslessQualityUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink size={14} />
                  </a>
                ) : '-'} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <Play size={24} className="text-spotify-green" />
              Statistics
            </h3>
            <div className="space-y-0">
              <InfoRow 
                label="Play Count" 
                value={formatNumber(song.playCount || 0)} 
                icon={Play} 
              />
              <InfoRow 
                label="Like Count" 
                value={formatNumber(song.likeCount || 0)} 
                icon={Heart} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Status & Permissions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <Eye size={24} className="text-spotify-green" />
              Status & Permissions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-admin-border-default">
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-admin-text-tertiary" />
                  <span className="text-sm text-admin-text-tertiary">Public</span>
                </div>
                <BooleanBadge value={song.isPublic} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-admin-border-default">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-admin-text-tertiary" />
                  <span className="text-sm text-admin-text-tertiary">Has Copyright</span>
                </div>
                <BooleanBadge value={song.hasCopyright} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-admin-text-tertiary" />
                  <span className="text-sm text-admin-text-tertiary">Active</span>
                </div>
                <BooleanBadge value={song.isActive} trueLabel="Active" falseLabel="Inactive" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lyrics */}
        {song.lyrics && (
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
                <FileAudio size={24} className="text-spotify-green" />
                Lyrics
              </h3>
              <div className="bg-admin-bg-hover rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-admin-text-secondary whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {song.lyrics}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timestamps */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-spotify-green" />
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoRow 
                label="Created At" 
                value={song.createdAt ? formatDateTime(song.createdAt) : '-'} 
                icon={Calendar} 
              />
              <InfoRow 
                label="Updated At" 
                value={song.updatedAt ? formatDateTime(song.updatedAt) : '-'} 
                icon={Calendar} 
              />
              <InfoRow 
                label="Deleted At" 
                value={song.deletedAt ? formatDateTime(song.deletedAt) : 'Not Deleted'} 
                icon={Calendar} 
              />
            </div>
          </CardContent>
        </Card>

        {/* File URLs */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <ExternalLink size={24} className="text-spotify-green" />
              File URLs
            </h3>
            <div className="space-y-0">
              <InfoRow 
                label="Audio File URL" 
                value={song.audioFileUrl ? (
                  <a 
                    href={song.audioFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:underline flex items-center gap-1 break-all"
                  >
                    {song.audioFileUrl} <ExternalLink size={14} />
                  </a>
                ) : '-'} 
              />
              <InfoRow 
                label="Streaming URL" 
                value={song.streamingUrl ? (
                  <a 
                    href={song.streamingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:underline flex items-center gap-1 break-all"
                  >
                    {song.streamingUrl} <ExternalLink size={14} />
                  </a>
                ) : '-'} 
              />
              <InfoRow 
                label="Cover Image URL" 
                value={song.coverImageUrl ? (
                  <a 
                    href={song.coverImageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:underline flex items-center gap-1 break-all"
                  >
                    {song.coverImageUrl} <ExternalLink size={14} />
                  </a>
                ) : '-'} 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SongDetail;

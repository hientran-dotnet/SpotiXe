import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Globe,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { getArtistById } from '@/services/api/artists';
import { deleteArtist } from '@/services/api/artists/deleteArtist';
import { formatNumber, formatDateTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDeleteSong } from '@/components/ui/ConfirmDeleteSong';

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch artist details
  const {
    data: artist,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtistById(id),
    staleTime: 60000,
  });

  // Show toast on error
  React.useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to fetch artist details');
    }
  }, [isError, error]);

  // Delete artist mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteArtist(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['artists']);
      toast.success('Artist deleted successfully');
      navigate('/artists');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete artist');
    },
  });

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-spotify-green animate-spin" />
          <p className="text-admin-text-secondary">Loading artist details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !artist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle size={64} className="text-apple-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-admin-text-primary mb-2">
            Failed to Load Artist
          </h2>
          <p className="text-admin-text-tertiary mb-6">
            {error?.response?.data?.message || error?.message || 'Artist not found'}
          </p>
          <Button onClick={() => navigate('/artists')}>
            <ArrowLeft size={18} className="mr-2" />
            Back to Artists
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
          onClick={() => navigate('/artists')}
          className="mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Artists
        </Button>
      </motion.div>

      {/* Profile & Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-64 h-64 rounded-lg overflow-hidden bg-admin-bg-hover shadow-lg">
                  {artist.profileImageUrl ? (
                    <img
                      src={artist.profileImageUrl}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={96} className="text-admin-text-tertiary" />
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-admin-text-primary mb-2">
                    {artist.name}
                  </h2>
                  {artist.country && (
                    <p className="text-xl text-admin-text-secondary flex items-center gap-2">
                      <Globe size={20} />
                      {artist.country}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {artist.debutYear && (
                    <Badge variant="info" className="text-sm">
                      <Calendar size={14} className="mr-1" />
                      Debut: {artist.debutYear}
                    </Badge>
                  )}
                  <Badge variant={artist.isActive ? 'success' : 'default'} className="text-sm">
                    {artist.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-admin-text-tertiary mb-1">Total Followers</p>
                    <p className="text-2xl font-bold text-admin-text-primary flex items-center gap-2">
                      <Users size={20} className="text-spotify-green" />
                      {formatNumber(artist.totalFollowers || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-text-tertiary mb-1">Artist ID</p>
                    <p className="text-2xl font-bold text-admin-text-primary">
                      {artist.artistId}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    variant="default"
                    onClick={() => navigate(`/artists/${id}/edit`)}
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Artist
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete Artist
                  </Button>
                  {artist.profileImageUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(artist.profileImageUrl, '_blank')}
                    >
                      <ExternalLink size={18} className="mr-2" />
                      View Profile Image
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
              <User size={24} className="text-spotify-green" />
              Basic Information
            </h3>
            <div className="space-y-0">
              <InfoRow label="Artist ID" value={artist.artistId} icon={User} />
              <InfoRow label="Name" value={artist.name} icon={User} />
              <InfoRow label="Country" value={artist.country} icon={Globe} />
              <InfoRow label="Debut Year" value={artist.debutYear} icon={Calendar} />
              <InfoRow 
                label="Total Followers" 
                value={formatNumber(artist.totalFollowers || 0)} 
                icon={Users} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-spotify-green" />
              Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-admin-border-default">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-admin-text-tertiary" />
                  <span className="text-sm text-admin-text-tertiary">Active</span>
                </div>
                <BooleanBadge value={artist.isActive} trueLabel="Active" falseLabel="Inactive" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biography */}
        {artist.bio && (
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
                <FileText size={24} className="text-spotify-green" />
                Biography
              </h3>
              <div className="bg-admin-bg-hover rounded-lg p-4">
                <p className="text-admin-text-secondary whitespace-pre-wrap text-sm leading-relaxed">
                  {artist.bio}
                </p>
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
                value={artist.createdAt ? formatDateTime(artist.createdAt) : '-'}
                icon={Calendar}
              />
              <InfoRow
                label="Updated At"
                value={artist.updatedAt ? formatDateTime(artist.updatedAt) : '-'}
                icon={Calendar}
              />
              <InfoRow
                label="Deleted At"
                value={artist.deletedAt ? formatDateTime(artist.deletedAt) : 'Not Deleted'}
                icon={Calendar}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Image URL */}
        {artist.profileImageUrl && (
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-admin-text-primary mb-4 flex items-center gap-2">
                <ImageIcon size={24} className="text-spotify-green" />
                Profile Image URL
              </h3>
              <div className="space-y-0">
                <InfoRow
                  label="Profile Image URL"
                  value={artist.profileImageUrl ? (
                    <a
                      href={artist.profileImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-spotify-green hover:underline flex items-center gap-1 break-all"
                    >
                      {artist.profileImageUrl} <ExternalLink size={14} />
                    </a>
                  ) : '-'}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteSong
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        songTitle={artist?.name}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default ArtistDetail;

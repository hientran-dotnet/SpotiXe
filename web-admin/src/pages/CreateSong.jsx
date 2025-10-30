import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Upload,
  Music,
  Image as ImageIcon,
  Save,
  X,
  ArrowLeft,
  Loader2,
  FileAudio,
  Calendar,
  Users,
  Disc,
  Settings,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createSong } from '@/services/api/songs';
import { getAllArtists } from '@/services/api/artists';
import { getAllAlbums } from '@/services/api/albums';

const CreateSong = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      artistId: '',
      albumId: '',
      genre: '',
      releaseDate: new Date().toISOString().split('T')[0],
      durationMinutes: '',
      durationSeconds: '',
      audioFileUrl: '',
      streamingUrl: '',
      coverImageUrl: '',
      lyrics: '',
      fileSize: 0,
      audioFormat: '',
      bitrate: '',
      lowQualityUrl: '',
      mediumQualityUrl: '',
      highQualityUrl: '',
      losslessQualityUrl: '',
      isPublic: true,
      hasCopyright: true,
    },
  });

  // Fetch artists
  const { data: artists = [], isLoading: loadingArtists } = useQuery({
    queryKey: ['artists'],
    queryFn: getAllArtists,
  });

  // Fetch albums
  const { data: albums = [], isLoading: loadingAlbums } = useQuery({
    queryKey: ['albums'],
    queryFn: getAllAlbums,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createSong,
    onSuccess: () => {
      toast.success('Song created successfully!');
      queryClient.invalidateQueries(['songs']);
      navigate('/music');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create song');
    },
  });

  // Handle audio file upload
  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|flac)$/i)) {
      toast.error('Please upload a valid audio file (MP3, WAV, or FLAC)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('Audio file size must be less than 50MB');
      return;
    }

    setAudioFile(file);

    // Fake URL generation
    const fakeUrl = `https://cdn.spotixe.com/audio/${Date.now()}_${file.name}`;
    setValue('audioFileUrl', fakeUrl);
    setValue('streamingUrl', `${fakeUrl}?quality=adaptive`);
    setValue('fileSize', file.size);
    
    // Extract audio format
    const format = file.name.split('.').pop().toLowerCase();
    setValue('audioFormat', format);

    // Auto-fill quality URLs
    setValue('lowQualityUrl', `${fakeUrl}?quality=low`);
    setValue('mediumQualityUrl', `${fakeUrl}?quality=medium`);
    setValue('highQualityUrl', `${fakeUrl}?quality=high`);
    setValue('losslessQualityUrl', `${fakeUrl}?quality=lossless`);

    // Try to extract duration from audio file
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      const duration = Math.floor(audio.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      setValue('durationMinutes', minutes.toString());
      setValue('durationSeconds', seconds.toString());
    });
  };

  // Handle cover image upload
  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image file size must be less than 5MB');
      return;
    }

    setCoverImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Fake URL generation
    const fakeUrl = `https://cdn.spotixe.com/covers/${Date.now()}_${file.name}`;
    setValue('coverImageUrl', fakeUrl);
  };

  // Convert MM:SS to seconds
  const convertToSeconds = (minutes, seconds) => {
    const min = parseInt(minutes) || 0;
    const sec = parseInt(seconds) || 0;
    return min * 60 + sec;
  };

  // Form submission
  const onSubmit = async (data) => {
    // Validate required files
    if (!audioFile) {
      toast.error('Please upload an audio file');
      return;
    }
    if (!coverImage) {
      toast.error('Please upload a cover image');
      return;
    }

    // Convert duration to seconds
    const duration = convertToSeconds(data.durationMinutes, data.durationSeconds);
    if (duration === 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    // Prepare payload
    const payload = {
      title: data.title,
      duration: duration,
      releaseDate: data.releaseDate,
      audioFileUrl: data.audioFileUrl,
      streamingUrl: data.streamingUrl || data.audioFileUrl,
      coverImageUrl: data.coverImageUrl,
      lyrics: data.lyrics || null,
      genre: data.genre,
      fileSize: data.fileSize,
      audioFormat: data.audioFormat,
      bitrate: parseInt(data.bitrate) || null,
      lowQualityUrl: data.lowQualityUrl || null,
      mediumQualityUrl: data.mediumQualityUrl || null,
      highQualityUrl: data.highQualityUrl || null,
      losslessQualityUrl: data.losslessQualityUrl || null,
      artistId: parseInt(data.artistId),
      albumId: data.albumId ? parseInt(data.albumId) : null,
      isPublic: data.isPublic,
      hasCopyright: data.hasCopyright,
    };

    createMutation.mutate(payload);
  };

  const genres = [
    'Pop',
    'Rock',
    'Hip Hop',
    'Jazz',
    'Classical',
    'Electronic',
    'R&B',
    'Country',
    'K-Pop',
    'Rap',
    'EDM',
    'Soul',
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/music')}
            className="mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Music List
          </Button>
          <h1 className="text-3xl font-bold text-admin-text-primary">Create New Song</h1>
          <p className="text-admin-text-secondary mt-1">
            Add a new song to your music library
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="text-spotify-green" size={24} />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the basic details of the song
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Title <span className="text-apple-red">*</span>
                  </label>
                  <Input
                    {...register('title', {
                      required: 'Title is required',
                      maxLength: {
                        value: 255,
                        message: 'Title must be less than 255 characters',
                      },
                    })}
                    placeholder="Enter song title"
                    error={errors.title?.message}
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Artist <span className="text-apple-red">*</span>
                  </label>
                  <Select
                    {...register('artistId', { required: 'Artist is required' })}
                    error={errors.artistId?.message}
                    disabled={loadingArtists}
                  >
                    <option value="">
                      {loadingArtists ? 'Loading artists...' : 'Select an artist'}
                    </option>
                    {artists.map((artist) => (
                      <option key={artist.artistId} value={artist.artistId}>
                        {artist.artistName || artist.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Album */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Album (Optional)
                  </label>
                  <Select
                    {...register('albumId')}
                    disabled={loadingAlbums}
                  >
                    <option value="">
                      {loadingAlbums ? 'Loading albums...' : 'Select an album (optional)'}
                    </option>
                    {albums.map((album) => (
                      <option key={album.albumId} value={album.albumId}>
                        {album.albumTitle || album.title}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Genre <span className="text-apple-red">*</span>
                  </label>
                  <Select
                    {...register('genre', { required: 'Genre is required' })}
                    error={errors.genre?.message}
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Release Date */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Release Date <span className="text-apple-red">*</span>
                  </label>
                  <Input
                    type="date"
                    {...register('releaseDate', { required: 'Release date is required' })}
                    error={errors.releaseDate?.message}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Duration <span className="text-apple-red">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="MM"
                        min="0"
                        max="59"
                        {...register('durationMinutes', {
                          required: 'Minutes required',
                          min: { value: 0, message: 'Min 0' },
                        })}
                        error={errors.durationMinutes?.message}
                      />
                      <p className="text-xs text-admin-text-tertiary mt-1">Minutes</p>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="SS"
                        min="0"
                        max="59"
                        {...register('durationSeconds', {
                          required: 'Seconds required',
                          min: { value: 0, message: 'Min 0' },
                          max: { value: 59, message: 'Max 59' },
                        })}
                        error={errors.durationSeconds?.message}
                      />
                      <p className="text-xs text-admin-text-tertiary mt-1">Seconds</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2: Audio Files */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="text-spotify-green" size={24} />
                  Audio Files
                </CardTitle>
                <CardDescription>
                  Upload audio file and configure quality URLs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Audio File */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Main Audio File <span className="text-apple-red">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-admin-border-default rounded-lg p-6 text-center hover:border-spotify-green transition-colors cursor-pointer bg-admin-bg-hover"
                    onClick={() => document.getElementById('audio-upload').click()}
                  >
                    <input
                      id="audio-upload"
                      type="file"
                      accept=".mp3,.wav,.flac,audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                    <Upload size={48} className="mx-auto text-admin-text-tertiary mb-4" />
                    {audioFile ? (
                      <div>
                        <p className="text-admin-text-primary font-medium">{audioFile.name}</p>
                        <p className="text-sm text-admin-text-tertiary mt-1">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-admin-text-primary font-medium">
                          Drop your audio file here
                        </p>
                        <p className="text-sm text-admin-text-tertiary mt-1">
                          or click to browse (MP3, WAV, FLAC - Max 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bitrate */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Bitrate (kbps)
                  </label>
                  <Input
                    type="number"
                    placeholder="320"
                    {...register('bitrate')}
                  />
                </div>

                {/* Quality URLs */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-admin-text-secondary">
                    Quality URLs (Auto-filled)
                  </p>
                  <Input
                    placeholder="Low Quality URL"
                    {...register('lowQualityUrl')}
                  />
                  <Input
                    placeholder="Medium Quality URL"
                    {...register('mediumQualityUrl')}
                  />
                  <Input
                    placeholder="High Quality URL"
                    {...register('highQualityUrl')}
                  />
                  <Input
                    placeholder="Lossless Quality URL"
                    {...register('losslessQualityUrl')}
                  />
                </div>

                {/* Streaming URL */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Streaming URL
                  </label>
                  <Input
                    placeholder="Auto-filled from audio file"
                    {...register('streamingUrl')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 3: Media & Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="text-spotify-green" size={24} />
                  Media & Content
                </CardTitle>
                <CardDescription>
                  Upload cover image and add lyrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Cover Image <span className="text-apple-red">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-admin-border-default rounded-lg p-6 text-center hover:border-spotify-green transition-colors cursor-pointer bg-admin-bg-hover"
                    onClick={() => document.getElementById('cover-upload').click()}
                  >
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    {coverPreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-48 h-48 object-cover rounded-lg mb-3"
                        />
                        <p className="text-admin-text-primary font-medium">{coverImage?.name}</p>
                        <p className="text-sm text-admin-text-tertiary mt-1">
                          {(coverImage?.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon size={48} className="mx-auto text-admin-text-tertiary mb-4" />
                        <p className="text-admin-text-primary font-medium">
                          Drop cover image here
                        </p>
                        <p className="text-sm text-admin-text-tertiary mt-1">
                          or click to browse (JPG, PNG, WebP - Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lyrics */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Lyrics (Optional)
                  </label>
                  <Textarea
                    rows={10}
                    placeholder="Enter song lyrics..."
                    {...register('lyrics')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 4: Publishing Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="text-spotify-green" size={24} />
                  Publishing Settings
                </CardTitle>
                <CardDescription>
                  Configure visibility and copyright settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Is Public */}
                <div className="flex items-center gap-3 p-4 bg-admin-bg-hover rounded-lg">
                  <input
                    type="checkbox"
                    id="isPublic"
                    {...register('isPublic')}
                    className="w-5 h-5 rounded border-admin-border-default text-spotify-green focus:ring-2 focus:ring-spotify-green cursor-pointer"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="isPublic"
                      className="text-sm font-medium text-admin-text-primary cursor-pointer"
                    >
                      Make this song public
                    </label>
                    <p className="text-xs text-admin-text-tertiary mt-0.5">
                      Public songs can be discovered and played by all users
                    </p>
                  </div>
                </div>

                {/* Has Copyright */}
                <div className="flex items-center gap-3 p-4 bg-admin-bg-hover rounded-lg">
                  <input
                    type="checkbox"
                    id="hasCopyright"
                    {...register('hasCopyright')}
                    className="w-5 h-5 rounded border-admin-border-default text-spotify-green focus:ring-2 focus:ring-spotify-green cursor-pointer"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="hasCopyright"
                      className="text-sm font-medium text-admin-text-primary cursor-pointer"
                    >
                      This song has copyright protection
                    </label>
                    <p className="text-xs text-admin-text-tertiary mt-0.5">
                      Enable copyright protection for this track
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex justify-end gap-4 mt-8"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/music')}
            disabled={createMutation.isPending}
          >
            <X size={18} className="mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Create Song
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default CreateSong;

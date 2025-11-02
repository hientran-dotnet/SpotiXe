import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
  Search,
  Check,
  ChevronDown,
  Link as LinkIcon,
  AlertCircle,
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
  
  // Autocomplete states
  const [artistSearch, setArtistSearch] = useState('');
  const [albumSearch, setAlbumSearch] = useState('');
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);
  const [showAlbumDropdown, setShowAlbumDropdown] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const artistInputRef = useRef(null);
  const albumInputRef = useRef(null);
  const artistDropdownRef = useRef(null);
  const albumDropdownRef = useRef(null);

  // Audio URL state
  const [audioUrl, setAudioUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  
  // Cover Image URL state
  const [coverUrl, setCoverUrl] = useState('');
  const [isValidCoverUrl, setIsValidCoverUrl] = useState(false);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        artistDropdownRef.current &&
        !artistDropdownRef.current.contains(event.target) &&
        !artistInputRef.current?.contains(event.target)
      ) {
        setShowArtistDropdown(false);
      }
      if (
        albumDropdownRef.current &&
        !albumDropdownRef.current.contains(event.target) &&
        !albumInputRef.current?.contains(event.target)
      ) {
        setShowAlbumDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter artists based on search
  const filteredArtists = React.useMemo(() => {
    if (!artistSearch.trim()) return artists;
    
    const searchLower = artistSearch.toLowerCase();
    const startsWith = [];
    const contains = [];
    
    artists.forEach((artist) => {
      const name = (artist.artistName || artist.name || '').toLowerCase();
      if (name.startsWith(searchLower)) {
        startsWith.push(artist);
      } else if (name.includes(searchLower)) {
        contains.push(artist);
      }
    });
    
    return [...startsWith, ...contains];
  }, [artists, artistSearch]);

  // Filter albums based on search
  const filteredAlbums = React.useMemo(() => {
    if (!albumSearch.trim()) return albums;
    
    const searchLower = albumSearch.toLowerCase();
    const startsWith = [];
    const contains = [];
    
    albums.forEach((album) => {
      const title = (album.albumTitle || album.title || '').toLowerCase();
      if (title.startsWith(searchLower)) {
        startsWith.push(album);
      } else if (title.includes(searchLower)) {
        contains.push(album);
      }
    });
    
    return [...startsWith, ...contains];
  }, [albums, albumSearch]);

  // Highlight matched text
  const highlightMatch = (text, search) => {
    if (!search.trim()) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-spotify-green/30 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Handle artist selection
  const handleArtistSelect = (artist) => {
    setSelectedArtist(artist);
    setArtistSearch(artist.artistName || artist.name);
    setValue('artistId', artist.artistId.toString());
    setShowArtistDropdown(false);
  };

  // Handle album selection
  const handleAlbumSelect = (album) => {
    setSelectedAlbum(album);
    setAlbumSearch(album.albumTitle || album.title);
    setValue('albumId', album.albumId.toString());
    setShowAlbumDropdown(false);
  };

  // Validate URL
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle audio URL change
  const handleAudioUrlChange = (e) => {
    const url = e.target.value;
    setAudioUrl(url);
    
    const isValid = validateUrl(url);
    setIsValidUrl(isValid);
    
    if (isValid) {
      setValue('audioFileUrl', url);
      setValue('streamingUrl', `${url}?quality=adaptive`);
      setValue('lowQualityUrl', `${url}?quality=low`);
      setValue('mediumQualityUrl', `${url}?quality=medium`);
      setValue('highQualityUrl', `${url}?quality=high`);
      setValue('losslessQualityUrl', `${url}?quality=lossless`);
      
      // Extract format from URL
      const urlParts = url.split('.');
      const format = urlParts[urlParts.length - 1].split('?')[0].toLowerCase();
      setValue('audioFormat', format);
    }
  };

  // Handle cover image URL change
  const handleCoverUrlChange = (e) => {
    const url = e.target.value;
    setCoverUrl(url);
    
    const isValid = validateUrl(url);
    setIsValidCoverUrl(isValid);
    
    if (isValid) {
      setValue('coverImageUrl', url);
    }
  };

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
    // Validate artist selection
    if (!selectedArtist) {
      toast.error('Please select an artist');
      return;
    }
    
    // Validate audio URL
    if (!audioUrl || !isValidUrl) {
      toast.error('Please enter a valid audio file URL');
      return;
    }
    
    // Validate cover image URL
    if (!coverUrl || !isValidCoverUrl) {
      toast.error('Please enter a valid cover image URL');
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
      fileSize: data.fileSize || 0,
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
                {/* <CardDescription>
                  Enter the basic details of the song
                </CardDescription> */}
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
                  <div className="relative" ref={artistInputRef}>
                    <div className="relative">
                      <Search 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary" 
                        size={18} 
                      />
                      <Input
                        value={artistSearch}
                        onChange={(e) => {
                          setArtistSearch(e.target.value);
                          setShowArtistDropdown(true);
                          setSelectedArtist(null);
                          setValue('artistId', '');
                        }}
                        onFocus={() => setShowArtistDropdown(true)}
                        placeholder={loadingArtists ? 'Loading artists...' : 'Search for an artist...'}
                        disabled={loadingArtists}
                      />
                      {selectedArtist && (
                        <Check 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-green" 
                          size={18} 
                        />
                      )}
                      {!selectedArtist && artistSearch && (
                        <ChevronDown 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary" 
                          size={18} 
                        />
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {showArtistDropdown && !loadingArtists && (
                        <motion.div
                          ref={artistDropdownRef}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full mt-2 bg-admin-bg-card border border-admin-border-default rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          {filteredArtists.length > 0 ? (
                            <div className="py-1">
                              {filteredArtists.map((artist) => (
                                <div
                                  key={artist.artistId}
                                  onClick={() => handleArtistSelect(artist)}
                                  className="px-4 py-2.5 hover:bg-admin-bg-hover cursor-pointer transition-colors flex items-center gap-2"
                                >
                                  <Users size={16} className="text-admin-text-tertiary flex-shrink-0" />
                                  <span className="text-sm text-admin-text-primary">
                                    {highlightMatch(artist.artistName || artist.name, artistSearch)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-8 text-center text-admin-text-tertiary text-sm">
                              No artists found
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {errors.artistId && (
                      <p className="text-apple-red text-sm mt-1">{errors.artistId.message}</p>
                    )}
                  </div>
                </div>

                {/* Album */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Album (Optional)
                  </label>
                  <div className="relative" ref={albumInputRef}>
                    <div className="relative">
                      <Search 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary" 
                        size={18} 
                      />
                      <Input
                        value={albumSearch}
                        onChange={(e) => {
                          setAlbumSearch(e.target.value);
                          setShowAlbumDropdown(true);
                          if (!e.target.value) {
                            setSelectedAlbum(null);
                            setValue('albumId', '');
                          }
                        }}
                        onFocus={() => setShowAlbumDropdown(true)}
                        placeholder={loadingAlbums ? 'Loading albums...' : 'Search for an album...'}
                        disabled={loadingAlbums}
                      />
                      {selectedAlbum && (
                        <Check 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-green" 
                          size={18} 
                        />
                      )}
                      {!selectedAlbum && albumSearch && (
                        <ChevronDown 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary" 
                          size={18} 
                        />
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {showAlbumDropdown && !loadingAlbums && (
                        <motion.div
                          ref={albumDropdownRef}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full mt-2 bg-admin-bg-card border border-admin-border-default rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          {filteredAlbums.length > 0 ? (
                            <div className="py-1">
                              {filteredAlbums.map((album) => (
                                <div
                                  key={album.albumId}
                                  onClick={() => handleAlbumSelect(album)}
                                  className="px-4 py-2.5 hover:bg-admin-bg-hover cursor-pointer transition-colors flex items-center gap-2"
                                >
                                  <Disc size={16} className="text-admin-text-tertiary flex-shrink-0" />
                                  <span className="text-sm text-admin-text-primary">
                                    {highlightMatch(album.albumTitle || album.title, albumSearch)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-8 text-center text-admin-text-tertiary text-sm">
                              No albums found
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                {/* <CardDescription>
                  Upload audio file and configure quality URLs
                </CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Audio URL */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Audio File URL <span className="text-apple-red">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary" 
                      size={18} 
                    />
                    <Input
                      value={audioUrl}
                      onChange={handleAudioUrlChange}
                      placeholder="https://audio.spotixe.io.vn/songs/your-song.mp3"
                      // className="pl-10 pr-10"
                    />
                    {audioUrl && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValidUrl ? (
                          <Check className="text-spotify-green" size={18} />
                        ) : (
                          <AlertCircle className="text-apple-red" size={18} />
                        )}
                      </div>
                    )}
                  </div>
                  {audioUrl && !isValidUrl && (
                    <p className="text-apple-red text-sm mt-1">Please enter a valid URL</p>
                  )}
                  {audioUrl && isValidUrl && (
                    <p className="text-spotify-green text-sm mt-1 flex items-center gap-1">
                      <Check size={14} />
                      Valid URL - Quality URLs auto-filled
                    </p>
                  )}
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
                {/* <CardDescription>
                  Upload cover image and add lyrics
                </CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-secondary mb-2">
                    Cover Image URL <span className="text-apple-red">*</span>
                  </label>
                  <div className="relative">
                    <ImageIcon 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary pointer-events-none" 
                      size={18} 
                    />
                    <Input
                      value={coverUrl}
                      onChange={handleCoverUrlChange}
                      placeholder="https://image.spotixe.io.vn/covers/your-cover.jpg"
                      // className="pl-10"
                    />
                    {coverUrl && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isValidCoverUrl ? (
                          <Check className="text-spotify-green" size={18} />
                        ) : (
                          <AlertCircle className="text-apple-red" size={18} />
                        )}
                      </div>
                    )}
                  </div>
                  {coverUrl && !isValidCoverUrl && (
                    <p className="text-apple-red text-sm mt-1">Please enter a valid URL</p>
                  )}
                  {coverUrl && isValidCoverUrl && (
                    <div className="mt-3">
                      <p className="text-spotify-green text-sm mb-2 flex items-center gap-1">
                        <Check size={14} />
                        Valid URL - Preview:
                      </p>
                      <img
                        src={coverUrl}
                        alt="Cover preview"
                        className="w-48 h-48 object-cover rounded-lg border-2 border-spotify-green/30"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
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
                {/* <CardDescription>
                  Configure visibility and copyright settings
                </CardDescription> */}
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

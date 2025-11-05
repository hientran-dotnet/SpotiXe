import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Upload,
  Calendar,
  Music,
  Image as ImageIcon,
  Check,
  X,
  Trash2,
  Save,
  ArrowLeft,
  Play,
  Pause,
} from 'lucide-react'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import Input, { Select } from '@components/common/Input'
import { formatDuration } from '@utils/helpers'

export default function SongForm({ mode = 'add' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [coverPreview, setCoverPreview] = useState(null)
  const [audioPreview, setAudioPreview] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ image: 0, audio: 0 })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      duration: '',
      releaseDate: '',
      genre: '',
      artistId: '',
      albumId: '',
      isActive: true,
      coverImageUrl: '',
      audioFileUrl: '',
    },
  })

  const watchedValues = watch()

  // Mock data
  const genres = [
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'hip-hop', label: 'Hip Hop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'classical', label: 'Classical' },
    { value: 'r&b', label: 'R&B' },
    { value: 'country', label: 'Quê' },
  ]

  const artists = [
    { value: '1', label: 'Taylor Swift' },
    { value: '2', label: 'The Weeknd' },
    { value: '3', label: 'Drake' },
    { value: '4', label: 'Billie Eilish' },
  ]

  const albums = [
    { value: '1', label: 'Midnights' },
    { value: '2', label: 'After Hours' },
    { value: '3', label: 'Certified Lover Boy' },
  ]

  useEffect(() => {
    // Load song data if in edit mode
    if (mode === 'edit' && id) {
      setIsLoading(true)
      // Mock API call
      setTimeout(() => {
        setValue('title', 'Anti-Hero')
        setValue('duration', '200')
        setValue('releaseDate', '2023-10-21')
        setValue('genre', 'pop')
        setValue('artistId', '1')
        setValue('albumId', '1')
        setValue('isActive', true)
        setCoverPreview('https://picsum.photos/300/300')
        setIsLoading(false)
      }, 1000)
    }
  }, [mode, id, setValue])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(prev => ({ ...prev, image: progress }))
        if (progress >= 100) {
          clearInterval(interval)
          const reader = new FileReader()
          reader.onloadend = () => {
            setCoverPreview(reader.result)
            setValue('coverImageUrl', reader.result)
          }
          reader.readAsDataURL(file)
        }
      }, 100)
    }
  }

  const handleAudioUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        setUploadProgress(prev => ({ ...prev, audio: progress }))
        if (progress >= 100) {
          clearInterval(interval)
          const url = URL.createObjectURL(file)
          setAudioPreview(url)
          setValue('audioFileUrl', url)
          // Get audio duration
          const audio = new Audio(url)
          audio.onloadedmetadata = () => {
            setValue('duration', Math.floor(audio.duration).toString())
          }
        }
      }, 150)
    }
  }

  const onSubmit = (data) => {
    setIsLoading(true)
    console.log('Form data:', data)
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success(mode === 'add' ? 'Song added successfully!' : 'Song updated successfully!')
      navigate('/songs')
    }, 1500)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      toast.success('Song deleted successfully!')
      navigate('/songs')
    }
  }

  if (isLoading && mode === 'edit') {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-bg-secondary rounded animate-pulse w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-8 space-y-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-16 bg-bg-secondary rounded animate-pulse" />
            ))}
          </Card>
          <Card className="p-8 space-y-6">
            <div className="h-64 bg-bg-secondary rounded animate-pulse" />
            <div className="h-32 bg-bg-secondary rounded animate-pulse" />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary">
            <button
            onClick={() => navigate('/songs')}
            className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
            >
            <ArrowLeft className="w-5 h-5" />
            </button>
            <button
            onClick={() => navigate('/songs')}
            className="hover:text-text-primary"
            >
            Quản lý bài hát
            </button>
            <span>/</span>
            <span className="text-text-primary">
            {mode === 'add'
                ? 'Thêm bài hát mới'
                : mode === 'edit'
                ? 'Chỉnh sửa bài hát'
                : 'Chi tiết bài hát'}
            </span>
        </nav>

        {/* Action Buttons */}
        {mode === 'view' && (
            <div className="flex gap-3">
            <Button
                variant="secondary"
                icon={Trash2}
                onClick={handleDelete}
            >
                Xóa
            </Button>
            <Button
                icon={Save}
                onClick={() => navigate(`/songs/${id}/edit`)}
            >
                Chỉnh sửa
            </Button>
            </div>
        )}
        </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Main Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Song Information
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Enter song title"
                    error={errors.title?.message}
                    disabled={mode === 'view'}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    {...register('duration', { 
                      required: 'Duration is required',
                      min: { value: 1, message: 'Duration must be at least 1 second' }
                    })}
                    placeholder="Duration in seconds"
                    error={errors.duration?.message}
                    disabled={mode === 'view'}
                  />
                  {watchedValues.duration && (
                    <p className="text-xs text-text-tertiary mt-1">
                      Preview: {formatDuration(parseInt(watchedValues.duration))}
                    </p>
                  )}
                </div>

                {/* Release Date */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Release Date
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      {...register('releaseDate')}
                      error={errors.releaseDate?.message}
                      disabled={mode === 'view'}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Genre <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('genre', { required: 'Genre is required' })}
                    options={[{ value: '', label: 'Select genre' }, ...genres]}
                    error={errors.genre?.message}
                    disabled={mode === 'view'}
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Artist <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register('artistId', { required: 'Artist is required' })}
                    options={[{ value: '', label: 'Select artist' }, ...artists]}
                    error={errors.artistId?.message}
                    disabled={mode === 'view'}
                  />
                </div>

                {/* Album */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Album <span className="text-text-tertiary">(Optional)</span>
                  </label>
                  <Select
                    {...register('albumId')}
                    options={[{ value: '', label: 'Select album' }, ...albums]}
                    disabled={mode === 'view'}
                  />
                </div>

                {/* Is Active Toggle */}
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-text-primary">
                        Publish Song
                      </span>
                      <p className="text-xs text-text-tertiary mt-1">
                        Make this song visible to users
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        {...register('isActive')}
                        className="sr-only peer"
                        disabled={mode === 'view'}
                      />
                      <div className="w-11 h-6 bg-bg-tertiary rounded-full peer peer-checked:bg-spotify-green transition-colors peer-disabled:opacity-50"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Media Files */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Cover Image Upload */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Cover Image <span className="text-red-500">*</span>
              </h2>

              {coverPreview ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    {mode !== 'view' && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <label className="cursor-pointer">
                          <div className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                            Change Image
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {uploadProgress.image > 0 && uploadProgress.image < 100 && (
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div
                        className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.image}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-spotify-green transition-colors">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-text-tertiary" />
                      <p className="text-text-primary font-medium mb-2">
                        Drop image here or click to browse
                      </p>
                      <p className="text-sm text-text-tertiary">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={mode === 'view'}
                    />
                  </label>
                  {errors.coverImageUrl && (
                    <p className="text-red-500 text-sm mt-2">{errors.coverImageUrl.message}</p>
                  )}
                </div>
              )}
            </Card>

            {/* Audio File Upload */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Audio File <span className="text-red-500">*</span>
              </h2>

              {audioPreview ? (
                <div className="space-y-4">
                  <div className="bg-bg-secondary rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center hover:bg-spotify-green-dark transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium">Audio Preview</p>
                        <p className="text-text-tertiary text-sm">Ready to upload</p>
                      </div>
                      <Music className="w-8 h-8 text-spotify-green" />
                    </div>
                    <div className="w-full bg-bg-tertiary rounded-full h-1">
                      <div className="bg-spotify-green h-1 rounded-full w-0" />
                    </div>
                  </div>
                  {mode !== 'view' && (
                    <label className="block">
                      <Button
                        type="button"
                        variant="secondary"
                        icon={Upload}
                        className="w-full"
                        as="div"
                      >
                        Change Audio File
                      </Button>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                    </label>
                  )}
                  {uploadProgress.audio > 0 && uploadProgress.audio < 100 && (
                    <div className="w-full bg-bg-tertiary rounded-full h-2">
                      <div
                        className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.audio}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-spotify-green transition-colors">
                      <Music className="w-12 h-12 mx-auto mb-4 text-text-tertiary" />
                      <p className="text-text-primary font-medium mb-2">
                        Drop audio file here or click to browse
                      </p>
                      <p className="text-sm text-text-tertiary">
                        MP3, WAV, FLAC up to 50MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioUpload}
                      disabled={mode === 'view'}
                    />
                  </label>
                  {errors.audioFileUrl && (
                    <p className="text-red-500 text-sm mt-2">{errors.audioFileUrl.message}</p>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6"
        >
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Song Preview
            </h2>
            <div className="flex items-center gap-6 p-6 bg-bg-secondary rounded-lg">
              <div className="w-24 h-24 rounded-lg bg-bg-tertiary flex items-center justify-center overflow-hidden flex-shrink-0">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-10 h-10 text-text-tertiary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-text-primary truncate">
                  {watchedValues.title || 'Song Title'}
                </h3>
                <p className="text-text-secondary">
                  {artists.find(a => a.value === watchedValues.artistId)?.label || 'Artist Name'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-text-tertiary">
                  {watchedValues.genre && (
                    <span className="px-2 py-1 bg-bg-tertiary rounded">
                      {genres.find(g => g.value === watchedValues.genre)?.label}
                    </span>
                  )}
                  {watchedValues.duration && (
                    <span>{formatDuration(parseInt(watchedValues.duration))}</span>
                  )}
                  {watchedValues.isActive && (
                    <span className="flex items-center gap-1 text-spotify-green">
                      <Check className="w-4 h-4" /> Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        {mode !== 'view' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center justify-between mt-6"
          >
            <div>
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="danger"
                  icon={Trash2}
                  onClick={handleDelete}
                >
                  Delete Song
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                icon={X}
                onClick={() => navigate('/music')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={Save}
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Saving...' 
                  : mode === 'add' 
                  ? 'Save Song' 
                  : 'Update Song'
                }
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  )
}

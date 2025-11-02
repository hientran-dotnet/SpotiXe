import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Image as ImageIcon,
  Save,
  X,
  ArrowLeft,
  Globe,
  Calendar,
  FileText,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createArtist } from '@/services/api/artists';

const CreateArtist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [isValidProfileUrl, setIsValidProfileUrl] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      bio: '',
      profileImageUrl: '',
      country: '',
      debutYear: new Date().getFullYear(),
      isActive: true,
    },
  });

  // Watch profileImageUrl for preview
  const watchProfileUrl = watch('profileImageUrl');

  // Validate URL helper
  const validateUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle profile image URL change
  const handleProfileUrlChange = (e) => {
    const url = e.target.value;
    setProfileUrl(url);
    setValue('profileImageUrl', url);
    
    const valid = validateUrl(url);
    setIsValidProfileUrl(valid);
    
    if (valid) {
      setProfilePreview(url);
    } else {
      setProfilePreview(null);
    }
  };

  // Create artist mutation
  const createMutation = useMutation({
    mutationFn: (artistData) => createArtist(artistData),
    onSuccess: () => {
      queryClient.invalidateQueries(['artists']);
      toast.success('Artist created successfully!');
      navigate('/artists');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to create artist');
    },
  });

  const onSubmit = (data) => {
    // Prepare payload
    const payload = {
      name: data.name,
      bio: data.bio || '',
      profileImageUrl: data.profileImageUrl || '',
      country: data.country || '',
      debutYear: parseInt(data.debutYear) || new Date().getFullYear(),
      totalFollowers: 0, // Default to 0 for new artist
      isActive: data.isActive,
    };

    createMutation.mutate(payload);
  };

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
        <h1 className="text-3xl font-bold text-admin-text-primary">Create New Artist</h1>
        <p className="text-admin-text-tertiary mt-2">Add a new artist to the platform</p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-spotify-green/20 flex items-center justify-center">
                  <User size={20} className="text-spotify-green" />
                </div>
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Artist's primary details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-admin-text-primary mb-2">
                  Artist Name <span className="text-apple-red">*</span>
                </label>
                <Input
                  {...register('name', { required: 'Artist name is required' })}
                  placeholder="Enter artist name"
                  error={errors.name?.message}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-admin-text-primary mb-2">
                  Biography
                </label>
                <Textarea
                  {...register('bio')}
                  placeholder="Tell us about the artist..."
                  rows={4}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-admin-text-primary mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary pointer-events-none" />
                  <Input
                    {...register('country')}
                    placeholder="e.g., United States, South Korea"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Debut Year */}
              <div>
                <label className="block text-sm font-medium text-admin-text-primary mb-2">
                  Debut Year
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary pointer-events-none" />
                  <Input
                    type="number"
                    {...register('debutYear', { 
                      min: { value: 1900, message: 'Year must be after 1900' },
                      max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
                    })}
                    placeholder="e.g., 2020"
                    className="pl-10"
                    error={errors.debutYear?.message}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <ImageIcon size={20} className="text-blue-500" />
                </div>
                <div>
                  <CardTitle>Profile Image</CardTitle>
                  <CardDescription>Artist's profile photo (URL)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image URL */}
              <div>
                <label className="block text-sm font-medium text-admin-text-primary mb-2">
                  Profile Image URL
                </label>
                <Input
                  value={profileUrl}
                  onChange={handleProfileUrlChange}
                  placeholder="https://example.com/profile.jpg"
                  error={profileUrl && !isValidProfileUrl ? 'Invalid URL format' : ''}
                />
                {profileUrl && isValidProfileUrl && (
                  <p className="text-sm text-spotify-green mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    Valid URL
                  </p>
                )}
              </div>

              {/* Image Preview */}
              {profilePreview && (
                <div>
                  <label className="block text-sm font-medium text-admin-text-primary mb-2">
                    Preview
                  </label>
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-admin-bg-hover">
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setProfilePreview(null);
                        setIsValidProfileUrl(false);
                        toast.error('Failed to load image from URL');
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Settings size={20} className="text-purple-500" />
                </div>
                <div>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Artist visibility and status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  id="isActive"
                  className="w-4 h-4 rounded border-admin-border-default text-spotify-green focus:ring-spotify-green"
                />
                <label htmlFor="isActive" className="text-sm text-admin-text-secondary cursor-pointer">
                  Artist is active (visible to users)
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex items-center gap-4 justify-end"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/artists')}
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
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Create Artist
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default CreateArtist;

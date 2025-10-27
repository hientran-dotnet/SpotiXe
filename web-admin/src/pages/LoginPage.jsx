import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    const result = await signInWithGoogle();

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background gradient - pure black theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
      
      {/* Minimal background element - single subtle orb */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spotify-green/5 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Clean Card - Match Dashboard Card Style */}
        <div className="relative bg-admin-bg-card border border-admin-border-default rounded-2xl shadow-card overflow-hidden">
          {/* Card Content */}
          <div className="relative p-8 md:p-10">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="flex items-center gap-3">
                <img 
                  src="/spotixe-logo.png" 
                  alt="SpotiXe Logo" 
                  className="w-16 h-16 rounded-xl"
                />
                <span className="text-3xl font-bold text-admin-text-primary">
                  SpotiXe
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-extrabold text-admin-text-primary mb-3 tracking-tight">
                Sign in to SpotiXe Admin
              </h1>
              <p className="text-admin-text-secondary text-base font-medium">
                Manage your music streaming platform
              </p>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onClick={handleSignIn}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-spotify-green hover:brightness-110 disabled:brightness-100 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-lg">Signing in...</span>
                </>
              ) : (
                <>
                  {/* Google Icon (4 colors) */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-lg">Sign In with Google</span>
                </>
              )}
            </motion.button>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400"
                >
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-[13px] text-admin-text-secondary">
                <Shield size={15} className="text-spotify-green flex-shrink-0" />
                <p className="font-medium">Only authorized domain accounts can sign in.</p>
              </div>
              <p className="text-[13px] text-admin-text-tertiary mt-3 font-medium">
                Protected by enterprise-grade security
              </p>
            </motion.div>
          </div>

          {/* Simple bottom accent line */}
          <div className="h-1 bg-spotify-green" />
        </div>

        {/* Additional info below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-6 text-center text-[13px] text-admin-text-tertiary"
        >
          <p className="font-medium">© 2025 SpotiXe. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="#" className="hover:text-spotify-green transition-colors duration-200 font-medium">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-spotify-green transition-colors duration-200 font-medium">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-spotify-green transition-colors duration-200 font-medium">Support</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No authentication logic - UI only
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-spotify-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-apple-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        {/* Floating Music Notes */}
        <div className="absolute top-20 left-1/4 text-spotify-green/20 animate-float">
          <Music size={32} />
        </div>
        <div className="absolute bottom-40 right-1/3 text-spotify-green/20 animate-float-delayed">
          <Music size={24} />
        </div>
        <div className="absolute top-1/2 left-1/4 text-apple-blue/20 animate-float">
          <Music size={28} />
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 p-8 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-spotify-green/5 via-transparent to-apple-blue/5 rounded-2xl"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-spotify-green/20 to-apple-blue/20 rounded-2xl blur-xl opacity-30"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo Section */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-spotify-green to-apple-blue rounded-xl flex items-center justify-center shadow-lg shadow-spotify-green/30">
                  <Music size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-spotify-green to-apple-blue bg-clip-text text-transparent">
                  SpotiXe
                </h1>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Sign in to Admin
              </h2>
              <p className="text-sm text-gray-400 text-center">
                Manage your music streaming platform
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-spotify-green transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@spotixe.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green/50 focus:border-spotify-green/50 transition-all duration-200 hover:bg-white/10"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-spotify-green transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green/50 focus:border-spotify-green/50 transition-all duration-200 hover:bg-white/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-spotify-green transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-spotify-green focus:ring-spotify-green/50 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-spotify-green hover:text-spotify-green/80 transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-spotify-green to-green-500 text-white font-semibold rounded-xl shadow-lg shadow-spotify-green/30 hover:shadow-spotify-green/50 transition-all duration-300 hover:from-spotify-green/90 hover:to-green-500/90 flex items-center justify-center gap-2"
              >
                Sign In
                <ShieldCheck size={18} />
              </motion.button>
            </motion.form>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-spotify-green mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Only authorized domain accounts can sign in. Your credentials are encrypted and secured.
                </p>
              </div>
            </motion.div>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Need access?{' '}
                <a
                  href="#"
                  className="text-spotify-green hover:text-spotify-green/80 transition-colors font-medium"
                >
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Version Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            SpotiXe Admin Dashboard v1.0.0
          </p>
        </div>
      </motion.div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

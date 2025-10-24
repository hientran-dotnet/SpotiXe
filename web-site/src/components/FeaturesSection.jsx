import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Download, Headphones, SkipForward, Music, Wifi, Shield, Crown } from 'lucide-react';

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Volume2,
      title: 'Ad-Free Listening',
      description: 'Enjoy uninterrupted music without any advertisements. Pure listening pleasure, nothing else.',
      color: 'from-spotify-green to-emerald-400',
      delay: 0.1,
    },
    {
      icon: Download,
      title: 'Offline Downloads',
      description: 'Download your favorite tracks and playlists. Listen anywhere, even without internet connection.',
      color: 'from-accent-blue to-cyan-400',
      delay: 0.2,
    },
    {
      icon: Headphones,
      title: 'High Quality Audio',
      description: 'Experience crystal-clear sound with up to 320kbps audio quality. Hear every detail.',
      color: 'from-accent-purple to-pink-400',
      delay: 0.3,
    },
    {
      icon: SkipForward,
      title: 'Unlimited Skips',
      description: 'Skip as many songs as you want. You\'re in complete control of your listening experience.',
      color: 'from-pink-500 to-rose-400',
      delay: 0.4,
    },
    {
      icon: Music,
      title: 'Millions of Songs',
      description: 'Access to over 100 million songs across all genres. Discover something new every day.',
      color: 'from-orange-500 to-amber-400',
      delay: 0.5,
    },
    {
      icon: Wifi,
      title: 'Cross-Device Sync',
      description: 'Seamlessly switch between devices. Your music follows you everywhere you go.',
      color: 'from-teal-500 to-green-400',
      delay: 0.6,
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We respect your privacy and protect your information.',
      color: 'from-indigo-500 to-blue-400',
      delay: 0.7,
    },
    {
      icon: Crown,
      title: 'Exclusive Content',
      description: 'Get early access to new releases, exclusive podcasts, and artist collaborations.',
      color: 'from-yellow-500 to-amber-400',
      delay: 0.8,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-20 lg:py-32 bg-spotify-dark overflow-hidden"
      aria-label="Premium Features"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-spotify-green/10 to-accent-purple/10 backdrop-blur-sm border border-white/10 rounded-full mb-6"
          >
            <Crown className="w-4 h-4 text-spotify-green" />
            <span className="text-sm font-medium text-white">Premium Benefits</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
            Enhance Your Music Journey{' '}
            <br className="hidden sm:block" />
            with{' '}
            <span className="bg-gradient-to-r from-spotify-green via-accent-blue to-accent-purple bg-clip-text text-transparent">
              Premium
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-spotify-gray max-w-3xl mx-auto">
            Unlock the full potential of SpotiXe with features designed to elevate your listening experience to new heights.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 lg:mt-20"
        >
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(29, 185, 84, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-8 lg:px-10 py-4 bg-gradient-to-r from-spotify-green to-spotify-darkgreen text-spotify-black font-bold rounded-full hover:shadow-glow-green transition-all duration-300"
          >
            <span>Explore Premium Plans</span>
            <SkipForward className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, isVisible, index }) => {
  const Icon = feature.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: feature.delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative h-full p-6 lg:p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
      >
        {/* Background Gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 bg-gradient-to-br ${feature.color}`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon Container */}
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg`}>
              <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
          </motion.div>

          {/* Text Content */}
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-spotify-gray group-hover:bg-clip-text transition-all duration-300">
            {feature.title}
          </h3>
          <p className="text-spotify-gray group-hover:text-white/80 transition-colors duration-300 leading-relaxed">
            {feature.description}
          </p>

          {/* Hover Indicator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : 0 }}
            transition={{ duration: 0.3 }}
            className={`h-1 bg-gradient-to-r ${feature.color} rounded-full mt-4`}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-300" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-300" />
      </motion.div>
    </motion.div>
  );
};

export default FeaturesSection;

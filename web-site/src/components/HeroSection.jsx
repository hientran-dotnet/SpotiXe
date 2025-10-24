import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Download, Sparkles, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

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

  const handleScrollDown = () => {
    const nextSection = sectionRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-20 lg:pt-24 lg:pb-0"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #0a3a2a 50%, #0f0a1a 100%)'
      }}
      aria-label="Hero Section"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Green orb - top left */}
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(29, 185, 84, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Purple orb - bottom right */}
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Blue orb - center top */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          ref={containerRef}
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* LEFT COLUMN - Content */}
          <motion.div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-4 py-2 mb-6 lg:mb-8 rounded-full border"
              style={{
                background: 'rgba(29, 185, 84, 0.1)',
                borderColor: 'rgba(29, 185, 84, 0.3)',
              }}
            >
              <Sparkles className="w-4 h-4 text-spotify-green flex-shrink-0" />
              <span className="text-sm font-medium text-white whitespace-nowrap">✨ Now Available Worldwide</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
            >
              Discover a World of{' '}
              <span className="bg-gradient-to-r from-spotify-green via-accent-green to-accent-blue bg-clip-text text-transparent animate-pulse">
                Music
              </span>
              {' '}with SpotiXe
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-spotify-gray mb-8 lg:mb-10 max-w-2xl leading-relaxed"
            >
              Stream millions of songs, discover new artists, and enjoy unlimited music with crystal-clear sound quality. Your soundtrack to life starts here.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start mb-12 lg:mb-16"
            >
              {/* Primary Button */}
              <motion.a
                href="#download"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 40px rgba(29, 185, 84, 0.6), 0 0 80px rgba(29, 185, 84, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 text-white font-bold rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                }}
              >
                <Download className="w-5 h-5" />
                <span>Download Now</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 pointer-events-none" />
              </motion.a>

              {/* Secondary Button */}
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 text-white font-semibold rounded-full flex items-center justify-center space-x-2 w-full sm:w-auto transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Play className="w-5 h-5 group-hover:text-spotify-green transition-colors duration-300" />
                <span>Watch Demo</span>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 sm:gap-10 w-full lg:w-auto"
            >
              {[
                { value: '100M+', label: 'Songs' },
                { value: '500K+', label: 'Artists' },
                { value: '50M+', label: 'Users' },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-spotify-gray font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Phone Mockup */}
          <motion.div
            variants={itemVariants}
            className="relative flex justify-center lg:justify-end items-center min-h-96 lg:min-h-full"
            style={{ y: opacity }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -25, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Phone Container */}
              <div className="relative mx-auto w-72 sm:w-80 lg:w-96">
                {/* Glow Background */}
                <motion.div
                  className="absolute inset-0 rounded-[2.5rem] blur-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.4) 0%, rgba(167, 139, 250, 0.3) 100%)',
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* 3D Tilted Phone */}
                <motion.div
                  className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 60px rgba(29, 185, 84, 0.2)',
                  }}
                  animate={{
                    rotateX: [5, 8, 5],
                    rotateY: [-15, -12, -15],
                    rotateZ: [0, 2, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Phone Bezel */}
                  <div className="p-3 bg-gradient-to-br from-slate-900 to-black">
                    <div className="rounded-[2rem] overflow-hidden bg-black">
                      {/* Status Bar / Notch */}
                      <div className="relative h-7 bg-black flex items-center justify-center px-6">
                        <div className="absolute inset-0 flex items-center justify-between px-6 text-xs text-white/80 font-semibold">
                          <span>9:41</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-white/80 rounded-full" />
                            <div className="w-1 h-1 bg-white/80 rounded-full" />
                            <div className="w-1 h-1 bg-white/80 rounded-full" />
                          </div>
                        </div>
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl border-l border-r border-b border-slate-900" />
                      </div>

                      {/* Screen Content */}
                      <div className="bg-gradient-to-b from-slate-900 to-black p-4 space-y-3 min-h-96">
                        {/* Now Playing Card */}
                        <motion.div
                          className="rounded-2xl p-4 overflow-hidden backdrop-blur-sm"
                          style={{
                            background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                            border: '1px solid rgba(29, 185, 84, 0.2)',
                          }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="aspect-square bg-gradient-to-br from-spotify-green to-accent-blue rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-spotify-green to-accent-blue"
                            >
                              <Play className="w-12 h-12 text-white" />
                            </motion.div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-white/30 rounded-full w-4/5" />
                            <div className="h-2 bg-white/20 rounded-full w-3/5" />
                          </div>
                        </motion.div>

                        {/* Playlist Items */}
                        {[0, 1, 2].map((index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3 p-3 rounded-xl backdrop-blur-sm transition-all duration-300"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                            whileHover={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              x: 5,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className={`w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br ${
                              index === 0 ? 'from-spotify-green to-accent-green' :
                              index === 1 ? 'from-accent-purple to-accent-blue' :
                              'from-accent-blue to-cyan-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="h-2 bg-white/25 rounded-full w-full mb-1" />
                              <div className="h-1.5 bg-white/15 rounded-full w-2/3" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Decorative Elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl backdrop-blur-sm flex items-center justify-center"
                  style={{
                    background: 'rgba(29, 185, 84, 0.15)',
                    border: '1px solid rgba(29, 185, 84, 0.4)',
                    boxShadow: '0 8px 32px rgba(29, 185, 84, 0.2)',
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-8 h-8 text-spotify-green" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full"
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-xs text-white/50 mb-3 font-medium tracking-widest">SCROLL</span>
        <motion.button
          onClick={handleScrollDown}
          className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
          aria-label="Scroll to next section"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-spotify-green opacity-70" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;

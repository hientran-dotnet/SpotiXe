import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Music2 } from 'lucide-react';
import logo from '../img/spotixe-logo.png'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Premium', href: '#premium' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-spotify-black/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center space-x-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="SpotiXe Home"
          >
            <img src={logo} alt="SpotiXe Logo" className="w-8 h-8 lg:w-10 lg:h-10" />
            <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Spoti<span className="text-spotify-green">Xe</span>
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-spotify-gray hover:text-white transition-colors duration-300 text-sm lg:text-base font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-spotify-green group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.a
              href="#download"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-white hover:text-spotify-green transition-colors duration-300 font-medium text-sm lg:text-base"
            >
              Sign Up
            </motion.a>
            <motion.a
              href="#premium"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(29, 185, 84, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-spotify-green to-spotify-darkgreen text-spotify-black font-bold rounded-full hover:shadow-glow-green transition-all duration-300 text-sm lg:text-base"
            >
              Get Premium
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-spotify-green transition-colors p-2"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-spotify-gray/20">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-spotify-gray hover:text-white transition-colors duration-300 text-base font-medium py-2"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 space-y-3 border-t border-spotify-gray/20">
              <a
                href="#download"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center px-6 py-2.5 text-white hover:text-spotify-green transition-colors duration-300 font-medium border border-spotify-gray/30 rounded-full"
              >
                Sign Up
              </a>
              <a
                href="#premium"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center px-6 py-2.5 bg-gradient-to-r from-spotify-green to-spotify-darkgreen text-spotify-black font-bold rounded-full"
              >
                Get Premium
              </a>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
};

export default Header;

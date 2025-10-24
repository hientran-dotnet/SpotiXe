import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Careers', href: '#careers' },
        { name: 'Press', href: '#press' },
        { name: 'News', href: '#news' },
        { name: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Communities',
      links: [
        { name: 'For Artists', href: '#artists' },
        { name: 'Developers', href: '#developers' },
        { name: 'Advertising', href: '#advertising' },
        { name: 'Investors', href: '#investors' },
        { name: 'Vendors', href: '#vendors' },
      ],
    },
    {
      title: 'Useful Links',
      links: [
        { name: 'Support', href: '#support' },
        { name: 'Mobile App', href: '#mobile' },
        { name: 'Free Mobile App', href: '#free-app' },
        { name: 'Web Player', href: '#web-player' },
        { name: 'Gift Cards', href: '#gift-cards' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Cookie Policy', href: '#cookies' },
        { name: 'Licenses', href: '#licenses' },
        { name: 'Compliance', href: '#compliance' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
  ];

  return (
    <footer className="relative bg-spotify-black border-t border-white/10" aria-label="Footer">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.a
                href="#"
                className="flex items-center space-x-2 group mb-6"
                whileHover={{ scale: 1.05 }}
                aria-label="SpotiXe Home"
              >
                <div className="relative">
                  <Music2 className="w-10 h-10 text-spotify-green transition-transform group-hover:rotate-12" />
                  <div className="absolute inset-0 blur-xl bg-spotify-green/30 group-hover:bg-spotify-green/50 transition-all" />
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">
                  Spoti<span className="text-spotify-green">Xe</span>
                </span>
              </motion.a>
              
              <p className="text-spotify-gray text-sm mb-6 leading-relaxed">
                Your soundtrack to life. Stream millions of songs with crystal-clear quality.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-spotify-gray ${social.color} transition-colors duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-spotify-gray hover:text-white transition-colors duration-300 text-sm block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
              Stay in the Loop
            </h3>
            <p className="text-spotify-gray mb-6">
              Subscribe to our newsletter for the latest updates, exclusive offers, and new releases.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-spotify-gray" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-spotify-gray focus:outline-none focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all"
                  aria-label="Email address"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-spotify-green to-spotify-darkgreen text-spotify-black font-bold rounded-full hover:shadow-glow-green transition-all duration-300"
                aria-label="Subscribe"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 lg:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-spotify-gray text-sm text-center md:text-left">
              © {new Date().getFullYear()} SpotiXe. All rights reserved.
            </div>

            {/* Bottom Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a
                href="#privacy"
                className="text-spotify-gray hover:text-white transition-colors duration-300 text-sm"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="text-spotify-gray hover:text-white transition-colors duration-300 text-sm"
              >
                Terms
              </a>
              <a
                href="#cookies"
                className="text-spotify-gray hover:text-white transition-colors duration-300 text-sm"
              >
                Cookies
              </a>
              <a
                href="#ads"
                className="text-spotify-gray hover:text-white transition-colors duration-300 text-sm"
              >
                About Ads
              </a>
              <a
                href="#accessibility"
                className="text-spotify-gray hover:text-white transition-colors duration-300 text-sm"
              >
                Accessibility
              </a>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <select
                className="appearance-none bg-transparent border border-white/20 rounded-full px-4 py-2 pr-8 text-spotify-gray hover:text-white hover:border-white/40 transition-all cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green/20"
                aria-label="Select language"
              >
                <option value="en" className="bg-spotify-dark">English</option>
                <option value="es" className="bg-spotify-dark">Español</option>
                <option value="fr" className="bg-spotify-dark">Français</option>
                <option value="de" className="bg-spotify-dark">Deutsch</option>
                <option value="pt" className="bg-spotify-dark">Português</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-spotify-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-spotify-green to-transparent" />
    </footer>
  );
};

export default Footer;

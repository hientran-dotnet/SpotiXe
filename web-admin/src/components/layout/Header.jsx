import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebarStore';

const Header = () => {
  const { isCollapsed } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const notifications = [
    { id: 1, title: 'New user registered', time: '5 min ago', unread: true },
    { id: 2, title: 'Track uploaded for review', time: '1 hour ago', unread: true },
    { id: 3, title: 'Payment received', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header 
      className={cn(
        'fixed top-0 right-0 h-16 bg-admin-bg-card/80 backdrop-blur-lg border-b border-admin-border-default z-30 transition-all duration-300',
      )}
      style={{ left: isCollapsed ? '80px' : '260px' }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary" size={18} />
            <input
              type="text"
              placeholder="Search tracks, artists, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-admin-bg-hover border border-admin-border-default rounded-lg text-admin-text-primary placeholder:text-admin-text-tertiary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Theme Toggle */}
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-admin-bg-hover rounded-lg transition-colors text-admin-text-tertiary hover:text-admin-text-primary"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button> */}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-admin-bg-hover rounded-lg transition-colors text-admin-text-tertiary hover:text-admin-text-primary relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-apple-red rounded-full animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-admin-bg-card border border-admin-border-default rounded-lg shadow-2xl overflow-hidden z-20"
                  >
                    <div className="p-4 border-b border-admin-border-default">
                      <h3 className="font-semibold text-admin-text-primary">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto scrollbar-thin">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            'p-4 hover:bg-admin-bg-hover transition-colors cursor-pointer border-b border-admin-border-default last:border-b-0',
                            notif.unread && 'bg-admin-bg-hover/50'
                          )}
                        >
                          <p className="text-sm text-admin-text-primary font-medium">
                            {notif.title}
                          </p>
                          <p className="text-xs text-admin-text-tertiary mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-admin-border-default">
                      <button className="w-full text-sm text-spotify-green hover:text-spotify-green/80 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-admin-bg-hover rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AD</span>
              </div>
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-admin-bg-card border border-admin-border-default rounded-lg shadow-2xl overflow-hidden z-20"
                  >
                    <div className="p-4 border-b border-admin-border-default">
                      <p className="font-semibold text-admin-text-primary">Admin User</p>
                      <p className="text-sm text-admin-text-tertiary">admin@spotixe.com</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded-lg transition-colors text-admin-text-secondary hover:text-admin-text-primary">
                        <User size={18} />
                        <span className="text-sm">Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded-lg transition-colors text-admin-text-secondary hover:text-admin-text-primary">
                        <Settings size={18} />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-admin-bg-hover rounded-lg transition-colors text-apple-red hover:text-apple-red/80">
                        <LogOut size={18} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

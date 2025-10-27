import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Music,
  Mic2,
  Users,
  BarChart3,
  ListMusic,
  Crown,
  DollarSign,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebarStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Music Management', href: '/music', icon: Music },
  { name: 'Artists & Albums', href: '/artists', icon: Mic2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Playlists', href: '/playlists', icon: ListMusic },
  { name: 'Premium Plans', href: '/premium', icon: Crown },
  { name: 'Revenue', href: '/revenue', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, toggle } = useSidebarStore();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-admin-bg-primary border-r border-admin-border-default z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-admin-border-default">
        <motion.div
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {!isCollapsed && (
            <>
              <img 
                src="/spotixe-logo.png" 
                alt="SpotiXe Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-admin-text-primary">
                SpotiXe
              </span>
            </>
          )}
        </motion.div>

        <button
          onClick={toggle}
          className="p-1.5 hover:bg-admin-bg-hover rounded-lg transition-colors text-admin-text-tertiary hover:text-admin-text-primary"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-gradient-primary text-white shadow-glow-green'
                      : 'text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-bg-hover'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={20} className={cn('flex-shrink-0', isActive && 'text-white')} />
                  
                  <motion.span
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'font-medium whitespace-nowrap',
                      isCollapsed && 'hidden'
                    )}
                  >
                    {item.name}
                  </motion.span>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-admin-bg-card border border-admin-border-default rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Date Time Display (bottom) */}
      <div className="p-3 border-t border-admin-border-default">
        <div className={cn(
          'px-3 py-3 rounded-lg bg-admin-bg-hover/50 border border-admin-border-default',
          isCollapsed && 'px-2'
        )}>
          {!isCollapsed ? (
            <div className="space-y-2">
              {/* Time */}
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-spotify-green flex-shrink-0" />
                <span className="text-lg font-bold text-admin-text-primary tabular-nums">
                  {currentDateTime.toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false 
                  })}
                </span>
              </div>
              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-admin-text-tertiary flex-shrink-0" />
                <span className="text-xs text-admin-text-secondary">
                  {currentDateTime.toLocaleDateString('vi-VN', { 
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Clock size={18} className="text-spotify-green" />
              <span className="text-[10px] font-bold text-admin-text-primary tabular-nums">
                {currentDateTime.toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

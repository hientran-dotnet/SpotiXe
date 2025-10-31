import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebarStore } from '@/store/sidebarStore';

const MainLayout = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-admin-bg-primary">
      <Sidebar />
      <Header />
      <motion.main
        animate={{ 
          marginLeft: isCollapsed ? '80px' : '260px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default MainLayout;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import MusicManagement from './pages/MusicManagement';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import LoginPage from './pages/LoginPage';

// Placeholder components for remaining pages
const Artists = () => (
  <div className="text-admin-text-primary">
    <h1 className="text-3xl font-bold">Artists & Albums</h1>
    <p className="text-admin-text-secondary mt-2">Artists management page coming soon...</p>
  </div>
);

const Playlists = () => (
  <div className="text-admin-text-primary">
    <h1 className="text-3xl font-bold">Playlists Management</h1>
    <p className="text-admin-text-secondary mt-2">Playlists management page coming soon...</p>
  </div>
);

const Premium = () => (
  <div className="text-admin-text-primary">
    <h1 className="text-3xl font-bold">Premium Plans</h1>
    <p className="text-admin-text-secondary mt-2">Premium plans management page coming soon...</p>
  </div>
);

const Revenue = () => (
  <div className="text-admin-text-primary">
    <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
    <p className="text-admin-text-secondary mt-2">Revenue analytics page coming soon...</p>
  </div>
);

const Reports = () => (
  <div className="text-admin-text-primary">
    <h1 className="text-3xl font-bold">Reports & Insights</h1>
    <p className="text-admin-text-secondary mt-2">Reports page coming soon...</p>
  </div>
);

const Settings = () => (
  <div className="text-admin-text-primary">
    <h1 className="text-3xl font-bold">Settings</h1>
    <p className="text-admin-text-secondary mt-2">Settings page coming soon...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Login Route - No Layout */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Routes - With Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="music" element={<MusicManagement />} />
          <Route path="artists" element={<Artists />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="premium" element={<Premium />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

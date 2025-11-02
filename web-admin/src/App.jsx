import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import MusicManagement from './pages/MusicManagement';
import SongDetail from './pages/songs/SongDetail';
import CreateSong from './pages/songs/CreateSong';
import UpdateSong from './pages/songs/UpdateSong';
import ArtistManagement from './pages/ArtistManagement';
import CreateArtist from './pages/artists/CreateArtist';
import UpdateArtist from './pages/artists/UpdateArtist';
import ArtistDetail from './pages/artists/ArtistDetail';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import LoginPage from './pages/LoginPage';

// Placeholder components for remaining pages
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
        {/* Public Route - Login */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes - With Layout */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="music" element={<MusicManagement />} />
            <Route path="songs/create" element={<CreateSong />} />
            <Route path="songs/:id/edit" element={<UpdateSong />} />
            <Route path="songs/:id" element={<SongDetail />} />
            <Route path="artists" element={<ArtistManagement />} />
            <Route path="artists/create" element={<CreateArtist />} />
            <Route path="artists/:id/edit" element={<UpdateArtist />} />
            <Route path="artists/:id" element={<ArtistDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="premium" element={<Premium />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

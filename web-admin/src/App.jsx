import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from '@components/layout/MainLayout'
import PrivateRoute from '@components/routes/PrivateRoute'
import PublicRoute from '@components/routes/PublicRoute'

// Eager loading - Import all pages directly for instant navigation
import Dashboard from '@pages/Dashboard'
import MusicManagement from '@pages/MusicManagement'
import ArtistsAlbums from '@pages/ArtistsAlbums'
import UsersManagement from '@pages/UsersManagement'
import Analytics from '@pages/Analytics'
import Playlists from '@pages/Playlists'
import PremiumPlans from '@pages/PremiumPlans'
import Revenue from '@pages/Revenue'
import Reports from '@pages/Reports'
import Settings from '@pages/Settings'
import LoginPage from '@pages/LoginPage'
import NotFound from '@pages/NotFound'

// Song management pages
import AddSong from '@pages/songs/AddSong'
import EditSong from '@pages/songs/EditSong'
import ViewSong from '@pages/songs/ViewSong'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route - Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="songs" element={<MusicManagement />} />
          
          {/* Song routes */}
          <Route path="songs/add" element={<AddSong />} />
          <Route path="songs/:id" element={<ViewSong />} />
          <Route path="songs/:id/edit" element={<EditSong />} />
          
          <Route path="artists" element={<ArtistsAlbums />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="premium" element={<PremiumPlans />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

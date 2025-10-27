import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = () => {
  const { user, loading, domainAuthorized } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-admin-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-spotify-green animate-spin" />
          <p className="text-admin-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Check both user existence and domain authorization
  return (user && domainAuthorized) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

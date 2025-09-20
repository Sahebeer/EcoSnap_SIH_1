import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { PrivateRouteProps } from '../../types';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'location:', location.pathname);

  if (isLoading) {
    console.log('PrivateRoute - showing loading spinner');
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute - not authenticated, redirecting to login from:', location.pathname);
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute - authenticated, rendering children for:', location.pathname);
  return <>{children}</>;
};

export default PrivateRoute;
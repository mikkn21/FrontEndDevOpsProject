import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin, element }) => {
  const isAuthenticated = !!Cookies.get('token');
  const isAdmin = !!Cookies.get('adminToken'); // Check for admin token
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  } else if (!isAuthenticated && !isAdmin) {
    // Allow admins to access without the regular auth token
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;

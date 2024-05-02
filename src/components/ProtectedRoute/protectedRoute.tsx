import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TOKEN_NAME, getCookieRole } from '../../utils/cookieUtils';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin, element }) => {
  const isAuthenticated = !!Cookies.get(TOKEN_NAME);
  const role = getCookieRole();

  if (requireAdmin && isAuthenticated && role != 'admin') {
    // Redirect to home if the user is not an admin and display error message
    return <Navigate to="/" replace />;
  } 

  if (!isAuthenticated) {
    // Redirect to login page if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;

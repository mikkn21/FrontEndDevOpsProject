import React from "react";
import { Navigate } from "react-router-dom";
import { getCookieRole } from "../../utils/cookieUtils";
import { loginResponse } from "../../pages/login/login";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin,
  element,
}) => {
  const isAuthenticated = loginResponse.token != "";
  const role = getCookieRole();

  if (requireAdmin && isAuthenticated && role != "admin") {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    // Redirect to login page if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;

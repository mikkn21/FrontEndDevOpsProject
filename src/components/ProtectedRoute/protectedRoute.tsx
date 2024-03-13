import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  requireAdmin?: boolean; // allows us to specify whether a page is only for admins
  element: React.ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const isAuthenticated = false; // Replace with actual authentication logic
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // If not authenticated or not ADMIN send to login screen
  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/login" replace />; // Redirect to login with 'replace' for history
  }

  return element;
};

export default ProtectedRoute;

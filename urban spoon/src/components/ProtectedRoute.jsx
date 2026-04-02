import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getRoleHomePath(role) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();
  const currentRole = String(user?.role || "user").toLowerCase();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(234,46,96,0.2)] border-t-[#ea2e60]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase());
    if (!normalizedAllowedRoles.includes(currentRole)) {
      return <Navigate to={getRoleHomePath(currentRole)} replace />;
    }
  }

  return children;
}

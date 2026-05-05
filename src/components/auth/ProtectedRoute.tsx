import React from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  fallback: React.ReactNode;
}

/**
 * Renders children when authenticated, fallback (login page) otherwise.
 * Kept simple — no router dependency — since the app uses view-state navigation.
 */
export function ProtectedRoute({
  isAuthenticated,
  children,
  fallback,
}: ProtectedRouteProps): React.ReactElement {
  return <>{isAuthenticated ? children : fallback}</>;
}

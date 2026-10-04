import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Spinner';

export const homePathFor = (user) => (user.role === 'faculty' ? '/faculty' : '/dashboard');

// Requires a logged-in user, and optionally one of the given roles.
export function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathFor(user)} replace />;
  return children;
}

// Login / register pages are for logged-out visitors only.
export function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to={homePathFor(user)} replace />;
  return children;
}

export function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return <Navigate to={user ? homePathFor(user) : '/login'} replace />;
}

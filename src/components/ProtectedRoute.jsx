import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Memverifikasi Sesi Anda..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

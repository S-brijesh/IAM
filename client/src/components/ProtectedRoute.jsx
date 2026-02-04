import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false, hrOnly = false }) => {
    const { isAuthenticated, isITAdmin, isHRManager, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isITAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (hrOnly && !isHRManager) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

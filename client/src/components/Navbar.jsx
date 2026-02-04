import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, User, LayoutDashboard, Users, Shield, Activity, Bell } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, isHRManager, isITAdmin, logout, user } = useAuth();
    const location = useLocation();

    // Helper function to check if a path is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Building2 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            TechCorp Employee Portal
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                                        isActive('/dashboard')
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>

                                {isHRManager && (
                                    <>
                                        <Link
                                            to="/hr"
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                                                isActive('/hr')
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>HR Portal</span>
                                        </Link>
                                        <Link
                                            to="/announcements"
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                                                isActive('/announcements')
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <Bell className="h-4 w-4" />
                                            <span>Announcements</span>
                                        </Link>
                                    </>
                                )}

                                {isITAdmin && (
                                    <>
                                        <Link
                                            to="/admin"
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                                                isActive('/admin')
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <Shield className="h-4 w-4" />
                                            <span>Admin</span>
                                        </Link>
                                        <Link
                                            to="/users"
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                                                isActive('/users')
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>Users</span>
                                        </Link>
                                        <Link
                                            to="/audit-logs"
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                                                isActive('/audit-logs')
                                                    ? 'bg-primary text-white'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            <Activity className="h-4 w-4" />
                                            <span>Audit Logs</span>
                                        </Link>
                                    </>
                                )}

                                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                                    <User className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.role?.replace('_', ' ')}
                                    </span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        isActive('/login')
                                            ? 'bg-gray-200 font-medium'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        isActive('/register')
                                            ? 'bg-indigo-700 text-white'
                                            : 'bg-primary text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

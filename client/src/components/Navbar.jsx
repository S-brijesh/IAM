import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogOut, User, LayoutDashboard, Users, Shield, Activity, Bell } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, isHRManager, isITAdmin, logout, user } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Building2 className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            SecureIAM Portal
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>

                                {isHRManager && (
                                    <>
                                        <Link
                                            to="/hr"
                                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>HR Portal</span>
                                        </Link>
                                        <Link
                                            to="/announcements"
                                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
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
                                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                                        >
                                            <Shield className="h-4 w-4" />
                                            <span>Admin</span>
                                        </Link>
                                        <Link
                                            to="/users"
                                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>Users</span>
                                        </Link>
                                        <Link
                                            to="/audit-logs"
                                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
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
                                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-indigo-700 transition-colors"
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

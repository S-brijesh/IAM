import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Shield className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            SecureIAM
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>

                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-indigo-700 transition-colors"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span>Admin</span>
                                    </Link>
                                )}

                                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                                    <User className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.role}
                                    </span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
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

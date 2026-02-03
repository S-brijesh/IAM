import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import { User, Mail, Shield, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            setProfile(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Welcome Header */}
                    <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
                        <p className="text-indigo-100">
                            You're logged in as <span className="font-semibold">{user?.role}</span>
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex items-center mb-6">
                            <div className="bg-primary p-4 rounded-full">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
                                <p className="text-gray-600">View your account information</p>
                            </div>
                        </div>

                        {error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                {error}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <User className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">User ID</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {profile?.user?.userId || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <Shield className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {profile?.user?.role || user?.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="text-lg font-semibold text-green-600">Active</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <Calendar className="h-6 w-6 text-primary mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-600">Last Login</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Account Type</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {user?.role === 'ADMIN' ? 'Administrator' : 'Standard User'}
                                    </p>
                                </div>
                                <Shield className="h-12 w-12 text-primary opacity-20" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Security Level</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">High</p>
                                </div>
                                <CheckCircle className="h-12 w-12 text-green-500 opacity-20" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Authentication</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">JWT</p>
                                </div>
                                <Mail className="h-12 w-12 text-primary opacity-20" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
                    >
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                            🎉 Welcome to SecureIAM Dashboard
                        </h3>
                        <p className="text-blue-700">
                            Your account is secured with industry-standard encryption and authentication.
                            All activities are logged for security purposes.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;

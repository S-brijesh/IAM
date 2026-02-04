import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import { User, Mail, Shield, Calendar, CheckCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, announcementsRes] = await Promise.all([
                userAPI.getProfile(),
                userAPI.getAnnouncements()
            ]);
            setProfile(profileRes.data);
            setAnnouncements(announcementsRes.data.announcements);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
                                            {profile?.user?.username || 'N/A'}
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

                    {/* Announcements Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8 mb-8"
                    >
                        <div className="flex items-center mb-6">
                            <Bell className="h-6 w-6 text-primary mr-2" />
                            <h2 className="text-2xl font-bold text-gray-900">Company Announcements</h2>
                        </div>

                        {announcements.length === 0 ? (
                            <div className="text-center py-8">
                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No announcements at this time</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {announcements.slice(0, 5).map((announcement) => (
                                    <div
                                        key={announcement._id}
                                        className={`p-4 rounded-lg border-l-4 ${
                                            announcement.priority === 'HIGH' ? 'border-red-500 bg-red-50' :
                                            announcement.priority === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
                                            'border-green-500 bg-green-50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                                        {announcement.priority}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 text-sm mb-2">{announcement.content}</p>
                                                <p className="text-xs text-gray-500">
                                                    Posted {new Date(announcement.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

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
                                        {user?.role === 'IT_ADMIN' ? 'Administrator' : 
                                         user?.role === 'HR_MANAGER' ? 'HR Manager' : 'Employee'}
                                    </p>
                                </div>
                                <Shield className="h-12 w-12 text-primary opacity-20" />
                            </div>
                        </motion.div>                        
                    </div>                
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;

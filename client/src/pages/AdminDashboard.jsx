import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Shield, Users, Activity, Lock, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await adminAPI.getDashboard();
            setDashboardData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load admin dashboard');
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

    const stats = [
        {
            title: 'Total Users',
            value: dashboardData?.statistics?.totalUsers || 0,
            icon: <Users className="h-8 w-8" />,
            color: 'bg-blue-500',
            trend: `+${dashboardData?.statistics?.newUsers || 0} this week`,
        },
        {
            title: 'Active Sessions',
            value: dashboardData?.statistics?.activeSessions || 0,
            icon: <Activity className="h-8 w-8" />,
            color: 'bg-green-500',
            trend: 'Last 24h',
        },
        {
            title: 'Security Events',
            value: dashboardData?.statistics?.securityEvents || 0,
            icon: <AlertCircle className="h-8 w-8" />,
            color: 'bg-yellow-500',
            trend: 'Failed logins',
        },
        {
            title: 'Admin Users',
            value: dashboardData?.statistics?.adminUsers || 0,
            icon: <Shield className="h-8 w-8" />,
            color: 'bg-purple-500',
            trend: 'IT Admins',
        },
    ];

    const recentActivities = dashboardData?.recentActivities || [];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Admin Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <div className="flex items-center">
                            <Shield className="h-12 w-12 mr-4" />
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                                <p className="text-purple-100">
                                    {dashboardData?.message || 'Welcome Admin - System Overview'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                        {stat.icon}
                                    </div>
                                    <div className="flex items-center space-x-1 text-green-600">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-sm font-semibold">{stat.trend}</span>
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <div className="flex items-center mb-6">
                            <Activity className="h-6 w-6 text-primary mr-2" />
                            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`w-2 h-2 rounded-full ${activity.status === 'success'
                                                    ? 'bg-green-500'
                                                    : activity.status === 'error'
                                                        ? 'bg-red-500'
                                                        : 'bg-blue-500'
                                                }`}
                                        ></div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{activity.user}</p>
                                            <p className="text-sm text-gray-600">{activity.action}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* System Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <Lock className="h-6 w-6 text-green-500 mr-2" />
                                <h3 className="text-xl font-bold text-gray-900">Security Status</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Encryption</span>
                                    <span className="text-green-600 font-semibold">Active</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">JWT Authentication</span>
                                    <span className="text-green-600 font-semibold">Enabled</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Audit Logging</span>
                                    <span className="text-green-600 font-semibold">Running</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <Shield className="h-6 w-6 text-blue-500 mr-2" />
                                <h3 className="text-xl font-bold text-gray-900">System Health</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Database</span>
                                    <span className="text-green-600 font-semibold">
                                        {dashboardData?.systemHealth?.database || 'Healthy'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">API Server</span>
                                    <span className="text-green-600 font-semibold">
                                        {dashboardData?.systemHealth?.apiServer || 'Online'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Response Time</span>
                                    <span className="text-green-600 font-semibold">
                                        {dashboardData?.systemHealth?.responseTime || '45ms'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;

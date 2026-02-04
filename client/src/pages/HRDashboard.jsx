import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hrAPI } from '../utils/api';
import { Users, TrendingUp, Bell, Building, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const HRDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await hrAPI.getDashboard();
            setStats(response.data.statistics);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        HR Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage employees and company announcements
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Employees */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalEmployees || 0}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Hires */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-secondary"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Recent Hires (30d)</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.recentHires || 0}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <TrendingUp className="h-8 w-8 text-secondary" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Active Announcements */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Announcements</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.activeAnnouncements || 0}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Bell className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Departments */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Departments</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.employeesByDepartment?.length || 0}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Building className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Department Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Employees by Department */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Employees by Department
                        </h2>
                        <div className="space-y-3">
                            {stats?.employeesByDepartment?.map((dept, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">{dept._id}</span>
                                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {dept.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Employees by Role */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Employees by Role
                        </h2>
                        <div className="space-y-3">
                            {stats?.employeesByRole?.map((role, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">
                                        {role._id.replace('_', ' ')}
                                    </span>
                                    <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {role.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;

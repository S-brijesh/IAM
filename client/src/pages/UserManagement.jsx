import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Users, Search, Edit, Trash2, UserCheck, UserX, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
        // Get current user ID from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUserId(user.userId);
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getAllUsers();
            setUsers(response.data.users);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setLoading(false);
        }
    };

    const handleDeactivate = async (userId, userRole) => {
        // Check if trying to deactivate self
        if (userId === currentUserId) {
            alert('You cannot deactivate yourself!');
            return;
        }

        // Check if trying to deactivate another admin
        if (userRole === 'IT_ADMIN') {
            alert('You cannot deactivate other administrators!');
            return;
        }

        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await adminAPI.deleteUser(userId);
                fetchUsers();
            } catch (err) {
                console.error('Failed to deactivate user:', err);
                alert(err.response?.data?.message || 'Failed to deactivate user');
            }
        }
    };

    const handleActivate = async (userId) => {
        if (window.confirm('Are you sure you want to activate this user?')) {
            try {
                await adminAPI.activateUser(userId);
                fetchUsers();
            } catch (err) {
                console.error('Failed to activate user:', err);
                alert(err.response?.data?.message || 'Failed to activate user');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

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
                >
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Users className="h-10 w-10 text-primary mr-4" />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                                    <p className="text-gray-600">Manage all system users</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-primary">{users.length}</p>
                                <p className="text-sm text-gray-600">Total Users</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="EMPLOYEE">Employee</option>
                                <option value="HR_MANAGER">HR Manager</option>
                                <option value="IT_ADMIN">IT Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName || ''} {user.lastName || ''}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'IT_ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'HR_MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.department || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.isActive ? (
                                                    <span className="flex items-center text-green-600">
                                                        <UserCheck className="h-4 w-4 mr-1" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-600">
                                                        <UserX className="h-4 w-4 mr-1" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.isActive ? (
                                                        <button
                                                            onClick={() => handleDeactivate(user._id, user.role)}
                                                            disabled={user._id === currentUserId || user.role === 'IT_ADMIN'}
                                                            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                                                                user._id === currentUserId || user.role === 'IT_ADMIN'
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            }`}
                                                            title={
                                                                user._id === currentUserId 
                                                                    ? 'Cannot deactivate yourself' 
                                                                    : user.role === 'IT_ADMIN' 
                                                                    ? 'Cannot deactivate administrators' 
                                                                    : 'Deactivate user'
                                                            }
                                                        >
                                                            <UserX className="h-4 w-4" />
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivate(user._id)}
                                                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                            title="Activate user"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                            Activate
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserManagement;

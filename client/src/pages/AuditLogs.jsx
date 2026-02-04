import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Activity, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterAction, setFilterAction] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [filterAction]);

    const fetchLogs = async () => {
        try {
            const response = await adminAPI.getAuditLogs(filterAction);
            setLogs(response.data.logs);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        if (action.includes('SUCCESS') || action.includes('CREATED')) return 'text-green-600 bg-green-50';
        if (action.includes('FAILED') || action.includes('DELETED')) return 'text-red-600 bg-red-50';
        if (action.includes('UPDATED')) return 'text-blue-600 bg-blue-50';
        return 'text-gray-600 bg-gray-50';
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
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Activity className="h-10 w-10 mr-4" />
                                <div>
                                    <h1 className="text-3xl font-bold">Audit Logs</h1>
                                    <p className="text-indigo-100">System activity monitoring</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex items-center space-x-4">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filter by action"
                                value={filterAction}
                                onChange={(e) => setFilterAction(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Timestamp
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.map((log) => (
                                        <tr key={log._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Unknown'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {log.userId?.email || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
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

export default AuditLogs;

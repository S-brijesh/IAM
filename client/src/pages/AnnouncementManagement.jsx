import { useState, useEffect } from 'react';
import { hrAPI } from '../utils/api';
import { Bell, Plus, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await hrAPI.getAnnouncements();
            setAnnouncements(response.data.announcements);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch announcements:', err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await hrAPI.postAnnouncement(formData);
            setFormData({ title: '', content: '', priority: 'MEDIUM' });
            setShowForm(false);
            fetchAnnouncements();
        } catch (err) {
            console.error('Failed to post announcement:', err);
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
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Bell className="h-10 w-10 mr-4" />
                                <div>
                                    <h1 className="text-3xl font-bold">Announcements</h1>
                                    <p className="text-blue-100">Manage company-wide announcements</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                New Announcement
                            </button>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-white rounded-xl shadow-lg p-8 mb-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Announcement</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter announcement title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter announcement content"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                    >
                                        Post Announcement
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Announcements List */}
                    <div className="space-y-6">
                        {announcements.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No announcements yet</p>
                            </div>
                        ) : (
                            announcements.map((announcement) => (
                                <motion.div
                                    key={announcement._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                                        announcement.priority === 'HIGH' ? 'border-red-500' :
                                        announcement.priority === 'MEDIUM' ? 'border-yellow-500' :
                                        'border-green-500'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {announcement.title}
                                                </h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                                    {announcement.priority}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-4">{announcement.content}</p>
                                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                <span>
                                                    Posted by: {announcement.postedBy?.firstName} {announcement.postedBy?.lastName}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnnouncementManagement;

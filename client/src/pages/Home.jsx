import { Link } from 'react-router-dom';
import { Building2, Users, Bell, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const features = [
        {
            icon: <Building2 className="h-12 w-12 text-primary" />,
            title: 'Employee Management',
            description: 'Comprehensive employee records and department organization',
        },
        {
            icon: <Users className="h-12 w-12 text-secondary" />,
            title: 'Role-Based Access',
            description: 'Secure access control for Employees, HR Managers, and IT Admins',
        },
        {
            icon: <Bell className="h-12 w-12 text-primary" />,
            title: 'Company Announcements',
            description: 'Keep everyone informed with company-wide communications',
        },
        {
            icon: <TrendingUp className="h-12 w-12 text-secondary" />,
            title: 'HR Analytics',
            description: 'Data-driven insights for better workforce management',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <Building2 className="h-20 w-20" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            TechCorp Employee Portal
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Your gateway to company resources, team collaboration, and professional growth
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Join TechCorp
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                            >
                                Employee Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why TechCorp Portal?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need for efficient workforce management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Join Our Team?</h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Access your employee dashboard, connect with colleagues, and stay updated
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Create Your Account
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;


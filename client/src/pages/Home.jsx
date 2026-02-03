import { Link } from 'react-router-dom';
import { Shield, Lock, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const features = [
        {
            icon: <Shield className="h-12 w-12 text-primary" />,
            title: 'Secure Authentication',
            description: 'Industry-standard JWT-based authentication with bcrypt password hashing',
        },
        {
            icon: <Lock className="h-12 w-12 text-primary" />,
            title: 'Role-Based Access',
            description: 'Granular access control with USER and ADMIN roles',
        },
        {
            icon: <Users className="h-12 w-12 text-primary" />,
            title: 'User Management',
            description: 'Complete user lifecycle management with audit logging',
        },
        {
            icon: <CheckCircle className="h-12 w-12 text-primary" />,
            title: 'Audit Trail',
            description: 'Track all authentication events and user activities',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Secure Identity & Access Management
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                            Enterprise-grade IAM system built with modern security practices
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                            >
                                Sign In
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
                            Why Choose SecureIAM?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Built with security, scalability, and user experience in mind
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
            <section className="py-20 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 text-indigo-100">
                        Join thousands of users who trust SecureIAM for their identity management needs
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

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle, UserPlus, Building, Briefcase, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'EMPLOYEE',
        department: 'Engineering',
        position: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Validation functions
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    error = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
                } else if (value.trim().length < 2) {
                    error = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
                } else if (value.trim().length > 50) {
                    error = `${name === 'firstName' ? 'First' : 'Last'} name must not exceed 50 characters`;
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                    error = `${name === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, hyphens, and apostrophes`;
                }
                break;

            case 'username':
                if (!value.trim()) {
                    error = 'Username is required';
                } else if (value.length < 3) {
                    error = 'Username must be at least 3 characters';
                } else if (value.length > 30) {
                    error = 'Username must not exceed 30 characters';
                } else if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
                    error = 'Username can only contain letters, numbers, dots, hyphens, and underscores';
                } else if (/^[._-]/.test(value) || /[._-]$/.test(value)) {
                    error = 'Username cannot start or end with special characters';
                }
                break;

            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                } else if (value.length > 100) {
                    error = 'Email must not exceed 100 characters';
                }
                break;

            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 8) {
                    error = 'Password must be at least 8 characters';
                } else if (value.length > 128) {
                    error = 'Password must not exceed 128 characters';
                } else if (!/(?=.*[a-z])/.test(value)) {
                    error = 'Password must contain at least one lowercase letter';
                } else if (!/(?=.*[A-Z])/.test(value)) {
                    error = 'Password must contain at least one uppercase letter';
                } else if (!/(?=.*\d)/.test(value)) {
                    error = 'Password must contain at least one number';
                } else if (!/(?=.*[@$!%*?&])/.test(value)) {
                    error = 'Password must contain at least one special character (@$!%*?&)';
                } else if (/\s/.test(value)) {
                    error = 'Password cannot contain spaces';
                }
                break;

            case 'confirmPassword':
                if (!value) {
                    error = 'Please confirm your password';
                } else if (value !== formData.password) {
                    error = 'Passwords do not match';
                }
                break;

            case 'phoneNumber':
                if (value && value.trim()) {
                    // Remove all non-digit characters for validation
                    const digitsOnly = value.replace(/\D/g, '');
                    if (digitsOnly.length < 10) {
                        error = 'Phone number must be at least 10 digits';
                    } else if (digitsOnly.length > 15) {
                        error = 'Phone number must not exceed 15 digits';
                    } else if (!/^[\d\s+()-]+$/.test(value)) {
                        error = 'Phone number can only contain digits, spaces, +, -, and ()';
                    }
                }
                break;

            case 'position':
                if (value && value.trim()) {
                    if (value.trim().length < 2) {
                        error = 'Position must be at least 2 characters';
                    } else if (value.trim().length > 100) {
                        error = 'Position must not exceed 100 characters';
                    }
                }
                break;

            default:
                break;
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value,
        });

        // Real-time validation
        const error = validateField(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));

        // Clear general error when user starts typing
        if (error === '') {
            setError('');
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validate all fields
        const errors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'confirmPassword') {
                const error = validateField(key, formData[key]);
                if (error) errors[key] = error;
            }
        });

        // Validate confirm password separately
        const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
        if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

        setFieldErrors(errors);

        // If there are any errors, don't submit
        if (Object.keys(errors).length > 0) {
            setError('Please fix all validation errors before submitting');
            return;
        }

        setLoading(true);

        // Remove confirmPassword before sending
        const { confirmPassword, ...employeeData } = formData;

        const result = await register(employeeData);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            // Handle specific field errors from backend
            if (result.field) {
                setFieldErrors(prev => ({
                    ...prev,
                    [result.field]: result.message
                }));
            }
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl"
            >
                <div>
                    <div className="flex justify-center">
                        <div className="bg-secondary p-3 rounded-full">
                            <UserPlus className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Join TechCorp Solutions
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary hover:text-blue-800"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2"
                    >
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm text-red-700">{error}</span>
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2"
                    >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-green-700">
                            Registration successful! Redirecting to login...
                        </span>
                    </motion.div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.firstName ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="John"
                                />
                            </div>
                            {fieldErrors.firstName && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.lastName ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="Doe"
                                />
                            </div>
                            {fieldErrors.lastName && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.username ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="johndoe"
                                />
                            </div>
                            {fieldErrors.username && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.email ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="john@techcorp.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Department */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                Department *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Human Resources">Human Resources</option>
                                    <option value="IT Operations">IT Operations</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                </select>
                            </div>
                        </div>

                        {/* Position */}
                        <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="position"
                                    name="position"
                                    type="text"
                                    value={formData.position}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.position ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.position ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="Software Engineer"
                                />
                            </div>
                            {fieldErrors.position && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.position}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.phoneNumber ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            {fieldErrors.phoneNumber && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Role *
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="HR_MANAGER">HR Manager</option>
                                <option value="IT_ADMIN">IT Administrator</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Select your role based on your responsibilities
                            </p>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.password ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                            )}
                            {!fieldErrors.password && formData.password && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Must be 8+ chars with uppercase, lowercase, number & special char
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                                        fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        fieldErrors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-primary'
                                    } focus:border-transparent transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
